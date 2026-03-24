/**
 * NVIDIA API Integration for Design Analysis
 * Using Kimi K2.5 model via NVIDIA's API
 * 
 * Note: This model is text-only, so we'll use it for:
 * - Generating implementation prompts from descriptions
 * - Analyzing component structures
 * - Suggesting tech stacks
 * - Creating detailed documentation
 */

import { AnalysisData } from "@/components/analysis-results";
import { ComponentNode } from "@/types/component-tree";

const NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const NVIDIA_API_KEY = "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";

interface NVIDIAMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * Enhance analysis data with AI-generated insights
 */
export async function enhanceAnalysisWithAI(
  analysisData: AnalysisData,
  componentTree: ComponentNode[]
): Promise<{
  enhancedPrompt: string;
  suggestions: string[];
  optimizations: string[];
}> {
  const prompt = `You are an expert web developer. Based on this design analysis, provide:

1. Enhanced implementation suggestions
2. Performance optimizations
3. Best practices recommendations

Analysis Data:
- Layout: ${analysisData.layout}
- Typography: ${analysisData.typography.join(", ")}
- Colors: ${analysisData.colors.join(", ")}
- Has 3D: ${analysisData.has3D}
- Animation Complexity: ${analysisData.animationComplexity}

Component Tree:
${JSON.stringify(componentTree, null, 2)}

Provide your response in JSON format:
{
  "enhancedPrompt": "detailed implementation guide",
  "suggestions": ["suggestion 1", "suggestion 2"],
  "optimizations": ["optimization 1", "optimization 2"]
}`;

  try {
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
    const content = data.choices[0].message.content;

    // Try to parse JSON response
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch {
      // If not JSON, return as enhanced prompt
      return {
        enhancedPrompt: content,
        suggestions: [],
        optimizations: [],
      };
    }
  } catch (error) {
    console.error("NVIDIA API error:", error);
    throw error;
  }
}

/**
 * Generate component implementation code
 */
export async function generateComponentCode(
  component: ComponentNode,
  framework: "react" | "vue" | "svelte" = "react"
): Promise<string> {
  const prompt = `Generate ${framework} component code for this component:

Component Details:
- Name: ${component.label}
- Type: ${component.type}
- Technology: ${component.detectedTech || "React"}
- Props: ${JSON.stringify(component.props, null, 2)}

Requirements:
1. Use TypeScript
2. Include proper types
3. Add comments
4. Follow best practices
5. Make it production-ready

Return only the code, no explanations.`;

  try {
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
            content: prompt,
          },
        ],
        max_tokens: 8192,
        temperature: 0.3,
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
    console.error("NVIDIA API error:", error);
    throw error;
  }
}

/**
 * Analyze design description and suggest tech stack
 */
export async function analyzeTechStack(
  description: string
): Promise<{
  recommended: string[];
  reasoning: string;
  alternatives: string[];
}> {
  const prompt = `Based on this design description, recommend the best tech stack:

Description: ${description}

Consider:
1. Performance requirements
2. Complexity level
3. Maintainability
4. Developer experience
5. Community support

Provide response in JSON:
{
  "recommended": ["tech1", "tech2"],
  "reasoning": "why these technologies",
  "alternatives": ["alt1", "alt2"]
}`;

  try {
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
            content: prompt,
          },
        ],
        max_tokens: 4096,
        temperature: 0.5,
        top_p: 1.0,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`NVIDIA API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return JSON.parse(content);
  } catch (error) {
    console.error("NVIDIA API error:", error);
    throw error;
  }
}

/**
 * Generate accessibility recommendations
 */
export async function generateAccessibilityReport(
  componentTree: ComponentNode[]
): Promise<{
  issues: string[];
  recommendations: string[];
  wcagLevel: "A" | "AA" | "AAA";
}> {
  const prompt = `Analyze this component tree for accessibility issues:

${JSON.stringify(componentTree, null, 2)}

Provide:
1. Potential accessibility issues
2. WCAG 2.1 recommendations
3. Estimated WCAG compliance level

Return JSON:
{
  "issues": ["issue 1", "issue 2"],
  "recommendations": ["rec 1", "rec 2"],
  "wcagLevel": "A" | "AA" | "AAA"
}`;

  try {
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
            content: prompt,
          },
        ],
        max_tokens: 4096,
        temperature: 0.3,
        top_p: 1.0,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`NVIDIA API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    return JSON.parse(content);
  } catch (error) {
    console.error("NVIDIA API error:", error);
    throw error;
  }
}

/**
 * Streaming response for real-time prompt generation
 */
export async function generatePromptStreaming(
  analysisData: AnalysisData,
  componentTree: ComponentNode[],
  onChunk: (chunk: string) => void
): Promise<void> {
  const prompt = `Generate a comprehensive implementation prompt for this design:

Analysis:
${JSON.stringify(analysisData, null, 2)}

Components:
${JSON.stringify(componentTree, null, 2)}

Create a detailed, step-by-step implementation guide with:
1. Tech stack recommendations
2. Component breakdown
3. Styling approach
4. Animation implementation
5. Performance optimization
6. Accessibility considerations`;

  try {
    const response = await fetch(NVIDIA_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${NVIDIA_API_KEY}`,
        "Accept": "text/event-stream",
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
        stream: true,
        chat_template_kwargs: {
          thinking: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`NVIDIA API error: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No response body");
    }

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
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  } catch (error) {
    console.error("NVIDIA streaming error:", error);
    throw error;
  }
}
