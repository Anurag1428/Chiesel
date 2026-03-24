/**
 * NVIDIA Vision API Integration
 * 
 * Note: The Kimi K2.5 model doesn't support vision.
 * This uses NVIDIA's vision-capable models instead.
 */

import { AnalysisData } from "@/components/analysis-results";
import { ComponentNode } from "@/types/component-tree";

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";

/**
 * Analyze design using NVIDIA's vision models
 * 
 * Available vision models on NVIDIA:
 * - meta/llama-3.2-90b-vision-instruct
 * - microsoft/phi-3-vision-128k-instruct
 * - google/paligemma
 */
export async function analyzeDesignWithNVIDIA(
  imageFile: File,
  apiKey: string
): Promise<{
  analysisData: AnalysisData;
  componentTree: ComponentNode[];
}> {
  // Convert image to base64
  const base64Image = await fileToBase64(imageFile);

  const prompt = `You are an expert web developer. Analyze this website screenshot and extract:

1. LAYOUT: Describe the structure (grid, flexbox, sections)
2. TYPOGRAPHY: Font families, sizes, weights
3. COLORS: Extract hex codes for all colors
4. 3D ELEMENTS: Detect WebGL/Three.js (true/false)
5. ANIMATION: Complexity level (low/medium/high)
6. COMPONENTS: Break down into hierarchical structure

Return ONLY valid JSON:
{
  "layout": "description",
  "typography": ["font details"],
  "colors": ["#hex1", "#hex2"],
  "has3D": boolean,
  "animationComplexity": "low|medium|high",
  "componentTree": [
    {
      "id": "unique-id",
      "type": "section|component|element",
      "label": "Component Name",
      "detectedTech": "React|Three.js|etc",
      "confidence": 0.9,
      "props": {},
      "children": []
    }
  ]
}`;

  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta/llama-3.2-90b-vision-instruct", // Vision-capable model
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
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
        max_tokens: 4096,
        temperature: 0.2,
        top_p: 1.0,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`NVIDIA API error: ${response.statusText} - ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse JSON response
    const parsed = JSON.parse(content);

    return {
      analysisData: {
        layout: parsed.layout,
        typography: parsed.typography,
        colors: parsed.colors,
        has3D: parsed.has3D,
        animationComplexity: parsed.animationComplexity,
      },
      componentTree: parsed.componentTree,
    };
  } catch (error) {
    console.error("NVIDIA Vision API error:", error);
    throw error;
  }
}

/**
 * Helper: Convert File to base64
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Use Kimi K2.5 for text enhancement (after vision analysis)
 */
export async function enhanceWithKimi(
  analysisData: AnalysisData,
  componentTree: ComponentNode[],
  apiKey: string
): Promise<string> {
  const prompt = `Based on this design analysis, create a comprehensive implementation guide:

Analysis:
- Layout: ${analysisData.layout}
- Typography: ${analysisData.typography.join(", ")}
- Colors: ${analysisData.colors.join(", ")}
- 3D Elements: ${analysisData.has3D}
- Animation: ${analysisData.animationComplexity}

Components:
${JSON.stringify(componentTree, null, 2)}

Generate a detailed implementation prompt with:
1. Tech stack recommendations
2. Step-by-step component breakdown
3. Styling approach
4. Animation implementation
5. Performance optimization tips`;

  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "moonshotai/kimi-k2.5",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 16384,
        temperature: 0.7,
        top_p: 1.0,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`NVIDIA API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Kimi enhancement error:", error);
    throw error;
  }
}
