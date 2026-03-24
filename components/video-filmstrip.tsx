"use client";

import { VideoFrame } from "@/types/video-analysis";
import { cn } from "@/lib/utils";
import { Play, Clock } from "lucide-react";
import Image from "next/image";

interface VideoFilmstripProps {
  frames: VideoFrame[];
  selectedFrameId: string;
  onFrameSelect: (frameId: string) => void;
}

export function VideoFilmstrip({
  frames,
  selectedFrameId,
  onFrameSelect,
}: VideoFilmstripProps) {
  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Film className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Video Timeline</h3>
        <span className="text-sm text-muted-foreground">
          ({frames.length} frames)
        </span>
      </div>

      <div className="relative">
        {/* Filmstrip Container */}
        <div className="bg-card border-2 border-border rounded-lg p-4 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {frames.map((frame, index) => (
              <button
                key={frame.id}
                onClick={() => onFrameSelect(frame.id)}
                className={cn(
                  "relative group flex-shrink-0 transition-all",
                  selectedFrameId === frame.id
                    ? "ring-4 ring-primary ring-offset-2 ring-offset-background"
                    : "hover:ring-2 hover:ring-primary/50"
                )}
              >
                {/* Frame Image */}
                <div className="relative w-48 h-32 bg-muted rounded-lg overflow-hidden border-2 border-border">
                  <Image
                    src={frame.imageUrl}
                    alt={`Frame ${index + 1}`}
                    fill
                    className="object-cover"
                  />

                  {/* Play Icon Overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity",
                      selectedFrameId === frame.id
                        ? "opacity-0"
                        : "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    <Play className="w-8 h-8 text-white" />
                  </div>

                  {/* Selected Indicator */}
                  {selectedFrameId === frame.id && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                      ACTIVE
                    </div>
                  )}
                </div>

                {/* Frame Info */}
                <div className="mt-2 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="font-mono">
                      {formatTimestamp(frame.timestamp)}
                    </span>
                  </div>
                  <div className="text-xs font-medium">Frame {index + 1}</div>
                </div>

                {/* Film Sprocket Holes */}
                <div className="absolute -left-2 top-0 bottom-0 w-4 flex flex-col justify-around py-2">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-border rounded-sm"
                    />
                  ))}
                </div>
                <div className="absolute -right-2 top-0 bottom-0 w-4 flex flex-col justify-around py-2">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-border rounded-sm"
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Bar */}
        <div className="mt-4 relative h-2 bg-muted rounded-full overflow-hidden">
          <div className="absolute inset-0 flex">
            {frames.map((frame) => (
              <div
                key={frame.id}
                className={cn(
                  "flex-1 transition-colors",
                  selectedFrameId === frame.id
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Film({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 3v18" />
      <path d="M3 7.5h4" />
      <path d="M3 12h18" />
      <path d="M3 16.5h4" />
      <path d="M17 3v18" />
      <path d="M17 7.5h4" />
      <path d="M17 16.5h4" />
    </svg>
  );
}
