"use client";

import { useState } from "react";
import { VideoFrame, MotionAnalysis, easingOptions } from "@/types/video-analysis";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap, Activity, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MotionDetectionViewProps {
  frames: VideoFrame[];
  selectedFrame: VideoFrame;
  motionAnalysis: MotionAnalysis;
  onAnalysisUpdate: (analysis: MotionAnalysis) => void;
}

export function MotionDetectionView({
  frames,
  selectedFrame,
  motionAnalysis,
  onAnalysisUpdate,
}: MotionDetectionViewProps) {
  const [showDiff, setShowDiff] = useState(true);

  const selectedIndex = frames.findIndex((f) => f.id === selectedFrame.id);
  const previousFrame = selectedIndex > 0 ? frames[selectedIndex - 1] : null;

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "high":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "medium":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "low":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      default:
        return "text-muted-foreground bg-muted border-border";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
          <Activity className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Motion Detection</h3>
          <p className="text-sm text-muted-foreground">
            Visual differences between frames
          </p>
        </div>
      </div>

      {/* Visual Diff */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {previousFrame && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Previous Frame</Label>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border border-border">
              <Image
                src={previousFrame.imageUrl}
                alt="Previous frame"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-sm font-medium">Current Frame</Label>
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border border-border">
            <Image
              src={selectedFrame.imageUrl}
              alt="Current frame"
              fill
              className="object-cover"
            />
            {showDiff && previousFrame && (
              <div className="absolute inset-0 bg-primary/20 mix-blend-difference" />
            )}
          </div>
        </div>
      </div>

      {/* Diff Toggle */}
      {previousFrame && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDiff(!showDiff)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              showDiff
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {showDiff ? "Hide" : "Show"} Visual Diff
          </button>
          <span className="text-xs text-muted-foreground">
            Highlights changes between frames
          </span>
        </div>
      )}

      {/* Detected Changes */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <h4 className="font-semibold text-sm">Detected Changes</h4>
        </div>
        <ul className="space-y-2">
          {motionAnalysis.detectedChanges.map((change, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="text-primary mt-0.5">•</span>
              <span>{change}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Animation Parameters */}
      <div className="bg-gradient-to-br from-purple-600/5 to-blue-600/5 border border-border rounded-lg p-6 space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h4 className="font-semibold">Animation Parameters</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Duration */}
          <div className="space-y-3">
            <Label htmlFor="duration" className="text-sm font-medium">
              Estimated Duration
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="duration"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={motionAnalysis.duration}
                onChange={(e) =>
                  onAnalysisUpdate({
                    ...motionAnalysis,
                    duration: parseFloat(e.target.value) || 0,
                  })
                }
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground">seconds</span>
            </div>
            <p className="text-xs text-muted-foreground">
              How long the animation should take
            </p>
          </div>

          {/* Easing */}
          <div className="space-y-3">
            <Label htmlFor="easing" className="text-sm font-medium">
              Detected Easing
            </Label>
            <Select
              value={motionAnalysis.easing}
              onValueChange={(value: any) =>
                onAnalysisUpdate({
                  ...motionAnalysis,
                  easing: value,
                })
              }
            >
              <SelectTrigger id="easing">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {easingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Animation timing function
            </p>
          </div>
        </div>

        {/* Motion Intensity */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Motion Intensity</Label>
          <div className="flex gap-2">
            {(["low", "medium", "high"] as const).map((intensity) => (
              <button
                key={intensity}
                onClick={() =>
                  onAnalysisUpdate({
                    ...motionAnalysis,
                    intensity,
                  })
                }
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg border-2 text-sm font-medium capitalize transition-all",
                  motionAnalysis.intensity === intensity
                    ? getIntensityColor(intensity)
                    : "border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                {intensity}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Overall movement intensity in the animation
          </p>
        </div>

        {/* Preview Code */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">
            Generated CSS
          </Label>
          <pre className="text-xs font-mono text-foreground">
            {`animation: motion ${motionAnalysis.duration}s ${motionAnalysis.easing};`}
          </pre>
        </div>
      </div>
    </div>
  );
}
