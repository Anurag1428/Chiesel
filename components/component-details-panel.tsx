"use client";

import { ComponentNode } from "@/types/component-tree";
import { TechBadge } from "./tech-badge";
import { ConfidenceIndicator } from "./confidence-indicator";
import { motion } from "framer-motion";

interface ComponentDetailsPanelProps {
  node: ComponentNode | null;
}

export function ComponentDetailsPanel({ node }: ComponentDetailsPanelProps) {
  if (!node) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a component to view details
      </div>
    );
  }

  return (
    <motion.div
      key={node.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold mb-2">{node.label}</h3>
        <p className="text-sm text-muted-foreground capitalize">
          Type: {node.type}
        </p>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Confidence Score</h4>
        <ConfidenceIndicator confidence={node.confidence} showLabel />
        <p className="text-xs text-muted-foreground mt-2">
          {node.confidence > 0.8
            ? "High confidence detection"
            : node.confidence > 0.5
            ? "Medium confidence - may need review"
            : "Low confidence - manual verification recommended"}
        </p>
      </div>

      {node.detectedTech && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Detected Technology</h4>
          <TechBadge tech={node.detectedTech} />
        </div>
      )}

      {node.props && Object.keys(node.props).length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Properties</h4>
          <div className="bg-muted rounded-lg p-4 space-y-2">
            {Object.entries(node.props).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{key}:</span>
                <span className="font-mono">
                  {typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {node.children && node.children.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Children</h4>
          <p className="text-sm text-muted-foreground">
            {node.children.length} child component
            {node.children.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </motion.div>
  );
}
