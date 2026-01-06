export interface BraceNode {
  id: string;
  label: string;
  children?: BraceNode[];
  collapsed?: boolean;
}

export interface BraceMap {
  root: BraceNode;
  complexity: "Low" | "Medium" | "High";
}
