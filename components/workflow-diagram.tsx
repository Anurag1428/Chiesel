"use client";

import { useState, useCallback } from "react";
import Tree from "react-d3-tree";
import { Button } from "@/components/ui/button";
import { Download, Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import { TreeNode } from "@/lib/diagram-generator";

interface WorkflowDiagramProps {
  treeData: TreeNode;
  title?: string;
}

const phaseColors: Record<string, string> = {
  root: "#3B82F6",
  setup: "#8B5CF6",
  design: "#EC4899",
  component: "#10B981",
  "3d": "#F59E0B",
  animation: "#06B6D4",
  integration: "#6366F1",
  testing: "#14B8A6",
  optimization: "#F97316",
  deployment: "#22C55E",
  frontend: "#3B82F6",
  styling: "#EC4899",
  data: "#8B5CF6",
};

export function WorkflowDiagram({ treeData, title = "Implementation Workflow" }: WorkflowDiagramProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.8);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.3));

  const renderCustomNode = useCallback(
    ({ nodeDatum }: any) => {
      const phase = nodeDatum.attributes?.phase || "root";
      const color = phaseColors[phase] || "#64748B";
      const icon = nodeDatum.attributes?.icon || "";
      const tech = nodeDatum.attributes?.tech || "";

      return (
        <g>
          {/* Node circle */}
          <circle
            r={30}
            fill={color}
            stroke="#1E293B"
            strokeWidth={3}
            className="transition-all duration-200 hover:r-35"
          />
          
          {/* Icon */}
          {icon && (
            <text
              fill="white"
              fontSize="20"
              textAnchor="middle"
              dy={8}
            >
              {icon}
            </text>
          )}
          
          {/* Node label */}
          <text
            fill="white"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
            dy={55}
          >
            {nodeDatum.name}
          </text>
          
          {/* Tech label */}
          {tech && (
            <text
              fill="#94A3B8"
              fontSize="11"
              textAnchor="middle"
              dy={72}
            >
              {tech.length > 30 ? tech.substring(0, 30) + "..." : tech}
            </text>
          )}
        </g>
      );
    },
    []
  );

  const handleDownload = () => {
    const svg = document.querySelector(".rd3t-svg");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/\s+/g, "-").toLowerCase()}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download SVG
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div
        className={`bg-slate-950 ${
          isFullscreen ? "fixed inset-0 z-50 pt-16" : "h-[600px]"
        }`}
      >
        <Tree
          data={treeData}
          orientation="vertical"
          pathFunc="step"
          translate={translate}
          zoom={zoom}
          nodeSize={{ x: 200, y: 150 }}
          separation={{ siblings: 1.5, nonSiblings: 2 }}
          renderCustomNodeElement={renderCustomNode}
          onUpdate={({ translate, zoom }) => {
            setTranslate(translate);
            setZoom(zoom);
          }}
          enableLegacyTransitions
          transitionDuration={500}
          depthFactor={200}
          collapsible={true}
          initialDepth={2}
          pathClassFunc={() => "stroke-slate-600 stroke-2"}
          styles={{
            links: {
              stroke: "#475569",
              strokeWidth: 2,
            },
            nodes: {
              node: {
                circle: {
                  stroke: "#1E293B",
                  strokeWidth: 3,
                },
              },
              leafNode: {
                circle: {
                  stroke: "#1E293B",
                  strokeWidth: 3,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
