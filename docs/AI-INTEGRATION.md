# AI Vision Integration Guide

## Overview

DesignToCode uses AI vision models to analyze website screenshots and extract implementation details. This document explains how the AI integration works and how to set it up.

## Supported AI Providers

### 1. OpenAI GPT-4 Vision
- **Model**: `gpt-4-vision-preview` or `gpt-4o`
- **Best for**: Detailed component analysis, accurate color extraction
- **Cost**: ~$0.01-0.03 per image
- **API**: https://platform.openai.com/docs/guides/vision

### 2. Anthropic Claude 3.5 Sonnet
- **Model**: `claude-3-5-sonnet-20241022`
- **Best for**: Complex layouts, design pattern recognition
- **Cost**: ~$0.015-0.025 per image
- **API**: https://docs.anthropic.com/claude/docs/vision

### 3. Google Gemini 1.5 Pro
- **Model**: `gemini-1.5-pro`
- **Best for**: Fast analysis, free tier available
- **Cost**: Free tier, then ~$0.01 per image
- **API**: https://ai.google.dev/docs

## How It Works

### Analysis Flow

```
1. User uploads screenshot
   ↓
2. Image converted to base64
   ↓
3. Sent to AI provider with structured prompt
   ↓
4. AI analyzes image and returns JSON
   ↓
5. JSON parsed into AnalysisData + ComponentTree
   ↓
6. Results displayed in UI
   ↓
7. Prompt generated from analysis
```

### AI Prompt Structure

The AI is given a detailed prompt that asks it to extract:

1. **Layout Structure**
   - Overall layout type (grid, flexbox, etc.)
   - Section identification (header, hero, content, footer)
   - Responsive design patterns

2. **Typography**
   - Font families (or similar web-safe alternatives)
   - Font sizes for all heading levels
   - Font weights and styles

3. **Color Palette**
   - All primary colors as hex codes
   - Background, text, and accent colors
   - Color usage patterns

4. **3D Elements**
   - Detection of WebGL/Three.js content
   - Boolean flag

5. **Animation Complexity**
   - Assessment: low, medium, or high
   - Based on scroll effects, transitions, micro-interactions

6. **Component Tree**
   - Hierarchical breakdown of UI components
   - Each component includes:
     - Unique ID
     - Type (section/component/element)
     - Descriptive label
     - Detected technology
     - Confidence score (0-1)
     - Key properties
     - Child components

7. **Detected Technologies**
   - Frameworks/libraries identified
   - Examples: React, Vue, Three.js, GSAP, Tailwind

8. **Design Patterns**
   - Common UI patterns identified
   - Examples: hero section, card grid, sidebar navigation

### Response Format

The AI returns a JSON object:

```json
{
  "layout": "Modern grid-based layout with hero section...",
  "typography": [
    "Primary: Inter (headings, 600-700 weight)",
    "Secondary: Inter (body text, 400 weight)"
  ],
  "colors": ["#0F172A", "#3B82F6", "#F8FAFC"],
  "has3D": false,
  "animationComplexity": "medium",
  "componentTree": [
    {
      "id": "hero",
      "type": "section",
      "label": "Hero Section",
      "detectedTech": "React",
      "confidence": 0.92,
      "props": {
        "background": "gradient",
        "height": "100vh"
      },
      "children": [...]
    }
  ],
  "detectedTechnologies": ["React", "Tailwind CSS", "Framer Motion"],
  "designPatterns": ["Hero Section", "Card Grid", "Sticky Navigation"]
}
```

## Setup Instructions

### Step 1: Get API Key

Choose your preferred AI provider and get an API key:

**OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

**Anthropic:**
1. Go to https://console.anthropic.com/settings/keys
2. Sign up or log in
3. Click "Create Key"
4. Copy the key

**Google Gemini:**
1. Go to https://makersuite.google.com/app/apikey
2. Sign up or log in
3. Click "Create API Key"
4. Copy the key

### Step 2: Configure in App

1. Navigate to **Settings** page in DesignToCode
2. Select your AI provider from dropdown
3. Paste your API key
4. Click "Save Settings"

Your API key is stored in browser localStorage and never sent to our servers.

### Step 3: Analyze Designs

1. Go to **New Analysis** page
2. Enter project name
3. Upload screenshot(s)
4. Click "Analyze Design"
5. Wait for AI analysis (5-15 seconds)
6. View results and generated prompt

## Integration Code

### Basic Usage

```typescript
import { analyzeDesign } from "@/lib/ai-vision-analyzer";

// Get API key from settings
const apiKey = localStorage.getItem("ai_api_key");
const provider = localStorage.getItem("ai_provider") as "openai" | "claude" | "gemini";

// Analyze image
const { analysisData, componentTree } = await analyzeDesign(
  imageFile,
  provider,
  apiKey
);

// Use results
console.log(analysisData.colors); // ["#0F172A", "#3B82F6", ...]
console.log(componentTree); // [{ id: "hero", type: "section", ... }]
```

### Batch Analysis

```typescript
import { analyzeBatch } from "@/lib/ai-vision-analyzer";

const results = await analyzeBatch(
  files,
  provider,
  apiKey,
  (current, total) => {
    console.log(`Analyzing ${current}/${total}`);
  }
);
```

### Error Handling

