"use client";

import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronRight, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComponentNode } from "@/types/component-tree";
import { TechBadge } from "./tech-badge";
import { ConfidenceIndicator } from "./confidence-indicator";

interface ComponentTreeNodeProps {
  node: ComponentNode;
  level: number;
  isSelected: boolean;
  onSelect: (node: ComponentNode) => void;
  onReorder?: (nodes: ComponentNode[]) => void;
}

export function ComponentTreeNode({
  node,
  level,
  isSelected,
  onSelect,
  onReorder,
}: ComponentTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getTypeIcon = () => {
    switch (node.type) {
      case "section":
        return "📦";
      case "component":
        return "🧩";
      case "element":
        return "🔷";
      default:
        return "📄";
    }
  };

  const getBorderColor = () => {
    if (node.confidence > 0.8) return "border-l-green-500";
    if (node.confidence > 0.5) return "border-l-yellow-500";
    return "border-l-red-500";
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={cn(
            "group flex items-center gap-2 py-2 px-3 rounded-lg border-l-4 transition-colors cursor-pointer",
            getBorderColor(),
            isSelected
              ? "bg-primary/10 border-primary"
              : "hover:bg-accent border-transparent"
          )}
          style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
          onClick={() => onSelect(node)}
        >
          <button
            className="cursor-grab active:cursor-grabbing p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>

          {hasChildren && (
            <Collapsible.Trigger
              className="p-0.5 hover:bg-muted rounded transition-transform"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
            >
              <ChevronRight
                className={cn(
                  "w-4 h-4 transition-transform",
                  isOpen && "rotate-90"
                )}
              />
            </Collapsible.Trigger>
          )}

          {!hasChildren && <div className="w-5" />}

          <span className="text-base mr-2">{getTypeIcon()}</span>

          <span className="font-medium text-sm flex-1">{node.label}</span>

          {node.detectedTech && (
            <TechBadge tech={node.detectedTech} className="mr-2" />
          )}

          <ConfidenceIndicator confidence={node.confidence} showLabel />
        </div>

        {hasChildren && (
          <Collapsible.Content>
            <div className="space-y-1">
              {node.children!.map((child) => (
                <ComponentTreeNode
                  key={child.id}
                  node={child}
                  level={level + 1}
                  isSelected={isSelected}
                  onSelect={onSelect}
                  onReorder={onReorder}
                />
              ))}
            </div>
          </Collapsible.Content>
        )}
      </Collapsible.Root>
    </div>
  );
}
