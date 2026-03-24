"use client";

import { useState } from "react";
import { FileDropzone } from "@/components/file-dropzone";
import { VideoFrameExtractor } from "@/components/video-frame-extractor";
import { VideoFilmstrip } from "@/components/video-filmstrip";
import { MotionDetectionView } from "@/components/motion-detection-view";
import { AnalysisResults } from "@/components/analysis-results";
import { ComponentTree } from "@/components/component-tree";
import { ComponentDetailsPanel } from "@/components/component-details-panel";
import { PromptEditor } from "@/components/prompt-editor";
import { WorkflowStepsDiagram } from "@/components/workflow-steps-diagram";
import { ThreeDConfigurator } from "@/components/three-d-configurator";
import { Button } from "@/components/ui/button";
import { VideoFrame, MotionAnalysis } from "@/types/video-analysis";
import { ComponentNode } from "@/types/component-tree";
import { ThreeDConfig, defaultThreeDConfig } from "@/types/three-config";
import { AnalysisData } from "@/components/analysis-results";
import { detectMotion } from "@/lib/video-processor";
import { generateImplementationPrompt } from "@/lib/prompt-generator";
import { ArrowLeft, Loader2 } from "lucide-react";

interface WorkflowStep {
  phase: string;
  icon: string;
  steps: string[];
}

