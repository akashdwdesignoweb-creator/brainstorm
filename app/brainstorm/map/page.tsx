"use client";

import { useEffect, useState } from "react";
import MindMap from "@/app/components/MindMap";
import Link from "next/link";

export default function MapPage() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const idea = sessionStorage.getItem("idea");

        if (!idea) return;

        fetch("/api/brainstorm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idea })
        })
            .then((res) => res.json())
            .then(setData);
    }, []);

    if (!data) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="spinner mx-auto mb-6"></div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Architecting Nodes</h2>
                    <p className="text-slate-500 text-sm">Synthesizing your requirements...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="h-screen flex flex-col bg-white overflow-hidden">
            {/* Minimal Header - Borderless */}
            <header className="bg-white/80 backdrop-blur-md px-8 py-4 shrink-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div>
                        <h1 className="text-lg font-black text-slate-900 leading-tight">
                            Project Master Map
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Neural Architecture
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    {/* Complexity - Text Only */}
                    <div className="hidden md:flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Complexity</span>
                        <span className={`text-sm font-black ${getComplexityColorText(data.complexity)}`}>
                            {data.complexity}
                        </span>
                    </div>

                    <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

                    {/* Minimal Link */}
                    <Link href="/brainstorm/idea">
                        <button className="text-xs font-bold text-slate-900 hover:text-brand-500 transition-colors uppercase tracking-wider">
                            New Map
                        </button>
                    </Link>
                </div>
            </header>

            {/* Content Range - Full Canvas */}
            <div className="flex-1 relative bg-slate-50/50">
                <MindMap root={data.root} />

                <div className="absolute bottom-6 left-6 text-[10px] font-bold text-slate-300 uppercase tracking-widest pointer-events-none">
                    Rendered by DAGRE Layout Engine
                </div>
            </div>
        </main>
    );
}

function getComplexityColorText(complexity: string) {
    switch (complexity?.toLowerCase()) {
        case "high": return "text-brand-600";
        case "medium": return "text-amber-600";
        case "low": return "text-emerald-600";
        default: return "text-slate-600";
    }
}
