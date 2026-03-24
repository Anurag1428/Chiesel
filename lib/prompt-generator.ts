import { AnalysisData } from "@/components/analysis-results";
import { ComponentNode } from "@/types/component-tree";
import { ThreeDConfig } from "@/types/three-config";

interface PromptGenerationInput {
  projectName: string;
  analysisData: AnalysisData;
  componentTree: ComponentNode[];
  threeDConfig?: ThreeDConfig;
}

function generateComponentBreakdown(
  nodes: ComponentNode[],
  level: number = 0
): string {
  let output = "";
  const indent = "  ".repeat(level);

  for (const node of nodes) {
    output += `${indent}- **${node.label}** (${node.type})\n`;
    if (node.detectedTech) {
      output += `${indent}  - Technology: ${node.detectedTech}\n`;
    }
    output += `${indent}  - Confidence: ${Math.round(node.confidence * 100)}%\n`;

    if (node.props && Object.keys(node.props).length > 0) {
      output += `${indent}  - Properties:\n`;
      for (const [key, value] of Object.entries(node.props)) {
        output += `${indent}    - ${key}: ${JSON.stringify(value)}\n`;
      }
    }

    if (node.children && node.children.length > 0) {
      output += `${indent}  - Children:\n`;
      output += generateComponentBreakdown(node.children, level + 2);
    }
    output += "\n";
  }

  return output;
}

