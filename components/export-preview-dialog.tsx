"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface ExportPreviewDialogProps {
  format: "markdown" | "cursor" | "claude";
  content: string;
}

export function ExportPreviewDialog({
  format,
  content,
}: ExportPreviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatLabels = {
    markdown: "Markdown",
    cursor: "Cursor Rules",
    claude: "Claude Instructions",
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2"
      >
        <Eye className="w-4 h-4" />
        Preview {formatLabels[format]}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {formatLabels[format]} Preview
              </h3>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
            <div className="p-6">
              <pre className="text-sm whitespace-pre-wrap font-mono">
                {content}
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
