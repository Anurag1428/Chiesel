/**
 * AI Vision Analysis Integration
 * 
 * This module handles the integration with AI vision models (OpenAI GPT-4 Vision, Claude 3.5 Sonnet, etc.)
 * to analyze design screenshots and extract implementation details.
 */

import { AnalysisData } from "@/components/analysis-results";
import { ComponentNode } from "@/types/component-tree";

// Types for AI responses
interface AIAnalysisResponse {
  layout: string;
  typography: string[];
  colors: string[];
  has3D: boolean;
  animationComplexity: "low" | "medium" | "high";
  componentTree: ComponentNode[];
  detectedTechnologies: string[];
  designPatterns: string[];
}

/**
 * Analyzes an image using OpenAI GPT-4 Vision API
 */
export async function analyzeWithOpenAI(
  imageFile: File,
  apiKey: string
): Promise<AIAnalysisResponse> {
  // Convert image to base64
  const base64Image = await fileToBase64(imageFile);

  const prompt = `You are an expert web developer and designer. Analyze this website screenshot and provide a detailed technical analysis in JSON format.

Extract the following information:

1. LAYOUT STRUCTURE:
   - Describe the overall layout (grid, flexbox, sections)
   - Identify header, navigation, hero, content areas, footer
   - Note responsive design patterns

2. TYPOGRAPHY:
   - Identify font families (or suggest similar web-safe fonts)
   - List font sizes for headings (h1-h6) and body text
   - Note font weights and styles

3. COLOR PALETTE:
   - Extract all primary colors as hex codes
   - Identify background, text, accent colors
   - Note color usage patterns

4. 3D ELEMENTS:
   - Detect if there are any 3D graphics, WebGL, or Three.js elements
   - Return true/false

5. ANIMATION COMPLEXITY:
   - Assess animation complexity: "low", "medium", or "high"
   - Consider scroll effects, transitions, micro-interactions

6. COMPONENT TREE:
   - Break down the UI into a hierarchical component structure
   - For each component, provide:
     * id: unique identifier
     * type: "section", "component", or "element"
     * label: descriptive name
     * detectedTech: technology used (React, Three.js, GSAP, etc.)
     * confidence: 0-1 score
     * props: key properties
     * children: nested components

7. DETECTED TECHNOLOGIES:
   - List frameworks/libraries that appear to be used
   - Examples: React, Vue, Three.js, GSAP, Framer Motion, Tailwind CSS

8. DESIGN PATTERNS:
   - Identify common UI patterns (hero section, card grid, etc.)

Return ONLY valid JSON in this exact format:
{
  "layout": "string description",
  "typography": ["font 1", "font 2"],
  "colors": ["#hex1", "#hex2"],
  "has3D": boolean,
  "animationComplexity": "low" | "medium" | "high",
  "componentTree": [...],
  "detectedTechnologies": [...],
  "designPatterns": [...]
}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview", // or "gpt-4o" for newer model
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
                  detail: "high", // Use "high" for detailed analysis
                },
              },
            ],
          },
        ],
        max_tokens: 4096,
        temperature: 0.2, // Lower temperature for more consistent results
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse JSON response
    const analysis: AIAnalysisResponse = JSON.parse(content);

    return analysis;
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw error;
  }
}

/**
 * Analyzes an image using Anthropic Claude 3.5 Sonnet
 */
export async function analyzeWithClaude(
  imageFile: File,
  apiKey: string
): Promise<AIAnalysisResponse> {
  const base64Image = await fileToBase64(imageFile);
  const mediaType = imageFile.type as "image/jpeg" | "image/png" | "image/webp";

  const prompt = `Analyze this website screenshot and provide detailed technical analysis in JSON format.

Extract: layout structure, typography (fonts, sizes, weights), color palette (hex codes), 3D elements detection, animation complexity (low/medium/high), component hierarchy, detected technologies, and design patterns.

Return ONLY valid JSON with this structure:
{
  "layout": "description",
  "typography": ["font details"],
  "colors": ["#hex codes"],
  "has3D": boolean,
  "animationComplexity": "low|medium|high",
  "componentTree": [{"id": "", "type": "", "label": "", "detectedTech": "", "confidence": 0.9, "props": {}, "children": []}],
  "detectedTechnologies": ["tech names"],
  "designPatterns": ["pattern names"]
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: base64Image,
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Parse JSON response
    const analysis: AIAnalysisResponse = JSON.parse(content);

    return analysis;
  } catch (error) {
    console.error("Claude analysis error:", error);
    throw error;
  }
}

/**
 * Analyzes an image using Google Gemini Vision
 */
export async function analyzeWithGemini(
  imageFile: File,
  apiKey: string
): Promise<AIAnalysisResponse> {
  const base64Image = await fileToBase64(imageFile);

  const prompt = `Analyze this website screenshot and provide detailed technical analysis in JSON format.

Extract: layout structure, typography, colors (hex codes), 3D elements, animation complexity, component tree, technologies, and design patterns.

Return ONLY valid JSON matching this structure:
{
  "layout": "string",
  "typography": ["array"],
  "colors": ["#hex"],
  "has3D": boolean,
  "animationComplexity": "low|medium|high",
  "componentTree": [{"id": "", "type": "", "label": "", "detectedTech": "", "confidence": 0.9, "props": {}, "children": []}],
  "detectedTechnologies": ["array"],
  "designPatterns": ["array"]
}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
                {
                  inline_data: {
                    mime_type: imageFile.type,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;

    // Parse JSON response
    const analysis: AIAnalysisResponse = JSON.parse(content);

    return analysis;
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw error;
  }
}

/**
 * Main analysis function that uses the configured AI provider
 */
export async function analyzeDesign(
  imageFile: File,
  provider: "openai" | "claude" | "gemini" = "openai",
  apiKey: string
): Promise<{
  analysisData: AnalysisData;
  componentTree: ComponentNode[];
}> {
  let analysis: AIAnalysisResponse;

  switch (provider) {
    case "openai":
      analysis = await analyzeWithOpenAI(imageFile, apiKey);
      break;
    case "claude":
      analysis = await analyzeWithClaude(imageFile, apiKey);
      break;
    case "gemini":
      analysis = await analyzeWithGemini(imageFile, apiKey);
      break;
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }

  // Transform AI response to our internal format
  const analysisData: AnalysisData = {
    layout: analysis.layout,
    typography: analysis.typography,
    colors: analysis.colors,
    has3D: analysis.has3D,
    animationComplexity: analysis.animationComplexity,
  };

  return {
    analysisData,
    componentTree: analysis.componentTree,
  };
}

/**
 * Helper function to convert File to base64
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
 * Batch analysis for multiple images
 */
export async function analyzeBatch(
  files: File[],
  provider: "openai" | "claude" | "gemini",
  apiKey: string,
  onProgress?: (current: number, total: number) => void
): Promise<Array<{ analysisData: AnalysisData; componentTree: ComponentNode[] }>> {
  const results = [];

  for (let i = 0; i < files.length; i++) {
    const result = await analyzeDesign(files[i], provider, apiKey);
    results.push(result);

    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }

  return results;
}