export function generateImplementationPrompt(
  input: PromptGenerationInput
): string {
  const { projectName, analysisData, componentTree, threeDConfig } = input;

  const prompt = `# MASTER IMPLEMENTATION PROMPT

Project: **${projectName}**

This document contains a comprehensive implementation guide generated from design analysis. Follow these instructions to recreate the design with pixel-perfect accuracy.

---

## GENERAL RULES

- **Pixel Perfection**: Match the design exactly. Pay attention to spacing, alignment, and proportions.
- **Responsive Design**: Ensure the layout works seamlessly across all screen sizes (mobile, tablet, desktop).
- **Semantic HTML**: Use appropriate HTML5 semantic elements (\`<header>\`, \`<nav>\`, \`<main>\`, \`<section>\`, \`<article>\`, \`<footer>\`).
- **Accessibility**: Follow WCAG 2.1 AA standards. Include proper ARIA labels, keyboard navigation, and screen reader support.
- **Code Quality**: Write clean, maintainable code with proper comments and documentation.
- **Performance First**: Optimize images, lazy load content, and minimize bundle size.
- **Cross-Browser Compatibility**: Test on Chrome, Firefox, Safari, and Edge.

---

## TECH STACK DETECTION

Based on visual analysis, the following technologies are recommended:

${analysisData.has3D ? "- **Three.js**: For 3D graphics and WebGL rendering\n" : ""}${
    analysisData.animationComplexity === "high"
      ? "- **GSAP**: For complex scroll-triggered animations and timeline-based effects\n"
      : analysisData.animationComplexity === "medium"
      ? "- **Framer Motion**: For smooth component animations and transitions\n"
      : "- **CSS Animations**: For simple transitions and hover effects\n"
  }- **React**: Component-based architecture for maintainability
- **TypeScript**: Type safety and better developer experience
- **Tailwind CSS**: Utility-first styling for rapid development
- **Next.js**: Server-side rendering and optimal performance

### Detected Technologies from Components:
${Array.from(
  new Set(
    componentTree
      .flatMap((node) => [
        node.detectedTech,
        ...(node.children?.map((c) => c.detectedTech) || []),
      ])
      .filter(Boolean)
  )
)
  .map((tech) => `- ${tech}`)
  .join("\n")}

${
  threeDConfig
    ? `
---

## THREE.JS CONFIGURATION

The design includes 3D elements. Use the following configuration for Three.js implementation:

### Material Properties
\`\`\`javascript
const material = new THREE.MeshPhysicalMaterial({
  transmission: ${threeDConfig.material.transmission},
  roughness: ${threeDConfig.material.roughness},
  metalness: ${threeDConfig.material.metalness},
  clearcoat: ${threeDConfig.material.clearcoat},
  clearcoatRoughness: 0.1,
});
\`\`\`

**Material Notes:**
- Transmission: ${threeDConfig.material.transmission} ${
        threeDConfig.material.transmission > 0.5
          ? "(glass-like transparency)"
          : "(mostly opaque)"
      }
- Roughness: ${threeDConfig.material.roughness} ${
        threeDConfig.material.roughness > 0.5 ? "(matte finish)" : "(glossy finish)"
      }
- Metalness: ${threeDConfig.material.metalness} ${
        threeDConfig.material.metalness > 0.5 ? "(metallic)" : "(non-metallic)"
      }
- Clearcoat: ${threeDConfig.material.clearcoat} ${
        threeDConfig.material.clearcoat > 0.5
          ? "(car paint effect)"
          : "(no clearcoat)"
      }

### Geometry
\`\`\`javascript
const geometry = new THREE.${
        threeDConfig.geometry.type.charAt(0).toUpperCase() +
        threeDConfig.geometry.type.slice(1)
      }Geometry(
  1, // size/radius
  ${threeDConfig.geometry.segments}, // segments
  ${threeDConfig.geometry.segments}  // detail level
);
\`\`\`

**Geometry Type:** ${threeDConfig.geometry.type}  
**Segments:** ${threeDConfig.geometry.segments} (${
        threeDConfig.geometry.segments > 64
          ? "high detail"
          : threeDConfig.geometry.segments > 32
          ? "medium detail"
          : "low detail"
      })

### Lighting Setup
\`\`\`javascript
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, ${threeDConfig.lighting.ambientIntensity});
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(${threeDConfig.lighting.directionalPosition.x}, ${threeDConfig.lighting.directionalPosition.y}, ${threeDConfig.lighting.directionalPosition.z});
scene.add(directionalLight);

// Point Light
const pointLight = new THREE.PointLight(${threeDConfig.lighting.pointLightColor}, 1, 100);
pointLight.position.set(2, 2, 2);
scene.add(pointLight);
\`\`\`

### Camera Configuration
\`\`\`javascript
const camera = new THREE.PerspectiveCamera(
  ${threeDConfig.camera.fov}, // FOV
  window.innerWidth / window.innerHeight, // aspect ratio
  0.1, // near plane
  1000 // far plane
);

camera.position.set(${threeDConfig.camera.position.x}, ${threeDConfig.camera.position.y}, ${threeDConfig.camera.position.z});
camera.lookAt(${threeDConfig.camera.lookAt.x}, ${threeDConfig.camera.lookAt.y}, ${threeDConfig.camera.lookAt.z});
\`\`\`

### Animation & Controls
\`\`\`javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = ${threeDConfig.animation.enableDamping};
${
  threeDConfig.animation.enableDamping
    ? `controls.dampingFactor = ${threeDConfig.animation.dampingFactor};`
    : ""
}
controls.autoRotate = ${threeDConfig.animation.autoRotateSpeed > 0};
${
  threeDConfig.animation.autoRotateSpeed > 0
    ? `controls.autoRotateSpeed = ${threeDConfig.animation.autoRotateSpeed};`
    : ""
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
\`\`\`

**Animation Settings:**
- Auto-rotate: ${threeDConfig.animation.autoRotateSpeed > 0 ? "Enabled" : "Disabled"}${
        threeDConfig.animation.autoRotateSpeed > 0
          ? ` (speed: ${threeDConfig.animation.autoRotateSpeed})`
          : ""
      }
- Damping: ${threeDConfig.animation.enableDamping ? "Enabled" : "Disabled"}${
        threeDConfig.animation.enableDamping
          ? ` (factor: ${threeDConfig.animation.dampingFactor})`
          : ""
      }

### React Three Fiber Implementation
\`\`\`tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

export function Scene3D() {
  return (
    <Canvas camera={{ 
      fov: ${threeDConfig.camera.fov}, 
      position: [${threeDConfig.camera.position.x}, ${threeDConfig.camera.position.y}, ${threeDConfig.camera.position.z}] 
    }}>
      <ambientLight intensity={${threeDConfig.lighting.ambientIntensity}} />
      <directionalLight 
        position={[${threeDConfig.lighting.directionalPosition.x}, ${threeDConfig.lighting.directionalPosition.y}, ${threeDConfig.lighting.directionalPosition.z}]} 
      />
      <pointLight 
        color="${threeDConfig.lighting.pointLightColor}" 
        position={[2, 2, 2]} 
      />
      
      <mesh>
        <${threeDConfig.geometry.type}Geometry args={[1, ${threeDConfig.geometry.segments}, ${threeDConfig.geometry.segments}]} />
        <meshPhysicalMaterial
          transmission={${threeDConfig.material.transmission}}
          roughness={${threeDConfig.material.roughness}}
          metalness={${threeDConfig.material.metalness}}
          clearcoat={${threeDConfig.material.clearcoat}}
        />
      </mesh>
      
      <OrbitControls
        enableDamping={${threeDConfig.animation.enableDamping}}
        ${
          threeDConfig.animation.enableDamping
            ? `dampingFactor={${threeDConfig.animation.dampingFactor}}`
            : ""
        }
        autoRotate={${threeDConfig.animation.autoRotateSpeed > 0}}
        ${
          threeDConfig.animation.autoRotateSpeed > 0
            ? `autoRotateSpeed={${threeDConfig.animation.autoRotateSpeed}}`
            : ""
        }
      />
    </Canvas>
  );
}
\`\`\`
`
    : ""
}

---

## COMPONENT BREAKDOWN

### Layout Structure
${analysisData.layout}

### Component Hierarchy

${generateComponentBreakdown(componentTree)}

---

## DESIGN SYSTEM

### Color Palette

Define these CSS variables in your global stylesheet:

