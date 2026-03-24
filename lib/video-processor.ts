import { VideoFrame } from "@/types/video-analysis";

// Simple video frame extraction using HTML5 Video API (no FFmpeg needed)
export async function extractFrames(
  videoFile: File,
  frameCount: number = 5,
  onProgress?: (progress: number) => void
): Promise<VideoFrame[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    
    let hasResolved = false;
    
    video.onloadedmetadata = async () => {
      if (hasResolved) return;
      
      const duration = video.duration;
      
      if (!duration || duration === Infinity || isNaN(duration)) {
        reject(new Error('Invalid video duration. Please try a different video file.'));
        return;
      }
      
      const frames: VideoFrame[] = [];
      const interval = duration / (frameCount + 1);
      
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      try {
        for (let i = 1; i <= frameCount; i++) {
          const timestamp = interval * i;
          
          // Seek to timestamp
          await seekToTime(video, timestamp);
          
          // Draw frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert to blob
          const blob = await new Promise<Blob>((res, rej) => {
            canvas.toBlob((b) => {
              if (b) res(b);
              else rej(new Error('Failed to create blob'));
            }, 'image/jpeg', 0.9);
          });
          
          const imageUrl = URL.createObjectURL(blob);
          
          frames.push({
            id: `frame-${i}`,
            timestamp,
            imageUrl,
            selected: i === 1,
          });
          
          if (onProgress) {
            onProgress((i / frameCount) * 100);
          }
        }
        
        hasResolved = true;
        URL.revokeObjectURL(video.src);
        resolve(frames);
      } catch (error) {
        hasResolved = true;
        URL.revokeObjectURL(video.src);
        reject(error);
      }
    };
    
    video.onerror = (e) => {
      if (hasResolved) return;
      hasResolved = true;
      URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video. Please ensure the file is a valid video format (MP4, WebM).'));
    };
    
    // Timeout after 30 seconds
    setTimeout(() => {
      if (!hasResolved) {
        hasResolved = true;
        URL.revokeObjectURL(video.src);
        reject(new Error('Video loading timeout. Please try a smaller video file.'));
      }
    }, 30000);
    
    video.src = URL.createObjectURL(videoFile);
    video.load();
  });
}

function seekToTime(video: HTMLVideoElement, time: number): Promise<void> {
  return new Promise((resolve) => {
    const onSeeked = () => {
      video.removeEventListener('seeked', onSeeked);
      // Small delay to ensure frame is rendered
      setTimeout(resolve, 100);
    };
    
    video.addEventListener('seeked', onSeeked);
    video.currentTime = time;
  });
}

async function getVideoDuration(videoFile: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.src = URL.createObjectURL(videoFile);
  });
}

// Mock function for MVP - will be replaced with actual CV analysis
export function detectMotion(frames: VideoFrame[]): {
  changes: string[];
  intensity: "low" | "medium" | "high";
} {
  // Simulate motion detection
  const mockChanges = [
    "Position change detected (X: +120px, Y: -45px)",
    "Scale transformation (1.0 → 1.2)",
    "Opacity transition (1.0 → 0.8)",
    "Rotation detected (0° → 15°)",
  ];

  const randomIntensity = ["low", "medium", "high"][
    Math.floor(Math.random() * 3)
  ] as "low" | "medium" | "high";

  return {
    changes: mockChanges.slice(0, Math.floor(Math.random() * 3) + 2),
    intensity: randomIntensity,
  };
}
