"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

interface ProgressStep {
  label: string;
  status: "pending" | "active" | "complete";
}

interface AnalysisProgressProps {
  steps: ProgressStep[];
}

export function AnalysisProgress({ steps }: AnalysisProgressProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="flex-shrink-0">
            {step.status === "complete" ? (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-5 h-5 text-primary-foreground" />
              </div>
            ) : step.status === "active" ? (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-muted" />
            )}
          </div>
          <span
            className={
              step.status === "pending"
                ? "text-muted-foreground"
                : "text-foreground"
            }
          >
            {step.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