\`\`\`css
:root {
${analysisData.colors
  .map((color, index) => `  --color-${index + 1}: ${color};`)
  .join("\n")}
  
  /* Semantic color assignments */
  --color-primary: ${analysisData.colors[0] || "#000000"};
  --color-secondary: ${analysisData.colors[1] || "#666666"};
  --color-accent: ${analysisData.colors[2] || "#0066FF"};
  --color-background: ${analysisData.colors[3] || "#FFFFFF"};
  --color-text: ${analysisData.colors[4] || "#000000"};
}
\`\`\`

### Typography Scale

${analysisData.typography.map((font) => `- ${font}`).join("\n")}

**Recommended Type Scale:**
\`\`\`css
:root {
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  --font-size-5xl: 3rem;      /* 48px */
}
\`\`\`

---

## INTERACTIONS & ANIMATIONS

### Animation Complexity: **${analysisData.animationComplexity.toUpperCase()}**

${
  analysisData.animationComplexity === "high"
    ? `
**High Complexity Animations:**
- Implement scroll-triggered animations using GSAP ScrollTrigger
- Create parallax effects for depth and visual interest
- Add stagger animations for list items and cards
- Use timeline-based sequences for complex interactions
- Implement smooth page transitions

**Example GSAP Setup:**
\`\`\`javascript
gsap.registerPlugin(ScrollTrigger);

gsap.from(".hero-title", {
  y: 100,
  opacity: 0,
  duration: 1,
  scrollTrigger: {
    trigger: ".hero",
    start: "top center",
    end: "bottom center",
    scrub: true
  }
});
\`\`\`
`
    : analysisData.animationComplexity === "medium"
    ? `
**Medium Complexity Animations:**
- Use Framer Motion for component enter/exit animations
- Add hover states with smooth transitions
- Implement fade-in effects on scroll
- Create animated page transitions
- Add micro-interactions for buttons and links

**Example Framer Motion Setup:**
\`\`\`jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {content}
</motion.div>
\`\`\`
`
    : `
**Low Complexity Animations:**
- Use CSS transitions for hover effects
- Add simple fade-in animations
- Implement smooth scrolling
- Use transform for performance-optimized animations

**Example CSS:**
\`\`\`css
.button {
  transition: all 0.3s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
\`\`\`
`
}

### Scroll Behavior
- Implement smooth scrolling for anchor links
- Add scroll-to-top button for long pages
- Consider implementing scroll snap for section-based layouts

### Hover States
- All interactive elements must have clear hover states
- Use subtle transitions (200-300ms) for smooth feedback
- Maintain accessibility with focus states for keyboard navigation

---

## PERFORMANCE REQUIREMENTS

### Target Metrics
- **Lighthouse Performance Score**: 90+
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Strategies

**Image Optimization:**
- Use Next.js Image component for automatic optimization
- Implement lazy loading for images below the fold
- Use WebP format with fallbacks
- Provide responsive images with srcset

**Code Splitting:**
- Lazy load components not needed for initial render
- Use dynamic imports for heavy libraries
- Split vendor bundles appropriately

**Asset Loading:**
- Preload critical fonts and assets
- Defer non-critical JavaScript
- Minimize CSS and JavaScript bundles
- Use CDN for static assets

**Example Next.js Image:**
\`\`\`jsx
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  priority
  quality={85}
/>
\`\`\`

---

## IMPLEMENTATION CHECKLIST

- [ ] Set up project with recommended tech stack
- [ ] Implement design system (colors, typography, spacing)
- [ ] Build component hierarchy following the breakdown
- [ ] Add animations and interactions
- [ ] Optimize images and assets
- [ ] Test responsive behavior on all breakpoints
- [ ] Run Lighthouse audit and optimize
- [ ] Test accessibility with screen readers
- [ ] Cross-browser testing
- [ ] Deploy and monitor performance

---

## NOTES

- This prompt was generated automatically from design analysis
- Review confidence scores for each component - low scores may need manual verification
- Adjust spacing and sizing based on actual design measurements
- Test thoroughly before production deployment

**Generated on:** ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
`;

  return prompt;
}

export function generateCursorRules(prompt: string): string {
  return `# Cursor Rules for Implementation

${prompt}

## Cursor-Specific Instructions

- Use Cursor's AI to help implement complex components
- Ask Cursor to generate TypeScript types for component props
- Use Cursor's inline suggestions for styling
- Request Cursor to optimize code for performance
- Ask Cursor to add accessibility attributes
`;
}

export function generateClaudeInstructions(prompt: string): string {
  return `# Claude Code Implementation Instructions

You are tasked with implementing a web application based on the following design analysis.

${prompt}

## Your Approach

1. **Understand First**: Read through the entire prompt before starting
2. **Plan Structure**: Outline the component hierarchy and file structure
3. **Implement Incrementally**: Build one section at a time, testing as you go
4. **Follow Standards**: Adhere to React and Next.js best practices
5. **Optimize**: Keep performance in mind throughout implementation
6. **Document**: Add comments for complex logic

## Code Style

- Use functional components with hooks
- Prefer composition over inheritance
- Keep components small and focused
- Use TypeScript for type safety
- Follow the project's ESLint configuration

Begin implementation when ready.
`;
}
