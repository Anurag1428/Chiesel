export interface ComponentNode {
  id: string;
  type: "section" | "component" | "element";
  label: string;
  detectedTech?: string;
  confidence: number;
  props?: Record<string, any>;
  children?: ComponentNode[];
}

export interface ComponentTreeProps {
  nodes: ComponentNode[];
  onNodeSelect?: (node: ComponentNode) => void;
  onNodesReorder?: (nodes: ComponentNode[]) => void;
  selectedNodeId?: string;
}
