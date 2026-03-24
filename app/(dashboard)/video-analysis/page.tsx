"use client";

import { useState } from "react";
import { FileDropzone } from "@/components/file-dropzone";
import { VideoFrameExtractor } from "@/components/video-frame-extractor";
import { VideoFilmstrip } from "@/components/video-filmstrip";
import { MotionDetectionView } from "@/components/motion-detection-view";
import { Button } from "@/components/ui/button";
import { VideoFrame, MotionAnalysis } from "@/types/video-analysis";
import { detectMotion } from "@/lib/video-processor";
import { ArrowLeft } from "lucide-react";

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
  const [aiAnalysis, setAiAnalysis] = useState<{
    has3D: boolean;
    colors: string[];
    animationComplexity: string;
  } | null>(null);

  const handleFilesAccepted = (files: File[]) => {
    const video = files.find((f) => f.type.startsWith("video/"));
    if (video) {
      setVideoFile(video);
      setFrames([]);
      setSelectedFrameId("");
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
    setAiAnalysis(null);
  };

  const handleAIAnalysis = async () => {
    if (frames.length === 0) return;
    
    setIsAnalyzing(true);
    
    try {
      // Convert first frame to base64
      const response = await fetch(frames[0].imageUrl);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
        reader.readAsDataURL(blob);
      });

      // Call AI API
      const aiResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          step: 'vision',
          base64Image: base64,
          projectName: videoFile?.name || 'Video Analysis',
        }),
      });

      if (!aiResponse.ok) {
        throw new Error('AI analysis failed');
      }

      const result = await aiResponse.json();
      
      setAiAnalysis({
        has3D: result.analysisData.has3D,
        colors: result.analysisData.colors,
        animationComplexity: result.analysisData.animationComplexity,
      });
    } catch (error) {
      console.error('AI analysis error:', error);
      alert('Failed to analyze with AI. Please try again.');
    } finally {
      setIsAnalyzing(false);
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
          Extract frames and analyze motion from video uploads
        </p>
      </div>

      {!videoFile && (
        <div className="space-y-4">
          <FileDropzone onFilesAccepted={handleFilesAccepted} maxFiles={1} />
          <p className="text-sm text-muted-foreground text-center">
            Upload a video file (MP4) to extract frames and analyze motion
          </p>
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
              Analysis: {videoFile?.name}
            </h3>
            <Button variant="outline" onClick={handleReset}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              New Video
            </Button>
          </div>

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
                <h4 className="font-semibold mb-1">AI Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Analyze frames with AI to detect 3D elements
                </p>
              </div>
              <Button
                onClick={handleAIAnalysis}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Analyzing...
                  </>
                ) : (
                  'Analyze with AI'
                )}
              </Button>
            </div>
            
            {aiAnalysis && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">3D Elements:</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${aiAnalysis.has3D ? 'text-green-400' : 'text-muted-foreground'}`}>
                      {aiAnalysis.has3D ? '✅ Detected' : '❌ Not detected'}
                    </span>
                    {!aiAnalysis.has3D && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setAiAnalysis({
                            ...aiAnalysis,
                            has3D: true,
                          });
                        }}
                      >
                        Mark as 3D
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Animation:</span>
                  <span className="text-sm text-muted-foreground capitalize">
                    {aiAnalysis.animationComplexity}
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium">Colors:</span>
                  <div className="flex gap-1">
                    {aiAnalysis.colors.slice(0, 5).map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded border border-border"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                
                {aiAnalysis.has3D && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-sm text-green-400 mb-2">
                      ✅ 3D elements confirmed! This design uses WebGL/Three.js
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Consider using Three.js, React Three Fiber, or vanilla WebGL for implementation
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground mt-2">
              AI analyzes the first frame to detect 3D elements, colors, and animation complexity
            </p>
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-6">
            <h4 className="font-semibold mb-4">Implementation Notes</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  Frame extraction uses FFmpeg.wasm for client-side processing
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  Motion detection is currently simulated - CV analysis will be
                  added in future updates
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  Animation parameters can be manually adjusted and will be
                  included in the generated prompt
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  Visual diff overlay helps identify changes between consecutive
                  frames
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
