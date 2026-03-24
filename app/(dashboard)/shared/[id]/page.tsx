"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ShareableData } from "@/types/saved-analysis";
import { decodeShareableLink } from "@/lib/export-utils";
import { AnalysisResults } from "@/components/analysis-results";
import { ComponentTree } from "@/components/component-tree";
import { ComponentDetailsPanel } from "@/components/component-details-panel";
import { ThreeDConfigurator } from "@/components/three-d-configurator";
import { ComponentNode } from "@/types/component-tree";
import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";

export default function SharedAnalysisPage() {
  const params = useParams();
  const [data, setData] = useState<ShareableData | null>(null);
  const [selectedNode, setSelectedNode] = useState<ComponentNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      const decoded = decodeShareableLink(params.id as string);
      if (decoded) {
        setData(decoded);
      } else {
        setError("Invalid or corrupted share link");
      }
    }
  }, [params.id]);

  if (error) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-destructive/10 border border-destructive rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">
            Error Loading Analysis
          </h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {data.projectName}
            </h2>
            <p className="text-muted-foreground">
              Shared Analysis •{" "}
              {new Date(data.timestamp).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
          <AnalysisResults data={data.analysisData} />
        </div>

        {data.threeDConfig && (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              3D Scene Configuration
            </h3>
            <ThreeDConfigurator
              onConfigChange={() => {}}
              initialConfig={data.threeDConfig}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold mb-4">Component Tree</h3>
            <div className="bg-card border border-border rounded-lg p-4 max-h-[600px] overflow-auto">
              <ComponentTree
                nodes={data.componentTree}
                onNodeSelect={setSelectedNode}
                selectedNodeId={selectedNode?.id}
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Component Details</h3>
            <div className="bg-card border border-border rounded-lg p-4 min-h-[400px]">
              <ComponentDetailsPanel node={selectedNode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
