"use client";

import { motion } from "framer-motion";
import { Layout, Type, Palette, Box, Zap } from "lucide-react";

export interface AnalysisData {
  layout: string;
  typography: string[];
  colors: string[];
  has3D: boolean;
  animationComplexity: "low" | "medium" | "high";
}

interface AnalysisResultsProps {
  data: AnalysisData;
}

export function AnalysisResults({ data }: AnalysisResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Layout className="w-5 h-5" />
          Layout Structure
        </h3>
        <p className="text-muted-foreground">{data.layout}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Type className="w-5 h-5" />
          Typography
        </h3>
        <ul className="space-y-2">
          {data.typography.map((font, index) => (
            <li key={index} className="text-muted-foreground">
              • {font}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Color Palette
        </h3>
        <div className="flex flex-wrap gap-3">
          {data.colors.map((color, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-12 h-12 rounded-lg border border-border"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-muted-foreground font-mono">
                {color}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Box className="w-5 h-5" />
          3D Elements
        </h3>
        <p className="text-muted-foreground">
          {data.has3D ? "Detected" : "Not detected"}
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Animation Complexity
        </h3>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width:
                  data.animationComplexity === "low"
                    ? "33%"
                    : data.animationComplexity === "medium"
                    ? "66%"
                    : "100%",
              }}
              className="h-full bg-primary"
            />
          </div>
          <span className="text-sm text-muted-foreground capitalize">
            {data.animationComplexity}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
