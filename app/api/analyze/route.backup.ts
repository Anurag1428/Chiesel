import { NextRequest, NextResponse } from "next/server";

const NVIDIA_API_KEY = "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";
const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const { step, base64Image, projectName } = await request.json();

    if (step === "vision") {
      console.log("Starting complete analysis...");
      
      // Step 1: Use Llama Vision to see the image
      const visionResponse = await fetch(NVIDIA_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${NVIDIA_API_KEY}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta/llama-3.2-90b-vision-instruct",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Describe this website screenshot in extreme detail. Focus on:
1. Any 3D elements - spheres, cubes, realistic lighting, shadows, reflections, depth
2. Layout structure
3. All visible colors (provide hex codes)
4. Typography
5. UI components
6. Animations or interactive elements

Be very specific about 3D detection - look for dimensional depth, realistic lighting, specular highlights, material textures.`,
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
          max_tokens: 2000,
          temperature: 0.2,
        }),
      });

      if (!visionResponse.ok) {
        const errorText = await visionResponse.text();
        console.error("Vision API error:", errorText);
        return NextResponse.json(
          { error: `Analysis failed: ${errorText}` },
          { status: visionResponse.status }
        );
      }

      const visionData = await visionResponse.json();
      const visionDescription = visionData.choices[0].message.content;
      console.log("Vision description:", visionDescription);

      // Step 2: Use Kimi K2.5 to analyze the description and generate structured output
      const kimiResponse = await fetch(NVIDIA_API_URL, {
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
              content: `Based on this detailed description of a website screenshot, create a structured analysis.

DESCRIPTION:
${visionDescription}

Return ONLY valid JSON in this exact format:
{
  "analysisData": {
    "layout": "detailed layout description",
    "typography": ["font 1", "font 2", "font 3"],
    "colors": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
    "has3D": boolean,
    "animationComplexity": "low|medium|high"
  },
  "componentTree": [
    {
      "id": "unique-id",
      "type": "section",
      "label": "Component Name",
      "detectedTech": "Technology",
      "confidence": 0.9,
      "props": {},
      "children": []
    }
  ]
}

IMPORTANT for 3D detection:
- If description mentions: spheres, cubes, 3D shapes, realistic lighting, shadows, reflections, depth, dimensional, specular highlights, material textures, WebGL, Three.js, rendered objects → set has3D: true
- Otherwise set has3D: false

Return ONLY the JSON, no markdown.`,
            },
          ],
          max_tokens: 4000,
          temperature: 0.3,
        }),
      });

      if (!kimiResponse.ok) {
        const errorText = await kimiResponse.text();
        console.error("Kimi API error:", errorText);
        // Fallback to simple parsing if Kimi fails
        return NextResponse.json({
          analysisData: {
            layout: "Modern responsive layout",
            typography: ["Sans-serif primary font", "Monospace for code", "16px base size"],
            colors: ["#0F172A", "#3B82F6", "#F8FAFC", "#64748B", "#10B981"],
            has3D: visionDescription.toLowerCase().includes('3d') || 
                   visionDescription.toLowerCase().includes('sphere') ||
                   visionDescription.toLowerCase().includes('depth') ||
                   visionDescription.toLowerCase().includes('lighting'),
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

      const kimiData = await kimiResponse.json();
      console.log("Kimi analysis complete");
      
      let content = kimiData.choices[0].message.content;
      
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
