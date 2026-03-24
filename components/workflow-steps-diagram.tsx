"use client";

import { Card } from "@/components/ui/card";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface WorkflowStep {
  phase: string;
  icon: string;
  steps: string[];
}

interface WorkflowStepsDiagramProps {
  steps: WorkflowStep[];
  title?: string;
}

export function WorkflowStepsDiagram({ steps, title = "Implementation Workflow" }: WorkflowStepsDiagramProps) {
  return (
    <Card className="p-6 bg-card border border-border">
      <h3 className="text-xl font-semibold mb-6">{title}</h3>
      
      <div className="space-y-6">
        {steps.map((workflow, index) => (
          <div key={index} className="relative">
            {/* Phase Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-2xl">
                {workflow.icon}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground">
                  {workflow.phase}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Step {index + 1} of {steps.length}
                </p>
              </div>
            </div>

            {/* Steps List */}
            <div className="ml-6 pl-6 border-l-2 border-border space-y-3">
              {workflow.steps.map((step, stepIndex) => (
                <div key={stepIndex} className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {step}
                  </p>
                </div>
              ))}
            </div>

            {/* Arrow to next phase */}
            {index < steps.length - 1 && (
              <div className="flex justify-center my-4">
                <ArrowRight className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground text-center">
          Total {steps.length} phases • {steps.reduce((acc, s) => acc + s.steps.length, 0)} actionable steps
        </p>
      </div>
    </Card>
  );
}
