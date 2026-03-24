import { AnalysisData } from "@/components/analysis-results";
import { ComponentNode } from "./component-tree";
import { ThreeDConfig } from "./three-config";

export interface SavedAnalysis {
  id: string;
  projectName: string;
  createdAt: Date;
  thumbnail: string;
  analysisData: AnalysisData;
  componentTree: ComponentNode[];
  threeDConfig?: ThreeDConfig;
  prompt: string;
  techTags: string[];
}

export interface ShareableData {
  projectName: string;
  analysisData: AnalysisData;
  componentTree: ComponentNode[];
  threeDConfig?: ThreeDConfig;
  timestamp: number;
}
