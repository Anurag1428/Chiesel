import { ComponentNode } from "@/types/component-tree";
import { AnalysisData } from "@/components/analysis-results";

export interface TreeNode {
  name: string;
  attributes?: {
    tech?: string;
    phase?: string;
    icon?: string;
  };
  children?: TreeNode[];
}

/**
 * Generate react-d3-tree data structure for implementation workflow
 */
export function generateWorkflowTree(
  analysisData: AnalysisData,
  componentTree: ComponentNode[],
  projectName: string
): TreeNode {
  const has3D = analysisData.has3D;
  const animationComplexity = analysisData.animationComplexity;

  return {
    name: projectName,
    attributes: { phase: "root", icon: "🎯" },
    children: [
      {
        name: "Setup",
        attributes: { phase: "setup", icon: "🔧" },
        children: [
          {
            name: "Install Dependencies",
            attributes: { 
              tech: `React, TypeScript, Tailwind${has3D ? ', Three.js' : ''}`,
              phase: "setup"
            },
          },
          {
            name: "Configure Build",
            attributes: { tech: "Vite/Next.js, PostCSS", phase: "setup" },
          },
        ],
      },
      {
        name: "Design System",
        attributes: { phase: "design", icon: "🎨" },
        children: [
          {
            name: "Color Palette",
            attributes: { 
              tech: analysisData.colors.slice(0, 3).join(', '),
              phase: "design"
            },
          },
          {
            name: "Typography",
            attributes: { 
              tech: analysisData.typography[0] || "Sans-serif",
              phase: "design"
            },
          },
        ],
      },
      {
        name: "Components",
        attributes: { phase: "component", icon: "🧩" },
        children: componentTree.slice(0, 5).map((node) => ({
          name: node.label,
          attributes: { 
            tech: node.detectedTech || "React",
            phase: "component"
          },
          children: node.children?.slice(0, 3).map((child) => ({
            name: child.label,
            attributes: { 
              tech: child.detectedTech || "React",
              phase: "component"
            },
          })),
        })),
      },
      ...(has3D ? [{
        name: "3D Scene",
        attributes: { phase: "3d", icon: "🎮" },
        children: [
          {
            name: "Scene Setup",
            attributes: { tech: "Camera, Renderer, Lights", phase: "3d" },
          },
          {
            name: "3D Models",
            attributes: { tech: "Geometry, Materials, Textures", phase: "3d" },
          },
          {
            name: "Animations",
            attributes: { tech: "Rotation, Interaction", phase: "3d" },
          },
        ],
      }] : []),
      ...(animationComplexity !== 'low' ? [{
        name: "Animations",
        attributes: { phase: "animation", icon: "✨" },
        children: [
          {
            name: "Page Transitions",
            attributes: { tech: "Framer Motion", phase: "animation" },
          },
          {
            name: "Scroll Effects",
            attributes: { tech: "GSAP/CSS", phase: "animation" },
          },
        ],
      }] : []),
      {
        name: "Integration",
        attributes: { phase: "integration", icon: "🔗" },
        children: [
          {
            name: "State Management",
            attributes: { tech: "Context/Zustand", phase: "integration" },
          },
          {
            name: "API Integration",
            attributes: { tech: "Fetch/Axios", phase: "integration" },
          },
        ],
      },
      {
        name: "Testing",
        attributes: { phase: "testing", icon: "🧪" },
        children: [
          {
            name: "Unit Tests",
            attributes: { tech: "Jest/Vitest", phase: "testing" },
          },
          {
            name: "E2E Tests",
            attributes: { tech: "Playwright", phase: "testing" },
          },
        ],
      },
      {
        name: "Optimization",
        attributes: { phase: "optimization", icon: "⚡" },
        children: [
          {
            name: "Performance",
            attributes: { tech: "Code Splitting, Lazy Loading", phase: "optimization" },
          },
          {
            name: "SEO & A11y",
            attributes: { tech: "Meta Tags, ARIA", phase: "optimization" },
          },
        ],
      },
      {
        name: "Deployment",
        attributes: { phase: "deployment", icon: "🚀" },
        children: [
          {
            name: "Build",
            attributes: { tech: "Production Build", phase: "deployment" },
          },
          {
            name: "Deploy",
            attributes: { tech: "Vercel/Netlify", phase: "deployment" },
          },
        ],
      },
    ],
  };
}

/**
 * Generate architecture tree
 */
export function generateArchitectureTree(
  analysisData: AnalysisData,
  componentTree: ComponentNode[]
): TreeNode {
  const has3D = analysisData.has3D;

  return {
    name: "Application Architecture",
    attributes: { phase: "root", icon: "🏗️" },
    children: [
      {
        name: "Frontend Layer",
        attributes: { phase: "frontend", icon: "🖥️" },
        children: [
          {
            name: "UI Components",
            attributes: { tech: "React + TypeScript", phase: "frontend" },
          },
          {
            name: "State Management",
            attributes: { tech: "Context API", phase: "frontend" },
          },
          {
            name: "Routing",
            attributes: { tech: "React Router", phase: "frontend" },
          },
        ],
      },
      {
        name: "Styling Layer",
        attributes: { phase: "styling", icon: "🎨" },
        children: [
          {
            name: "Tailwind CSS",
            attributes: { tech: "Utility Classes", phase: "styling" },
          },
          {
            name: "Custom CSS",
            attributes: { tech: "Animations", phase: "styling" },
          },
        ],
      },
      ...(has3D ? [{
        name: "3D Layer",
        attributes: { phase: "3d", icon: "🎮" },
        children: [
          {
            name: "Three.js Scene",
            attributes: { tech: "WebGL Renderer", phase: "3d" },
          },
          {
            name: "Controls",
            attributes: { tech: "Orbit Controls", phase: "3d" },
          },
        ],
      }] : []),
      {
        name: "Data Layer",
        attributes: { phase: "data", icon: "📊" },
        children: [
          {
            name: "API Calls",
            attributes: { tech: "Fetch/Axios", phase: "data" },
          },
          {
            name: "Cache",
            attributes: { tech: "Local Storage", phase: "data" },
          },
        ],
      },
    ],
  };
}
