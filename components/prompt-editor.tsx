"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Copy, Download, Check } from "lucide-react";
import {
  generateCursorRules,
  generateClaudeInstructions,
} from "@/lib/prompt-generator";

interface PromptEditorProps {
  initialPrompt: string;
  projectName: string;
}

export function PromptEditor({ initialPrompt, projectName }: PromptEditorProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = (format: "markdown" | "cursor" | "claude") => {
    let content = prompt;
    let filename = `${projectName.toLowerCase().replace(/\s+/g, "-")}`;
    let extension = ".md";

    switch (format) {
      case "cursor":
        content = generateCursorRules(prompt);
        filename = ".cursorrules";
        extension = "";
        break;
      case "claude":
        content = generateClaudeInstructions(prompt);
        filename += "-claude-instructions";
        extension = ".md";
        break;
      case "markdown":
        filename += "-implementation-prompt";
        extension = ".md";
        break;
    }

    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename + extension;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Implementation Prompt</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("markdown")}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Markdown
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("cursor")}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Cursor Rules
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("claude")}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Claude
          </Button>
        </div>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <Editor
          height="600px"
          defaultLanguage="markdown"
          value={prompt}
          onChange={(value) => setPrompt(value || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            wordWrap: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
          }}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        💡 Edit the prompt above to customize the implementation instructions.
        Changes are not saved automatically.
      </p>
    </div>
  );
}
