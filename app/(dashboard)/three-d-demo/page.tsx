"use client";

import { useState } from "react";
import { ThreeDConfigurator } from "@/components/three-d-configurator";
import { ThreeDConfig, defaultThreeDConfig } from "@/types/three-config";
import { generateImplementationPrompt } from "@/lib/prompt-generator";
import { mockAnalysisData } from "@/lib/mock-analysis";
import { mockComponentTree } from "@/lib/mock-component-tree";

export default function ThreeDDemoPage() {
  const [config, setConfig] = useState<ThreeDConfig>(defaultThreeDConfig);
  const [prompt, setPrompt] = useState("");

  const handleConfigChange = (newConfig: ThreeDConfig) => {
    setConfig(newConfig);
    
    // Generate prompt with new config
    const generatedPrompt = generateImplementationPrompt({
      projectName: "3D Demo Project",
      analysisData: { ...mockAnalysisData, has3D: true },
      componentTree: mockComponentTree,
      threeDConfig: newConfig,
    });
    setPrompt(generatedPrompt);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          3D Configurator Demo
        </h2>
        <p className="text-muted-foreground">
          Adjust Three.js parameters and see the generated code in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <ThreeDConfigurator
            onConfigChange={handleConfigChange}
            initialConfig={config}
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Generated Configuration</h3>
          <div className="bg-card border border-border rounded-lg p-6 max-h-[800px] overflow-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {prompt && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Three.js Section in Prompt
          </h3>
          <div className="bg-card border border-border rounded-lg p-6 max-h-[600px] overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
              {prompt.split("## THREE.JS CONFIGURATION")[1]?.split("---")[0] ||
                "No 3D configuration found"}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
