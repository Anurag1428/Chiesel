import { cn } from "@/lib/utils";

interface TechBadgeProps {
  tech: string;
  className?: string;
}

const techColors: Record<string, string> = {
  "Three.js": "bg-black text-white",
  GSAP: "bg-green-600 text-white",
  "Framer Motion": "bg-purple-600 text-white",
  React: "bg-blue-500 text-white",
  Tailwind: "bg-cyan-500 text-white",
  CSS: "bg-blue-400 text-white",
  HTML: "bg-orange-500 text-white",
};

export function TechBadge({ tech, className }: TechBadgeProps) {
  const colorClass = techColors[tech] || "bg-gray-600 text-white";

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded text-xs font-medium",
        colorClass,
        className
      )}
    >
      {tech}
    </span>
  );
}
