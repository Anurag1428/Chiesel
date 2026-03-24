"use client";

import { useState, useEffect } from "react";
import { extractFrames } from "@/lib/video-processor";
import { VideoFrame } from "@/types/video-analysis";
import { Loader2, Film } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface VideoFrameExtractorProps {
  videoFile: File;
  onFramesExtracted: (frames: VideoFrame[]) => void;
}

export function VideoFrameExtractor({
  videoFile,
  onFramesExtracted,
}: VideoFrameExtractorProps) {
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    extractVideoFrames();
  }, [videoFile]);

  const extractVideoFrames = async () => {
    setIsExtracting(true);
    setError(null);
    setProgress(0);

    try {
      const frames = await extractFrames(videoFile, 5, (prog) => {
        setProgress(prog);
      });

      onFramesExtracted(frames);
    } catch (err) {
      console.error("Frame extraction error:", err);
      setError("Failed to extract frames. Please try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive rounded-lg p-6 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (isExtracting) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Film className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Extracting Video Frames</h3>
            <p className="text-sm text-muted-foreground">
              Processing video with FFmpeg...
            </p>
          </div>
          <div className="w-full max-w-md space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground">
              {Math.round(progress)}% complete
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
