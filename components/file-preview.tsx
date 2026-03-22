"use client";

import { X, FileVideo } from "lucide-react";
import Image from "next/image";

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export function FilePreview({ file, onRemove }: FilePreviewProps) {
  const isVideo = file.type.startsWith("video/");
  const previewUrl = URL.createObjectURL(file);

  return (
    <div className="relative group">
      <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted border border-border">
        {isVideo ? (
          <div className="w-full h-full flex items-center justify-center">
            <FileVideo className="w-12 h-12 text-muted-foreground" />
          </div>
        ) : (
          <Image
            src={previewUrl}
            alt={file.name}
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
      <p className="text-xs text-muted-foreground mt-1 truncate w-32">
        {file.name}
      </p>
    </div>
  );
}
