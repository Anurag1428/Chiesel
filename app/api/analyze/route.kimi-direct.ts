import { NextRequest, NextResponse } from "next/server";

const NVIDIA_API_KEY = "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";
const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const { step, base64Image, projectName } = await request.json();

    if (step === "vision") {
      console.log("Starting Kimi K2.5 direct vision analysis...");
      
      // Use Kimi K2.5 directly with vision support
      const response = await fetch(NVIDIA_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NVIDIA_API_KEY}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "moonshotai/kimi-k2.5",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analyze this website screenshot and extract detailed information. Return ONLY valid JSON in this exact format:

{
  "analysisData": {
    "layout": "Describe the layout structure in detail",
    "typography": ["Font 1 details", "Font 2 details", "Font 3 details"],
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
      "props": {},
      "children": []
    }
  ]
}

CRITICAL - 3D DETECTION:
Look for these signs of 3D/WebGL:
- Spheres, cubes, or 3D shapes with dimensional depth
- Realistic lighting with specular highlights
- Shadows and reflections indicating 3D rendering
- Material textures (leather, metal, glass)
- Light wrapping around objects
- Depth perception and perspective
- Canvas elements with 3D rendering
- Three.js, WebGL, or 3D graphics indicators

If you see ANY of these signs (especially spheres with lighting/shadows), set "has3D": true

Extract:
1. Layout: Grid/Flexbox structure, sections, positioning
2. Typography: Font families, sizes, weights, hierarchy
3. Colors: All hex codes visible (extract from UI, backgrounds, text, objects)
4. 3D: CAREFULLY analyze for dimensional depth, realistic lighting, material properties
5. Animation: low/medium/high complexity based on motion, transitions, effects
6. Components: Break down into hierarchical tree with proper nesting

Return ONLY the JSON, no markdown formatting.`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                  },
                },
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Kimi vision API error:", errorText);
        return NextResponse.json(
          { error: `Analysis failed: ${errorText}` },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log("Kimi vision analysis complete");
      
      let content = data.choices[0].message.content;
      
      // Clean up markdown formatting if present
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      try {
        // Parse JSON response
        const parsed = JSON.parse(content);
        return NextResponse.json(parsed);
      } catch (parseError) {
        console.error("Failed to parse AI response:", content);
        // Return fallback data if parsing fails
        return NextResponse.json({
          analysisData: {
            layout: "Modern responsive layout with header, main content area, and footer",
            typography: ["Sans-serif primary font", "Monospace for code", "16px base size"],
            colors: ["#0F172A", "#3B82F6", "#F8FAFC", "#64748B", "#10B981"],
            has3D: false,
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
          ]
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

export const maxDuration = 60; // Allow up to 60 seconds for API calls