```typescript
try {
  const result = await analyzeDesign(file, provider, apiKey);
  // Success
} catch (error) {
  if (error.message.includes("401")) {
    // Invalid API key
    alert("Invalid API key. Please check your settings.");
  } else if (error.message.includes("429")) {
    // Rate limit
    alert("Rate limit exceeded. Please try again later.");
  } else {
    // Other error
    alert("Analysis failed. Please try again.");
  }
}
```

## Updating New Analysis Page

To integrate AI analysis into the New Analysis page:

```typescript
// In app/(dashboard)/new-analysis/page.tsx

const handleAnalyze = async () => {
  if (files.length === 0 || !projectName) return;

  setAnalysisState("analyzing");
  setCurrentStep(0);

  try {
    // Get API configuration
    const apiKey = localStorage.getItem("ai_api_key");
    const provider = localStorage.getItem("ai_provider") as "openai" | "claude" | "gemini";

    if (!apiKey) {
      alert("Please configure your AI API key in Settings");
      setAnalysisState("idle");
      return;
    }

    // Simulate progress
    setCurrentStep(1); // Uploading

    // Analyze with AI
    setCurrentStep(2); // Analyzing Visuals
    const { analysisData, componentTree } = await analyzeDesign(
      files[0],
      provider,
      apiKey
    );

    setCurrentStep(3); // Extracting Components
    setComponentNodes(componentTree);

    // Generate prompt
    setCurrentStep(4); // Generating Prompt
    const prompt = generateImplementationPrompt({
      projectName,
      analysisData,
      componentTree,
      threeDConfig: analysisData.has3D ? threeDConfig : undefined,
    });
    setGeneratedPrompt(prompt);

    setAnalysisState("complete");
  } catch (error) {
    console.error("Analysis error:", error);
    alert("Analysis failed. Please check your API key and try again.");
    setAnalysisState("idle");
  }
};
```

## Cost Optimization

### Tips to Reduce Costs

1. **Image Compression**
   - Resize images to max 1920px width
   - Use JPEG with 80% quality
   - Reduces token usage

2. **Batch Processing**
   - Analyze multiple images in one session
   - Reuse analysis results

3. **Caching**
   - Store analysis results in localStorage
   - Avoid re-analyzing same images

4. **Provider Selection**
   - Use Gemini for free tier
   - Use OpenAI for best accuracy
   - Use Claude for complex layouts

### Example: Image Compression

```typescript
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 1920;
        const scale = Math.min(1, maxWidth / img.width);
        
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(
          (blob) => {
            resolve(new File([blob!], file.name, { type: "image/jpeg" }));
          },
          "image/jpeg",
          0.8
        );
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}
```

## Troubleshooting

### Common Issues

**1. "Invalid API Key" Error**
- Check that API key is correct
- Verify key has proper permissions
- Check billing is set up (OpenAI/Anthropic)

**2. "Rate Limit Exceeded"**
- Wait a few minutes
- Upgrade to paid tier
- Switch to different provider

**3. "Invalid JSON Response"**
- AI sometimes returns malformed JSON
- Implement retry logic
- Add JSON validation

**4. "Analysis Takes Too Long"**
- Normal: 5-15 seconds
- Check internet connection
- Try different provider
- Compress images

**5. "Inaccurate Results"**
- Try different AI provider
- Use higher quality images
- Adjust prompt for specific needs
- Manually correct results

### Debug Mode

Enable debug logging:

```typescript
// In ai-vision-analyzer.ts
const DEBUG = true;

if (DEBUG) {
  console.log("Sending to AI:", {
    provider,
    imageSize: imageFile.size,
    imageType: imageFile.type,
  });
  console.log("AI Response:", content);
}
```

## Best Practices

### Image Quality
- Use high-resolution screenshots (1920x1080+)
- Ensure text is readable
- Capture full page or clear sections
- Avoid blurry or compressed images

### Prompt Engineering
- Be specific about what to extract
- Request structured JSON format
- Include examples in prompt
- Set low temperature (0.1-0.3) for consistency

### Error Handling
- Always wrap API calls in try-catch
- Provide user-friendly error messages
- Implement retry logic for transient errors
- Fall back to mock data if needed

### Security
- Never expose API keys in client code
- Store keys in localStorage only
- Validate all AI responses
- Sanitize user inputs

## Future Enhancements

### Planned Features
- [ ] Multi-image analysis (compare designs)
- [ ] Video frame analysis integration
- [ ] Real-time preview during analysis
- [ ] Custom prompt templates
- [ ] Analysis history and comparison
- [ ] Confidence score visualization
- [ ] Manual correction interface
- [ ] Export analysis as JSON
- [ ] API rate limit monitoring
- [ ] Cost tracking dashboard

### Advanced Features
- [ ] Fine-tuned models for specific design systems
- [ ] Component library matching
- [ ] Accessibility analysis
- [ ] Performance prediction
- [ ] Responsive breakpoint detection
- [ ] Animation timeline extraction
- [ ] Asset extraction (icons, images)
- [ ] Code generation from analysis

## Resources

- [OpenAI Vision API Docs](https://platform.openai.com/docs/guides/vision)
- [Claude Vision API Docs](https://docs.anthropic.com/claude/docs/vision)
- [Gemini Vision API Docs](https://ai.google.dev/docs)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [Vision Model Comparison](https://artificialanalysis.ai/models)

## Support

For issues or questions:
1. Check this documentation
2. Review error messages
3. Test with different providers
4. Check API provider status pages
5. Open GitHub issue with details
