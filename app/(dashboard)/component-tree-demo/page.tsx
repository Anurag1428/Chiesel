"use client";

import { useState } from "react";
import { ComponentTree } from "@/components/component-tree";
import { ComponentDetailsPanel } from "@/components/component-details-panel";
import { mockComponentTree } from "@/lib/mock-component-tree";
import { ComponentNode } from "@/types/component-tree";

export default function ComponentTreeDemoPage() {
  const [selectedNode, setSelectedNode] = useState<ComponentNode | null>(null);
  const [nodes, setNodes] = useState(mockComponentTree);

  const handleNodeSelect = (node: ComponentNode) => {
    setSelectedNode(node);
  };

  const handleNodesReorder = (reorderedNodes: ComponentNode[]) => {
    setNodes(reorderedNodes);
    console.log("Nodes reordered:", reorderedNodes);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Component Tree Demo
        </h2>
        <p className="text-muted-foreground">
          Interactive component hierarchy with drag & drop reordering
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Component Hierarchy</h3>
          <div className="bg-card border border-border rounded-lg p-4 max-h-[800px] overflow-auto">
            <ComponentTree
              nodes={nodes}
              onNodeSelect={handleNodeSelect}
              onNodesReorder={handleNodesReorder}
              selectedNodeId={selectedNode?.id}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            💡 Tip: Click nodes to view details, drag the grip icon to reorder
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Component Details</h3>
          <div className="bg-card border border-border rounded-lg p-4 sticky top-8">
            <ComponentDetailsPanel node={selectedNode} />
          </div>
        </div>
      </div>
    </div>
  );
}
