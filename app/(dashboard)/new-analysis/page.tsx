"use client";

import { useState } from "react";
import { FileDropzone } from "@/components/file-dropzone";
import { FilePreview } from "@/components/file-preview";
import { AnalysisProgress } from "@/components/analysis-progress";
import { AnalysisResults } from "@/components/analysis-results";
import { ImageWithHotspots } from "@/components/image-with-hotspots";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  simulateAnalysis,
  mockAnalysisData,
  mockHotspots,
} from "@/lib/mock-analysis";

type AnalysisState = "idle" | "analyzing" | "complete";

export default function NewAnalysisPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [projectName, setProjectName] = useState("");
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
  const [currentStep, setCurrentStep] = useState(0);

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

    await simulateAnalysis((step) => {
      setCurrentStep(step);
    });

    setAnalysisState("complete");
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

      {analysisState === "complete" && (
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
            <Button
              variant="outline"
              onClick={() => {
                setAnalysisState("idle");
                setCurrentStep(0);
              }}
            >
              New Analysis
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Design Preview</h3>
              <ImageWithHotspots
                imageUrl={URL.createObjectURL(files[0])}
                hotspots={mockHotspots}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
              <AnalysisResults data={mockAnalysisData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
