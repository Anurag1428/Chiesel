import { cn } from "@/lib/utils";

interface ConfidenceIndicatorProps {
  confidence: number;
  showLabel?: boolean;
}

export function ConfidenceIndicator({
  confidence,
  showLabel = false,
}: ConfidenceIndicatorProps) {
  const getColor = () => {
    if (confidence > 0.8) return "bg-green-500";
    if (confidence > 0.5) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTextColor = () => {
    if (confidence > 0.8) return "text-green-500";
    if (confidence > 0.5) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all", getColor())}
          style={{ width: `${confidence * 100}%` }}
        />
      </div>
      {showLabel && (
        <span className={cn("text-xs font-medium", getTextColor())}>
          {Math.round(confidence * 100)}%
        </span>
      )}
    </div>
  );
}
