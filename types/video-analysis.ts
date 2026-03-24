export interface VideoFrame {
  id: string;
  timestamp: number;
  imageUrl: string;
  selected: boolean;
}

export interface MotionAnalysis {
  duration: number;
  easing: "spring" | "bounce" | "linear" | "ease-in" | "ease-out" | "ease-in-out";
  intensity: "low" | "medium" | "high";
  detectedChanges: string[];
}

export const easingOptions = [
  { value: "spring", label: "Spring" },
  { value: "bounce", label: "Bounce" },
  { value: "linear", label: "Linear" },
  { value: "ease-in", label: "Ease In" },
  { value: "ease-out", label: "Ease Out" },
  { value: "ease-in-out", label: "Ease In-Out" },
] as const;
