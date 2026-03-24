/**
 * Hybrid Analysis Approach
 * 
 * Step 1: Use vision model for image analysis (OpenAI/Claude/Gemini)
 * Step 2: Use Kimi K2.5 for deep analysis and prompt generation
 * 
 * This leverages Kimi's strengths:
 * - 2.5M token context window
 * - Superior reasoning capabilities
 * - Excellent at generating detailed documentation
 */

import { AnalysisData } from "@/components/analysis-results";
import { ComponentNode } from "@/types/component-tree";

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const KIMI_API_KEY = "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";

/**
 * Step 1: Quick vision analysis (using any vision model)
 * This extracts basic visual information from the screenshot
 */
async function quickVisionAnalysis(imageFile: File, visionApiKey: string): Promise<string> {
  const base64Image = await fileToBase64(imageFile);

  // Using OpenAI GPT-4 Vision for quick extraction
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${visionApiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this website screenshot. Describe in detail:
1. Layout structure and sections
2. All UI components you see
3. Typography (fonts, sizes)
4. Color palette (hex codes)
5. Any 3D elements or animations
6. Interactive elements
7. Design patterns used

Be extremely detailed and technical.`,
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
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Step 2: Deep analysis with Kimi K2.5
 * This is where Kimi's superior reasoning shines!
 */
async function deepAnalysisWithKimi(
  visionDescription: string,
  projectName: string
): Promise<{
  analysisData: AnalysisData;
  componentTree: ComponentNode[];
  enhancedPrompt: string;
}> {
  const prompt = `You are an expert web developer and architect. Based on this detailed visual description of a website, perform a comprehensive technical analysis.

PROJECT: ${projectName}

VISUAL DESCRIPTION:
${visionDescription}

YOUR TASK:
Analyze this design and provide a complete technical breakdown. Think deeply about:
1. The optimal component architecture
2. Best technology choices
3. Implementation strategy
4. Performance considerations
5. Accessibility requirements

Return your analysis in this EXACT JSON format:
{
  "analysisData": {
    "layout": "detailed layout description",
    "typography": ["font 1 details", "font 2 details"],
    "colors": ["#hex1", "#hex2", "#hex3"],
    "has3D": boolean,
    "animationComplexity": "low|medium|high"
  },
  "componentTree": [
    {
      "id": "unique-id",
      "type": "section|component|element",
      "label": "Component Name",
      "detectedTech": "Technology",
      "confidence": 0.95,
      "props": {
        "key": "value"
      },
      "children": []
    }
  ],
  "enhancedPrompt": "A comprehensive, detailed implementation guide with step-by-step instructions, code examples, best practices, and optimization tips. Make this extremely detailed and actionable."
}

IMPORTANT: 
- Be thorough and detailed
- Include specific technical recommendations
- Provide actionable implementation steps
- Consider edge cases and best practices
- Make the enhancedPrompt production-ready`;

  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${KIMI_API_KEY}`,
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
        max_tokens: 16384, // Kimi can handle this!
        temperature: 0.7,
        top_p: 1.0,
        stream: false,
        chat_template_kwargs: {
          thinking: true, // Enable Kimi's thinking mode for better reasoning
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Kimi API error: ${response.statusText} - ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Parse JSON response
    const parsed = JSON.parse(content);

    return {
      analysisData: parsed.analysisData,
      componentTree: parsed.componentTree,
      enhancedPrompt: parsed.enhancedPrompt,
    };
  } catch (error) {
    console.error("Kimi analysis error:", error);
    throw error;
  }
}

/**
 * Main hybrid analysis function
 * Combines vision model + Kimi K2.5 for best results
 */
export async function analyzeDesignHybrid(
  imageFile: File,
  projectName: string,
  visionApiKey: string
): Promise<{
  analysisData: AnalysisData;
  componentTree: ComponentNode[];
  enhancedPrompt: string;
}> {
  try {
    // Step 1: Quick vision analysis
    console.log("Step 1: Extracting visual information...");
    const visionDescription = await quickVisionAnalysis(imageFile, visionApiKey);

    // Step 2: Deep analysis with Kimi
    console.log("Step 2: Deep analysis with Kimi K2.5...");
    const result = await deepAnalysisWithKimi(visionDescription, projectName);

    return result;
  } catch (error) {
    console.error("Hybrid analysis error:", error);
    throw error;
  }
}

/**
 * Alternative: Use Kimi for prompt enhancement only
 * (If you already have analysis data from another source)
 */
export async function enhancePromptWithKimi(
  analysisData: AnalysisData,
  componentTree: ComponentNode[],
  projectName: string
): Promise<string> {
  const prompt = `You are an expert web developer. Create an extremely detailed, production-ready implementation guide.

PROJECT: ${projectName}

ANALYSIS DATA:
${JSON.stringify(analysisData, null, 2)}

COMPONENT TREE:
${JSON.stringify(componentTree, null, 2)}

CREATE A COMPREHENSIVE IMPLEMENTATION GUIDE:

Include:
1. **Project Setup**
   - Exact commands to run
   - Dependencies to install
   - Configuration files needed

2. **Architecture Overview**
   - Folder structure
   - Component hierarchy
   - State management approach

3. **Component Implementation**
   - Detailed breakdown of each component
   - Props and state management
   - Styling approach
   - Code examples

4. **Styling System**
   - CSS variables for colors
   - Typography scale
   - Spacing system
   - Responsive breakpoints

5. **Animations & Interactions**
   - Animation library recommendations
   - Specific animation implementations
   - Scroll effects
   - Hover states

6. **Performance Optimization**
   - Image optimization
   - Code splitting
   - Lazy loading
   - Bundle size optimization

7. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support
   - Color contrast

8. **Testing Strategy**
   - Unit tests
   - Integration tests
   - E2E tests

9. **Deployment**
   - Build process
   - Environment variables
   - Hosting recommendations

Make this guide so detailed that a developer can implement it without any questions.`;

  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${KIMI_API_KEY}`,
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
        chat_template_kwargs: {
          thinking: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Kimi API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Kimi enhancement error:", error);
    throw error;
  }
}

/**
 * Streaming version for real-time prompt generation
 */
export async function enhancePromptWithKimiStreaming(
  analysisData: AnalysisData,
  componentTree: ComponentNode[],
  projectName: string,
  onChunk: (chunk: string) => void
): Promise<void> {
  const prompt = `Create a comprehensive implementation guide for: ${projectName}

Analysis: ${JSON.stringify(analysisData)}
Components: ${JSON.stringify(componentTree)}

Provide detailed, step-by-step implementation instructions.`;

  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${KIMI_API_KEY}`,
        "Accept": "text/event-stream",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "moonshotai/kimi-k2.5",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 16384,
        temperature: 0.7,
        stream: true,
        chat_template_kwargs: { thinking: true },
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error("No response body");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) onChunk(content);
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  } catch (error) {
    console.error("Kimi streaming error:", error);
    throw error;
  }
}

// Helper function
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
