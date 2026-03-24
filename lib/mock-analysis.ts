import { AnalysisData } from "@/components/analysis-results";

export const mockAnalysisData: AnalysisData = {
  layout: "Modern grid-based layout with a hero section, feature cards in a 3-column grid, and a footer. Uses flexbox for responsive alignment.",
  typography: [
    "Primary: Inter (headings, 600-700 weight)",
    "Secondary: Inter (body text, 400 weight)",
    "Sizes: 48px (hero), 24px (headings), 16px (body)",
  ],
  colors: ["#0F172A", "#3B82F6", "#F8FAFC", "#64748B", "#10B981"],
  has3D: true,
  animationComplexity: "medium",
};

export const mockHotspots = [
  {
    id: "1",
    x: 50,
    y: 20,
    label: "Hero",
    description: "Large heading with CTA button, centered layout",
  },
  {
    id: "2",
    x: 30,
    y: 50,
    label: "Card",
    description: "Feature card with icon, title, and description",
  },
  {
    id: "3",
    x: 70,
    y: 50,
    label: "Grid",
    description: "3-column responsive grid layout",
  },
];

export async function simulateAnalysis(
  onProgress: (step: number) => void
): Promise<void> {
  const steps = [
    { delay: 1000, step: 1 }, // Uploading
    { delay: 1500, step: 2 }, // Analyzing Visuals
    { delay: 2000, step: 3 }, // Extracting Components
    { delay: 1500, step: 4 }, // Generating Prompt
  ];

  for (const { delay, step } of steps) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    onProgress(step);
  }
}
