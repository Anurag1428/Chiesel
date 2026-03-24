"use client";

import { useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { Card } from "@/components/ui/card";

interface MindMapBranch {
  label: string;
  color: string;
  nodes: string[];
}

interface MindMapData {
  center: string;
  branches: MindMapBranch[];
}

interface MindMapDiagramProps {
  data: MindMapData;
  title?: string;
}

export function MindMapDiagram({ data, title = "Implementation Mind Map" }: MindMapDiagramProps) {
  // Generate nodes and edges from mind map data
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Center node
    nodes.push({
      id: "center",
      type: "default",
      position: { x: 400, y: 300 },
      data: { label: data.center },
      style: {
        background: "#1E293B",
        color: "#fff",
        border: "3px solid #3B82F6",
        borderRadius: "12px",
        padding: "20px",
        fontSize: "16px",
        fontWeight: "bold",
        width: 250,
      },
    });

    // Calculate positions for branches in a circle
    const angleStep = (2 * Math.PI) / data.branches.length;
    const radius = 350;

    data.branches.forEach((branch, branchIndex) => {
      const angle = angleStep * branchIndex - Math.PI / 2;
      const branchX = 400 + radius * Math.cos(angle);
      const branchY = 300 + radius * Math.sin(angle);

      // Branch node
      const branchId = `branch-${branchIndex}`;
      nodes.push({
        id: branchId,
        type: "default",
        position: { x: branchX, y: branchY },
        data: { label: branch.label },
        style: {
          background: branch.color,
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: "600",
          minWidth: 150,
        },
      });

      // Edge from center to branch
      edges.push({
        id: `edge-center-${branchId}`,
        source: "center",
        target: branchId,
        type: "smoothstep",
        animated: true,
        style: { stroke: branch.color, strokeWidth: 3 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: branch.color,
        },
      });

      // Detail nodes for each branch
      branch.nodes.forEach((nodeText, nodeIndex) => {
        const detailAngle = angle + (nodeIndex - (branch.nodes.length - 1) / 2) * 0.3;
        const detailRadius = radius + 200;
        const detailX = 400 + detailRadius * Math.cos(detailAngle);
        const detailY = 300 + detailRadius * Math.sin(detailAngle);

        const detailId = `detail-${branchIndex}-${nodeIndex}`;
        nodes.push({
          id: detailId,
          type: "default",
          position: { x: detailX, y: detailY },
          data: { label: nodeText },
          style: {
            background: "#0F172A",
            color: "#E2E8F0",
            border: `2px solid ${branch.color}`,
            borderRadius: "6px",
            padding: "8px 12px",
            fontSize: "12px",
            maxWidth: 200,
          },
        });

        // Edge from branch to detail
        edges.push({
          id: `edge-${branchId}-${detailId}`,
          source: branchId,
          target: detailId,
          type: "smoothstep",
          style: { stroke: branch.color, strokeWidth: 2, opacity: 0.6 },
        });
      });
    });

    return { nodes, edges };
  }, [data]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <Card className="p-6 bg-card border border-border">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="h-[700px] bg-slate-950 rounded-lg border border-border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-left"
        >
          <Background color="#334155" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              if (node.id === "center") return "#3B82F6";
              return "#1E293B";
            }}
            maskColor="rgba(0, 0, 0, 0.6)"
          />
        </ReactFlow>
      </div>
    </Card>
  );
}
