"use client";

import { PromptEditor } from "@/components/prompt-editor";
import { generateImplementationPrompt } from "@/lib/prompt-generator";
import { mockAnalysisData } from "@/lib/mock-analysis";
import { mockComponentTree } from "@/lib/mock-component-tree";

export default function PromptDemoPage() {
  const demoPrompt = generateImplementationPrompt({
    projectName: "Demo Project",
    analysisData: mockAnalysisData,
    componentTree: mockComponentTree,
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Prompt Generator Demo
        </h2>
        <p className="text-muted-foreground">
          View and edit the generated implementation prompt with syntax
          highlighting
        </p>
      </div>

      <PromptEditor initialPrompt={demoPrompt} projectName="Demo Project" />
    </div>
  );
}
