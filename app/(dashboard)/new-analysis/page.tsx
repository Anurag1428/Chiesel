"use client";

import { useState } from "react";
import { FileDropzone } from "@/components/file-dropzone";
import { FilePreview } from "@/components/file-preview";
import { AnalysisProgress } from "@/components/analysis-progress";
import { AnalysisResults } from "@/components/analysis-results";
import { ImageWithHotspots } from "@/components/image-with-hotspots";
import { ComponentTree } from "@/components/component-tree";
import { ComponentDetailsPanel } from "@/components/component-details-panel";
import { PromptEditor } from "@/components/prompt-editor";
import { ThreeDConfigurator } from "@/components/three-d-configurator";
import { ExportModal } from "@/components/export-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateImplementationPrompt } from "@/lib/prompt-generator";
import { saveAnalysis } from "@/lib/storage";
import { ComponentNode } from "@/types/component-tree";
import { ThreeDConfig, defaultThreeDConfig } from "@/types/three-config";
import { SavedAnalysis, ShareableData } from "@/types/saved-analysis";
import { AnalysisData } from "@/components/analysis-results";
import { Share2, Save } from "lucide-react";

type AnalysisState = "idle" | "analyzing" | "complete";

export default function NewAnalysisPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [projectName, setProjectName] = useState("");
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedNode, setSelectedNode] = useState<ComponentNode | null>(null);
  const [componentNodes, setComponentNodes] = useState<ComponentNode[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [threeDConfig, setThreeDConfig] = useState<ThreeDConfig>(defaultThreeDConfig);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [realAnalysisData, setRealAnalysisData] = useState<AnalysisData | null>(null);
  const [hotspots, setHotspots] = useState<Array<{id: string; x: number; y: number; label: string; description: string}>>([]);

  const progressSteps = [
    { label: "Uploading", status: "pending" as const },
    { label: "Analyzing Visuals", status: "pending" as const },
    { label: "Extracting Components", status: "pending" as const },
    { label: "Generating Prompt", status: "pending" as const },
  ];

  const getStepStatus = (index: number) => {
    if (currentStep > index) return "complete";
    if (currentStep === index) return "active";
    return "pending";
  };

  const handleFilesAccepted = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles].slice(0, 5));
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (files.length === 0 || !projectName) return;

    setAnalysisState("analyzing");
    setCurrentStep(0);
    setAnalysisError(null);

    try {
      // Step 1: Uploading
      setCurrentStep(1);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Convert image to base64
      const base64Image = await fileToBase64(files[0]);

      // Step 2: Vision Analysis (this will do everything now)
      setCurrentStep(2);
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          step: "vision",
          base64Image,
          projectName, // Pass project name for complete analysis
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Analysis failed");
      }

      const result = await response.json();

      // Step 3: Processing results
      setCurrentStep(3);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 4: Generating Prompt
      setCurrentStep(4);
      
      // Update state with AI results
      setRealAnalysisData(result.analysisData);
      setComponentNodes(result.componentTree);
      
      // Generate hotspots from component tree
      const generatedHotspots = result.componentTree.slice(0, 3).map((node: ComponentNode, index: number) => ({
        id: node.id,
        x: 20 + (index * 30),
        y: 30 + (index * 20),
        label: node.label,
        description: `${node.type} - ${node.detectedTech}`
      }));
      setHotspots(generatedHotspots);

      // Generate the implementation prompt
      const prompt = generateImplementationPrompt({
        projectName,
        analysisData: result.analysisData,
        componentTree: result.componentTree,
        threeDConfig: result.analysisData.has3D ? threeDConfig : undefined,
      });
      
      setGeneratedPrompt(prompt);
      setAnalysisState("complete");

    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysisError(
        error instanceof Error 
          ? error.message 
          : "Failed to analyze design. Please try again."
      );
      setAnalysisState("idle");
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleNodeSelect = (node: ComponentNode) => {
    setSelectedNode(node);
  };

  const handleNodesReorder = (nodes: ComponentNode[]) => {
    setComponentNodes(nodes);
  };

  const handleThreeDConfigChange = (config: ThreeDConfig) => {
    setThreeDConfig(config);
    
    // Regenerate prompt with new 3D config
    if (analysisState === "complete") {
      const prompt = generateImplementationPrompt({
        projectName,
        analysisData: realAnalysisData,
        componentTree: componentNodes,
        threeDConfig: realAnalysisData.has3D ? config : undefined,
      });
      setGeneratedPrompt(prompt);
    }
  };

  const handleSaveAnalysis = () => {
    if (!projectName || !generatedPrompt || !realAnalysisData) return;

    // Extract tech tags from analysis
    const techTags = Array.from(
      new Set([
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        realAnalysisData.has3D ? "Three.js" : null,
        ...componentNodes
          .flatMap((node) => [
            node.detectedTech,
            ...(node.children?.map((c) => c.detectedTech) || []),
          ])
          .filter(Boolean),
      ])
    ).filter((tag): tag is string => tag !== null);

    const analysis: SavedAnalysis = {
      id: `analysis-${Date.now()}`,
      projectName,
      createdAt: new Date(),
      thumbnail: files.length > 0 ? URL.createObjectURL(files[0]) : "",
      analysisData: realAnalysisData,
      componentTree: componentNodes,
      threeDConfig: realAnalysisData.has3D ? threeDConfig : undefined,
      prompt: generatedPrompt,
      techTags,
    };

    saveAnalysis(analysis);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getShareableData = (): ShareableData | null => {
    if (!realAnalysisData) return null;
    return {
      projectName,
      analysisData: realAnalysisData,
      componentTree: componentNodes,
      threeDConfig: realAnalysisData.has3D ? threeDConfig : undefined,
      timestamp: Date.now(),
    };
  };

  const canAnalyze = files.length > 0 && projectName.trim() !== "";

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {analysisState === "idle" && (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              New Analysis
            </h2>
            <p className="text-muted-foreground">
              Upload screenshots or videos to analyze and generate implementation
              prompts.
            </p>
            <div className="mt-3 bg-green-600/10 border border-green-600/20 rounded-lg p-3">
              <p className="text-sm text-foreground">
                <strong>🤖 AI-Powered Analysis:</strong> Ready to analyze! Using NVIDIA Llama Vision + Moonshot Kimi K2.5 for comprehensive design analysis.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="project-name" className="text-base mb-2 block">
                Project Name
              </Label>
              <Input
                id="project-name"
                placeholder="Enter project name..."
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div>
              <Label className="text-base mb-2 block">Upload Files</Label>
              <FileDropzone
                onFilesAccepted={handleFilesAccepted}
                maxFiles={5}
              />
            </div>

            {files.length > 0 && (
              <div>
                <Label className="text-base mb-3 block">
                  Selected Files ({files.length}/5)
                </Label>
                <div className="flex flex-wrap gap-4">
                  {files.map((file, index) => (
                    <FilePreview
                      key={index}
                      file={file}
                      onRemove={() => handleRemoveFile(index)}
                    />
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              size="lg"
              className="w-full max-w-md"
            >
              Analyze Design
            </Button>

            {analysisError && (
              <div className="bg-red-600/10 border border-red-600/20 rounded-lg p-4 max-w-md">
                <p className="text-sm text-red-400">
                  <strong>Error:</strong> {analysisError}
                </p>
                <p className="text-xs text-red-400/80 mt-2">
                  Please try again or check the browser console for details.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {analysisState === "analyzing" && (
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Analyzing {projectName}
            </h2>
            <p className="text-muted-foreground">
              Please wait while we process your design...
            </p>
          </div>

          <div className="max-w-md">
            <AnalysisProgress
              steps={progressSteps.map((step, index) => ({
                ...step,
                status: getStepStatus(index),
              }))}
            />
          </div>
        </div>
      )}

      {analysisState === "complete" && realAnalysisData && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Analysis Results
              </h2>
              <p className="text-muted-foreground">
                {projectName} - {files.length} file(s) analyzed
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSaveAnalysis}
                disabled={saved}
              >
                {saved ? (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
              <Button onClick={() => setExportModalOpen(true)}>
                <Share2 className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAnalysisState("idle");
                  setCurrentStep(0);
                  setSelectedNode(null);
                  setGeneratedPrompt("");
                  setRealAnalysisData(null);
                  setComponentNodes([]);
                  setHotspots([]);
                }}
              >
                New Analysis
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Design Preview</h3>
              <ImageWithHotspots
                imageUrl={URL.createObjectURL(files[0])}
                hotspots={hotspots}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
              <AnalysisResults data={realAnalysisData} />
              
              {/* Manual 3D Override */}
              {!realAnalysisData.has3D && (
                <div className="mt-4 p-4 bg-muted/50 border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    AI didn't detect 3D elements. Does this design have 3D/WebGL?
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setRealAnalysisData({
                        ...realAnalysisData,
                        has3D: true,
                      });
                    }}
                  >
                    Yes, Enable 3D Configurator
                  </Button>
                </div>
              )}
            </div>
          </div>

          {realAnalysisData.has3D && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">
                3D Scene Configuration
              </h3>
              <ThreeDConfigurator
                onConfigChange={handleThreeDConfigChange}
                initialConfig={threeDConfig}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Component Tree</h3>
              <div className="bg-card border border-border rounded-lg p-4 max-h-[600px] overflow-auto">
                {componentNodes.length > 0 ? (
                  <ComponentTree
                    nodes={componentNodes}
                    onNodeSelect={handleNodeSelect}
                    onNodesReorder={handleNodesReorder}
                    selectedNodeId={selectedNode?.id}
                  />
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No components detected
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Component Details</h3>
              <div className="bg-card border border-border rounded-lg p-4 min-h-[400px]">
                <ComponentDetailsPanel node={selectedNode} />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <PromptEditor
              initialPrompt={generatedPrompt}
              projectName={projectName}
            />
          </div>
        </div>
      )}

      {/* Export Modal */}
      {realAnalysisData && (
        <ExportModal
          open={exportModalOpen}
          onOpenChange={setExportModalOpen}
          prompt={generatedPrompt}
          projectName={projectName}
          shareableData={getShareableData()!}
          images={files}
        />
      )}
    </div>
  );
}
