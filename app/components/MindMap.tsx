"use client";

import { useMemo, useEffect } from "react";
import ReactFlow, {
    Node,
    Edge,
    Background,
    Controls,
    Panel,
    useNodesState,
    useEdgesState,
    ReactFlowProvider,
    useReactFlow,
    MarkerType,
    getRectOfNodes
} from "reactflow";
import "reactflow/dist/style.css";
import { BraceNode } from "@/app/lib/braceMapSchema";
import { BRANCH_COLORS } from "@/app/lib/mapColors";
import dagre from "dagre";
import { toPng } from "html-to-image";

/* ==================== CONFIGURATION ==================== */

const NODE_WIDTH = 250;
const NODE_HEIGHT = 80;

/* ==================== LAYOUT HELPER ==================== */

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = "LR") => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const isHorizontal = direction === "LR";
    dagreGraph.setGraph({ rankdir: direction, ranksep: 180, nodesep: 60 });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.targetPosition = isHorizontal ? ("left" as any) : "top";
        node.sourcePosition = isHorizontal ? ("right" as any) : "bottom";

        // We are shifting the dagre node position (anchor=center center) to the top left
        // so it matches the React Flow node anchor point (top left).
        node.position = {
            x: nodeWithPosition.x - NODE_WIDTH / 2,
            y: nodeWithPosition.y - NODE_HEIGHT / 2,
        };

        return node;
    });

    return { nodes: layoutedNodes, edges };
};

/* ==================== FLATTEN TREE ==================== */

function flattenTree(
    node: BraceNode,
    parentId: string | null = null,
    depth: number = 0,
    branchIndex: number = 0
): { nodes: Node[]; edges: Edge[] } {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const isRoot = depth === 0;

    // Minimal & Modern Node Styling
    let style: React.CSSProperties = {
        padding: "12px 24px",
        borderRadius: "12px",
        minWidth: NODE_WIDTH,
        fontSize: isRoot ? "16px" : "14px",
        fontWeight: isRoot ? 700 : 500,
        textAlign: "center",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        border: "1px solid",
        transition: "all 0.2s ease",
    };

    const color = BRANCH_COLORS[branchIndex % BRANCH_COLORS.length];

    if (isRoot) {
        style = {
            ...style,
            background: "#0f172a",
            color: "#ffffff",
            borderColor: "#0f172a",
            minWidth: 280,
        };
    } else {
        // Light minimalist theme for children
        style = {
            ...style,
            background: "#ffffff",
            color: "#1e293b",
            borderColor: color, // Use branch color for border
        };
    }

    nodes.push({
        id: node.id,
        data: { label: node.label },
        position: { x: 0, y: 0 }, // Initial position, will be computed by dagre
        style,
        type: "default",
    });

    if (parentId) {
        edges.push({
            id: `${parentId}-${node.id}`,
            source: parentId,
            target: node.id,
            type: "straight", // Clean straight lines or 'smoothstep'
            style: { stroke: "#cbd5e1", strokeWidth: 1.5 },
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#cbd5e1",
                width: 15,
                height: 15,
            },
        });
    }

    if (node.children) {
        node.children.forEach((child, index) => {
            // Pass branchIndex down. For root's immediate children, assign a new index.
            // For deeper levels, keep the index (inheriting color).
            const newBranchIndex = isRoot ? index : branchIndex;
            const result = flattenTree(child, node.id, depth + 1, newBranchIndex);
            nodes.push(...result.nodes);
            edges.push(...result.edges);
        });
    }

    return { nodes, edges };
}

/* ==================== INNER COMPONENT ==================== */

function MindMapContent({ root }: { root: BraceNode }) {
    const { fitView, getNodes } = useReactFlow();

    // Initial data processing
    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
        return flattenTree(root);
    }, [root]);

    // Layouting
    const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
        return getLayoutedElements(initialNodes, initialEdges);
    }, [initialNodes, initialEdges]);

    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

    // Download functionality
    const downloadImage = () => {
        const nodes = getNodes();
        if (nodes.length === 0) return;

        const bounds = getRectOfNodes(nodes);
        const padding = 50;
        const width = bounds.width + padding * 2;
        const height = bounds.height + padding * 2;

        const selector = ".react-flow__viewport";
        const element = document.querySelector(selector) as HTMLElement;

        if (!element) return;

        toPng(element, {
            backgroundColor: "#f8fafc",
            width: width,
            height: height,
            style: {
                width: `${width}px`,
                height: `${height}px`,
                transform: `translate(${-(bounds.x - padding)}px, ${-(bounds.y - padding)}px) scale(1)`,
            },
        }).then((dataUrl) => {
            const a = document.createElement("a");
            a.setAttribute("download", "mindmap.png");
            a.setAttribute("href", dataUrl);
            a.click();
        });
    };

    useEffect(() => {
        // Re-fit view when nodes change (e.g. initial load)
        window.requestAnimationFrame(() => {
            fitView();
        });
    }, [nodes, fitView]);


    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            minZoom={0.1}
            maxZoom={4}
            nodesDraggable={false} // dagre layout relies on fixed positions usually, or drag needs re-calc
            nodesConnectable={false}
        >
            <Background color="#e2e8f0" gap={16} size={1} />
            <Controls showInteractive={false} className="!bg-white !border-slate-200 !shadow-lg !rounded-xl overflow-hidden" />

            <Panel position="top-right">
                <button
                    onClick={downloadImage}
                    className="bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2 px-4 border border-slate-200 rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                        />
                    </svg>
                    Download Map
                </button>
            </Panel>
        </ReactFlow>
    );
}

/* ==================== WRAPPER ==================== */

export default function MindMap({ root }: { root?: BraceNode }) {
    if (!root) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium text-sm">Generating visualization...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <ReactFlowProvider>
                <MindMapContent root={root} />
            </ReactFlowProvider>
        </div>
    );
}