export default function VideoAnalysisPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [frames, setFrames] = useState<VideoFrame[]>([]);
  const [selectedFrameId, setSelectedFrameId] = useState<string>("");
  const [motionAnalysis, setMotionAnalysis] = useState<MotionAnalysis>({
    duration: 0.8,
    easing: "spring",
    intensity: "medium",
    detectedChanges: [],
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [componentTree, setComponentTree] = useState<ComponentNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<ComponentNode | null>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>("");
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);
  const [threeDConfig, setThreeDConfig] = useState<ThreeDConfig>(defaultThreeDConfig);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [scrollAnimations, setScrollAnimations] = useState<any>(null);

  const handleFilesAccepted = (files: File[]) => {
    const video = files.find((f) => f.type.startsWith("video/"));
    if (video) {
      setVideoFile(video);
      setFrames([]);
      setSelectedFrameId("");
      setAnalysisComplete(false);
    }
  };

  const handleFramesExtracted = (extractedFrames: VideoFrame[]) => {
    setFrames(extractedFrames);
    if (extractedFrames.length > 0) {
      setSelectedFrameId(extractedFrames[0].id);

      // Detect motion
      const motion = detectMotion(extractedFrames);
      setMotionAnalysis({
        duration: 0.8,
        easing: "spring",
        intensity: motion.intensity,
        detectedChanges: motion.changes,
      });
    }
  };

  const handleReset = () => {
    setVideoFile(null);
    setFrames([]);
    setSelectedFrameId("");
    setAnalysisData(null);
    setComponentTree([]);
    setEnhancedPrompt("");
    setWorkflowSteps([]);
    setAnalysisComplete(false);
  };

  const handleAIAnalysis = async () => {
    if (frames.length === 0) return;
    
    setIsAnalyzing(true);
    
    try {
      // Convert multiple frames to base64 (analyze 3-5 key frames to detect animations)
      const framesToAnalyze = Math.min(5, frames.length);
      const framePromises = [];
      
      for (let i = 0; i < framesToAnalyze; i++) {
        const frameIndex = Math.floor((i / (framesToAnalyze - 1)) * (frames.length - 1));
        const frame = frames[frameIndex];
        
        const promise = fetch(frame.imageUrl)
          .then(res => res.blob())
          .then(blob => new Promise<{ base64: string; timestamp: number }>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64String = (reader.result as string).split(',')[1];
              resolve({ base64: base64String, timestamp: frame.timestamp });
            };
            reader.readAsDataURL(blob);
          }));
        
        framePromises.push(promise);
      }
      
      const analyzedFrames = await Promise.all(framePromises);

      // Call AI API with multiple frames for animation detection
      const aiResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step: 'vision',
          base64Image: analyzedFrames[0].base64, // Primary frame
          additionalFrames: analyzedFrames.slice(1).map(f => f.base64), // Additional frames for comparison
          frameTimestamps: analyzedFrames.map(f => f.timestamp),
          projectName: videoFile?.name.replace(/\.[^/.]+$/, "") || 'Video Analysis',
          isVideo: true, // Flag to indicate this is from video
        }),
      });

      if (!aiResponse.ok) {
        throw new Error('AI analysis failed');
      }

      const result = await aiResponse.json();
      
      // Set all analysis data
      setAnalysisData(result.analysisData);
      setComponentTree(result.componentTree || []);
      setEnhancedPrompt(result.enhancedPrompt || '');
      
      if (result.workflowSteps && result.workflowSteps.length > 0) {
        setWorkflowSteps(result.workflowSteps);
      }
      
      if (result.scrollAnimations) {
        setScrollAnimations(result.scrollAnimations);
      }
      
      // Generate implementation prompt
      const prompt = generateImplementationPrompt({
        projectName: videoFile?.name.replace(/\.[^/.]+$/, "") || 'Video Analysis',
        analysisData: result.analysisData,
        componentTree: result.componentTree || [],
        threeDConfig: result.analysisData.has3D ? threeDConfig : undefined,
      });
      
      if (!result.enhancedPrompt) {
        setEnhancedPrompt(prompt);
      }
      
      setAnalysisComplete(true);
    } catch (error) {
      console.error('AI analysis error:', error);
      alert('Failed to analyze with AI. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNodeSelect = (node: ComponentNode) => {
    setSelectedNode(node);
  };

  const handleNodesReorder = (nodes: ComponentNode[]) => {
    setComponentTree(nodes);
  };

  const handleThreeDConfigChange = (config: ThreeDConfig) => {
    setThreeDConfig(config);
    
    // Regenerate prompt with new 3D config
    if (analysisComplete && analysisData) {
      const prompt = generateImplementationPrompt({
        projectName: videoFile?.name.replace(/\.[^/.]+$/, "") || 'Video Analysis',
        analysisData: analysisData,
        componentTree: componentTree,
        threeDConfig: analysisData.has3D ? config : undefined,
      });
      setEnhancedPrompt(prompt);
    }
  };

  const selectedFrame = frames.find((f) => f.id === selectedFrameId);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Video Analysis
        </h2>
        <p className="text-muted-foreground">
          Extract frames and get complete AI-powered implementation analysis
        </p>
      </div>

      {!videoFile && (
        <div className="space-y-4">
          <FileDropzone onFilesAccepted={handleFilesAccepted} maxFiles={1} />
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-sm font-medium mb-2">📹 Video Analysis Features:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Extract key frames from video automatically</li>
              <li>• Complete AI analysis: components, 3D, colors, typography</li>
              <li>• Detect motion and animations</li>
              <li>• Generate detailed implementation prompts</li>
              <li>• Get workflow diagrams and component trees</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-3">
              Supported formats: MP4, WebM • Recommended: Under 50MB
            </p>
          </div>
        </div>
      )}

      {videoFile && frames.length === 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              Processing: {videoFile.name}
            </h3>
            <Button variant="outline" onClick={handleReset}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Choose Different Video
            </Button>
          </div>
          <VideoFrameExtractor
            videoFile={videoFile}
            onFramesExtracted={handleFramesExtracted}
          />
        </div>
      )}

      {frames.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              {analysisComplete ? 'Complete Analysis' : 'Video Frames'}: {videoFile?.name}
            </h3>
            <Button variant="outline" onClick={handleReset}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Video
            </Button>
          </div>

          {!analysisComplete && (
            <>
              <VideoFilmstrip
                frames={frames}
                selectedFrameId={selectedFrameId}
                onFrameSelect={setSelectedFrameId}
              />

              {selectedFrame && (
                <MotionDetectionView
                  frames={frames}
                  selectedFrame={selectedFrame}
                  motionAnalysis={motionAnalysis}
                  onAnalysisUpdate={setMotionAnalysis}
                />
              )}

              {/* AI Analysis Button */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold mb-1">🤖 AI-Powered Complete Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Analyze video frames with Kimi K2.5 to get complete implementation details
                    </p>
                  </div>
                  <Button
                    onClick={handleAIAnalysis}
                    disabled={isAnalyzing}
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze with AI'
                    )}
                  </Button>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  AI will analyze the first frame to detect components, 3D elements, colors, typography, and generate a detailed implementation prompt - just like image analysis!
                </p>
              </div>
            </>
          )}

          {/* Full Analysis Results */}
          {analysisComplete && analysisData && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Key Frame</h3>
                  <img 
                    src={frames[0].imageUrl} 
                    alt="Video frame"
                    className="w-full rounded-lg border border-border"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
                  <AnalysisResults data={analysisData} />
                  
                  {/* Manual 3D Override */}
                  {!analysisData.has3D && (
                    <div className="mt-4 p-4 bg-muted/50 border border-border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">
                        AI didn't detect 3D elements. Does this video have 3D/WebGL?
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setAnalysisData({
                            ...analysisData,
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

              {analysisData.has3D && (
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
                    {componentTree.length > 0 ? (
                      <ComponentTree
                        nodes={componentTree}
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
                  initialPrompt={enhancedPrompt}
                  projectName={videoFile?.name.replace(/\.[^/.]+$/, "") || 'Video Analysis'}
                />
              </div>

              {/* Workflow Diagram */}
              {workflowSteps.length > 0 && (
                <div className="mt-8">
                  <WorkflowStepsDiagram steps={workflowSteps} />
                </div>
              )}

              {/* Motion Analysis Summary */}
              <div className="mt-8 bg-card border border-border rounded-lg p-6">
                <h4 className="font-semibold mb-4">🎬 Motion & Animation Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Detected Changes:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {motionAnalysis.detectedChanges.map((change, i) => (
                        <li key={i}>• {change}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Animation Properties:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Duration: {motionAnalysis.duration}s</li>
                      <li>• Easing: {motionAnalysis.easing}</li>
                      <li>• Intensity: {motionAnalysis.intensity}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Scroll Animation Analysis */}
              {scrollAnimations && (
                <div className="mt-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-6">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">🎯</span>
                    Scroll Animation Architecture
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Advanced scroll-driven interactions detected
                  </p>

                  <div className="space-y-6">
                    {/* Architecture */}
                    {scrollAnimations.architecture && (
                      <div>
                        <h5 className="text-sm font-semibold mb-2 text-purple-300">Architecture Pattern:</h5>
                        <p className="text-sm text-muted-foreground bg-black/30 p-3 rounded border border-purple-500/20">
                          {scrollAnimations.architecture}
                        </p>
                      </div>
                    )}

                    {/* Scroll Triggers */}
                    {scrollAnimations.triggers && scrollAnimations.triggers.length > 0 && (
                      <div>
                        <h5 className="text-sm font-semibold mb-2 text-blue-300">Scroll Triggers:</h5>
                        <div className="space-y-2">
                          {scrollAnimations.triggers.map((trigger: any, i: number) => (
                            <div key={i} className="bg-black/30 p-3 rounded border border-blue-500/20">
                              <p className="text-sm font-medium text-blue-200">{trigger.section}</p>
                              <p className="text-xs text-muted-foreground mt-1">{trigger.animation}</p>
                              {trigger.code && (
                                <pre className="text-xs mt-2 p-2 bg-black/50 rounded overflow-x-auto">
                                  <code className="text-green-300">{trigger.code}</code>
                                </pre>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* GSAP Setup */}
                    {scrollAnimations.gsapSetup && (
                      <div>
                        <h5 className="text-sm font-semibold mb-2 text-green-300">GSAP ScrollTrigger Setup:</h5>
                        <pre className="text-xs p-4 bg-black/50 rounded border border-green-500/20 overflow-x-auto">
                          <code className="text-green-300">{scrollAnimations.gsapSetup}</code>
                        </pre>
                      </div>
                    )}

                    {/* Implementation Notes */}
                    {scrollAnimations.notes && scrollAnimations.notes.length > 0 && (
                      <div>
                        <h5 className="text-sm font-semibold mb-2 text-yellow-300">Implementation Notes:</h5>
                        <ul className="space-y-1">
                          {scrollAnimations.notes.map((note: string, i: number) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-yellow-400 mt-0.5">▸</span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {!analysisComplete && (
            <div className="bg-muted/50 border border-border rounded-lg p-6">
              <h4 className="font-semibold mb-4">Implementation Notes</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>
                    Frame extraction uses HTML5 Video API for client-side processing
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>
                    Motion detection analyzes frame-to-frame changes
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>
                    AI analysis provides complete implementation details like image analysis
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>
                    Animation parameters are included in the generated prompt
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
