import { NextRequest, NextResponse } from "next/server";

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || "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";
const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const { step, base64Image, projectName, isVideo, additionalFrames, frameTimestamps } = await request.json();

    if (step === "vision") {
      console.log("Starting Kimi K2.5 direct vision analysis...");
      
      const analysisType = isVideo ? "VIDEO FRAME" : "SCREENSHOT";
      const multiFrameInfo = additionalFrames && additionalFrames.length > 0 
        ? `\n\nMULTI-FRAME ANALYSIS:
You are analyzing ${additionalFrames.length + 1} frames from a video at timestamps: ${frameTimestamps?.join(', ')}s
Compare these frames to detect:
- Position changes (elements moving left/right/up/down)
- Scale transformations (elements growing/shrinking)
- Rotation animations (objects spinning)
- Opacity transitions (fade in/out)
- New elements appearing/disappearing
- Color changes
- 3D camera movements (zoom, pan, orbit)

For each detected animation, specify:
- Which element is animating
- Start and end states
- Animation type (position, scale, rotation, opacity, etc.)
- Estimated duration and easing
` : "";
      
      const videoInstructions = isVideo ? `
      
SPECIAL INSTRUCTIONS FOR VIDEO ANALYSIS:
- This is a frame from a VIDEO, so analyze it as a complete interactive website/application
- Extract EVERY visible UI element (header, nav, buttons, cards, sections, footer, etc.)
- Look for animation indicators (hover states, transitions, moving elements)
- Identify ALL interactive elements (buttons, links, forms, sliders, etc.)
- Break down the layout into detailed sections and subsections
- Provide exact measurements for spacing, padding, margins
- Describe the visual hierarchy and information architecture
${multiFrameInfo}
` : "";
      
      // Use Kimi K2.5 directly with vision support
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout - faster failure
      
      const response = await fetch(NVIDIA_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NVIDIA_API_KEY}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "moonshotai/kimi-k2.5",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `You are an expert web developer. Analyze this ${analysisType} and return ONLY valid JSON.${videoInstructions}

CRITICAL: Your response must be ONLY JSON, no other text before or after!

{
  "analysisData": {
    "layout": "detailed description with exact measurements and spacing",
    "typography": ["font 1 with size and weight", "font 2 with size and weight", "font 3 with size and weight"],
    "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
    "has3D": true,
    "animationComplexity": "medium"
  },
  "componentTree": [
    {
      "id": "header",
      "type": "section",
      "label": "Header",
      "detectedTech": "React",
      "confidence": 0.9,
      "props": {"height": "80px", "background": "#000"},
      "children": [
        {
          "id": "nav",
          "type": "nav",
          "label": "Navigation",
          "detectedTech": "React",
          "confidence": 0.9,
          "props": {},
          "children": []
        }
      ]
    },
    {
      "id": "hero",
      "type": "section", 
      "label": "Hero Section",
      "detectedTech": "React",
      "confidence": 0.9,
      "props": {"minHeight": "600px"},
      "children": []
    }
  ],
  "workflowSteps": [
    {
      "phase": "Design Analysis",
      "icon": "🎨",
      "steps": [
        "Extract color palette (#hex codes)",
        "Identify typography (fonts, sizes)",
        "Measure spacing and layout grid"
      ]
    },
    {
      "phase": "Component Breakdown",
      "icon": "🧩",
      "steps": [
        "Header with navigation",
        "Hero section with CTA",
        "Feature cards grid"
      ]
    },
    {
      "phase": "Implementation",
      "icon": "⚡",
      "steps": [
        "Setup React + TypeScript + Tailwind",
        "Build component hierarchy",
        "Add animations and interactions"
      ]
    }
  ],
  "mindMapDiagram": {
    "center": "IMPLEMENTATION PROMPT",
    "branches": [
      {
        "label": "Visual Analysis",
        "color": "#3B82F6",
        "nodes": [
          "Layout: Container with rounded corners, 12px radius",
          "Background: Pure black (#000000) viewport",
          "Centerpiece: 3D object with technical overlays"
        ]
      },
      {
        "label": "3D Specifications",
        "color": "#8B5CF6",
        "nodes": [
          "Geometry: High-poly sphere/cube with smooth normals",
          "Material: PBR with roughness 0.6, metalness 0.1",
          "Lighting: 3-point setup (ambient, directional, fill)"
        ]
      },
      {
        "label": "Typography",
        "color": "#EC4899",
        "nodes": [
          "Display values: Inter 28px weight 700 white",
          "Labels: Inter 10px weight 500 gray uppercase",
          "Technical data: Monospace 11px #888888"
        ]
      },
      {
        "label": "Interactions",
        "color": "#10B981",
        "nodes": [
          "3D scene: Mouse drag to rotate with damping",
          "HUD elements: Hover glow effect",
          "Video controls: Fade in on hover 300ms"
        ]
      },
      {
        "label": "Color Palette",
        "color": "#F59E0B",
        "nodes": [
          "Primary: #FF4500 (borders, accents)",
          "Background: #000000",
          "Text: #FFFFFF, #9E9E9E, #666666"
        ]
      }
    ]
  },
  "scrollAnimations": {
    "architecture": "Fixed Canvas Approach - 3D canvas fixed to viewport, HTML sections scroll over it",
    "triggers": [
      {
        "section": "Hero Section",
        "animation": "Basketball centered, slow auto-rotation",
        "code": "gsap.to(basketball.rotation, { y: Math.PI * 2, scrollTrigger: { trigger: '#hero', scrub: true } })"
      },
      {
        "section": "Feature Section",
        "animation": "Ball moves right, scales up 1.2x",
        "code": "gsap.to(basketball.position, { x: 2, z: 2, scale: 1.2, scrollTrigger: { trigger: '#feature1', scrub: 1 } })"
      }
    ],
    "gsapSetup": "npm install gsap\nimport { ScrollTrigger } from 'gsap/ScrollTrigger'\ngsap.registerPlugin(ScrollTrigger)",
    "notes": [
      "Canvas is position: fixed with z-index: -1",
      "HTML sections are 100vh height stacked vertically",
      "Use ScrollTrigger scrub: true for smooth scroll-linked animation",
      "3D object properties (position, rotation, scale) animate based on scroll progress"
    ]
  },
  "enhancedPrompt": "DETAILED IMPLEMENTATION GUIDE:\n\n## VISUAL ANALYSIS\n- Exact measurements\n- Precise colors\n- Font specifications\n\n## 3D SPECIFICATIONS (if detected)\n- Three.js geometry\n- Material properties\n- Lighting setup\n\n## COMPONENT BREAKDOWN\n- Every UI element\n- Props and styling\n\n## CODE EXAMPLES\n- Three.js setup\n- Material configs\n- Animation code"
}

3D VISUAL SIGNALS (check for these):
- Geometry: Spheres, cubes, cylinders, complex meshes, smooth normals
- Materials: Metallic surfaces, glass/transparency, roughness variation, subsurface scattering
- Lighting: Multiple light sources, shadows (hard/soft), ambient occlusion, rim lighting, HDR environment
- Depth: Perspective distortion, focal blur, atmospheric fog, Z-depth layering
- Reflections: Mirror reflections, environment maps, Fresnel effects, specular highlights
- Textures: Normal maps, bump maps, displacement, UV mapping patterns
- Motion: Rotation indicators, orbit controls, parallax, camera movement cues
- Post-FX: Bloom, chromatic aberration, vignette, color grading

EXTRACTION RULES:
1. Measure EXACT spacing (padding, margins, gaps) in px or rem
2. Extract ALL colors with hex codes and their usage context
3. Identify font families, sizes (px), weights (100-900), line-heights
4. For 3D: Specify geometry type, material properties (roughness 0-1, metalness 0-1), lighting setup
5. Component tree: Deep nesting (10-20+ components for complex UIs), include ALL props (dimensions, colors, positioning)
6. workflowSteps: 3-5 phases with specific technical steps
7. mindMapDiagram: 5-6 branches with 3-5 technical nodes each
8. ${isVideo ? 'scrollAnimations: Architecture + 3-5 triggers with GSAP code + setup notes' : ''}
9. enhancedPrompt: Detailed implementation guide with code examples

Return ONLY valid JSON starting with { and ending with }`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                  },
                },
                // Add additional frames if provided (for video analysis)
                ...(additionalFrames && additionalFrames.length > 0 
                  ? additionalFrames.map((frameBase64: string, index: number) => ({
                      type: "image_url" as const,
                      image_url: {
                        url: `data:image/jpeg;base64,${frameBase64}`,
                      },
                    }))
                  : []
                ),
              ],
            },
          ],
          max_tokens: 4000,
          temperature: 0.2,
          chat_template_kwargs: {
            thinking: true, // Enable Kimi's reasoning mode
          },
        }),
      });

      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Kimi vision API error:", response.status, errorText);
        console.error("Request details:", {
          model: "moonshotai/kimi-k2.5",
          max_tokens: 6000,
          imageSize: base64Image.length,
          additionalFrames: additionalFrames?.length || 0
        });
        return NextResponse.json(
          { error: `Analysis failed: ${response.status} - ${errorText}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log("Kimi vision analysis complete");
      
      let content = data.choices[0].message.content;
      
      // Clean up markdown formatting if present
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Extract JSON if wrapped in other text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        content = jsonMatch[0];
      }
      
      try {
        // Parse JSON response
        const parsed = JSON.parse(content);
        return NextResponse.json(parsed);
      } catch (parseError) {
        console.error("Failed to parse AI response:", content.substring(0, 500));
        // Return fallback data if parsing fails
        return NextResponse.json({
          analysisData: {
            layout: "Modern responsive layout with header, main content area, and footer",
            typography: ["Sans-serif primary font", "Monospace for code", "16px base size"],
            colors: ["#0F172A", "#3B82F6", "#F8FAFC", "#64748B", "#10B981"],
            has3D: content.toLowerCase().includes('sphere') || 
                   content.toLowerCase().includes('3d') ||
                   content.toLowerCase().includes('lighting') ||
                   content.toLowerCase().includes('depth'),
            animationComplexity: "medium"
          },
          componentTree: [
            {
              id: "root",
              type: "section",
              label: "Main Container",
              detectedTech: "React",
              confidence: 0.85,
              props: {},
              children: []
            }
          ],
          enhancedPrompt: content // Use the full response as the prompt if JSON parsing fails
        });
      }
    }

    return NextResponse.json(
      { error: "Invalid step parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export const maxDuration = 300; // Allow up to 5 minutes for API calls
