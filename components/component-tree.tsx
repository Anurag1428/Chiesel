"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ComponentNode, ComponentTreeProps } from "@/types/component-tree";
import { ComponentTreeNode } from "./component-tree-node";

export function ComponentTree({
  nodes: initialNodes,
  onNodeSelect,
  onNodesReorder,
  selectedNodeId,
}: ComponentTreeProps) {
  const [nodes, setNodes] = useState<ComponentNode[]>(initialNodes);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setNodes((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newNodes = arrayMove(items, oldIndex, newIndex);
        onNodesReorder?.(newNodes);
        return newNodes;
      });
    }
  };

  const handleNodeSelect = (node: ComponentNode) => {
    onNodeSelect?.(node);
  };

  const getAllNodeIds = (nodes: ComponentNode[]): string[] => {
    return nodes.flatMap((node) => [
      node.id,
      ...(node.children ? getAllNodeIds(node.children) : []),
    ]);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={getAllNodeIds(nodes)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-1">
          {nodes.map((node) => (
            <ComponentTreeNode
              key={node.id}
              node={node}
              level={0}
              isSelected={selectedNodeId === node.id}
              onSelect={handleNodeSelect}
              onReorder={onNodesReorder}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
