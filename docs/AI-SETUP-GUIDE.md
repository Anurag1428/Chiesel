# AI Analysis Setup Guide

## Overview

The DesignToCode app now uses **real AI analysis** instead of hardcoded mock data. It uses a hybrid approach combining vision models with Moonshot's Kimi K2.5 for comprehensive analysis.

## How It Works

### Two-Step AI Process

1. **Vision Analysis** (Step 1)
   - Uses OpenAI GPT-4 Vision, Claude 3.5 Sonnet, or Gemini 1.5 Pro
   - Extracts visual information from your screenshot
   - Identifies layout, colors, typography, components

2. **Deep Analysis with Kimi K2.5** (Step 2)
   - Takes the vision description
   - Performs deep reasoning and analysis
   - Generates comprehensive implementation guide
   - Creates component tree structure
   - Provides detailed technical recommendations

### Why This Approach?

- **Kimi K2.5 is text-only** - it cannot analyze images directly
- **Kimi excels at reasoning** - 2.5M token context, superior analysis
- **Best of both worlds** - vision model sees the design, Kimi thinks deeply about implementation

## Setup Instructions

### 1. Get an API Key

You need an API key from one of these providers:

**OpenAI (Recommended)**
- Go to: https://platform.openai.com/api-keys
- Create new API key
- Cost: ~$0.01-0.03 per analysis

**Anthropic Claude**
- Go to: https://console.anthropic.com/settings/keys
- Create new API key
- Cost: ~$0.015-0.025 per analysis

**Google Gemini**
- Go to: https://makersuite.google.com/app/apikey
- Create new API key
- Cost: Free tier available

### 2. Configure Settings

1. Navigate to **Settings** page in the app
2. Select your AI provider
3. Paste your API key
4. Click **Save Settings**

Your API key is stored locally in your browser (localStorage) and never sent to our servers.

### 3. Analyze a Design

1. Go to **New Analysis** page
2. Enter a project name
3. Upload a screenshot (PNG/JPG/WEBP)
4. Click **Analyze Design**

The AI will:
- Extract visual information
- Analyze the design deeply
- Generate component tree
- Create implementation prompt

## What Gets Analyzed

The AI extracts:

- **Layout Structure**: Grid systems, flexbox, sections
- **Typography**: Font families, sizes, weights, hierarchy
- **Color Palette**: Hex codes for all colors
- **Components**: Hierarchical breakdown of UI elements
- **3D Detection**: WebGL/Three.js elements
- **Animation Complexity**: Low/Medium/High
- **Tech Stack**: Recommended libraries and frameworks
- **Implementation Guide**: Step-by-step instructions

## API Costs

Typical costs per analysis:

- **OpenAI GPT-4 Vision**: $0.01-0.03
- **Claude 3.5 Sonnet**: $0.015-0.025
- **Gemini 1.5 Pro**: $0.01 (free tier available)
- **Kimi K2.5**: Included in NVIDIA API (hardcoded key)

## Troubleshooting

### "No API key found" Error

- Go to Settings and configure your API key
- Make sure you clicked "Save Settings"
- Refresh the page and try again

### Analysis Fails

- Check your API key is valid
- Ensure you have credits/billing enabled
- Try a different image format
- Check browser console for detailed errors

### Slow Analysis

- Vision analysis: 5-10 seconds
- Kimi deep analysis: 10-30 seconds
- Total: 15-40 seconds per screenshot
- This is normal for AI processing

## Privacy & Security

- API keys stored in browser localStorage only
- Never sent to our servers
- All AI requests go directly from your browser to the AI provider
- Images are sent only to the AI provider for analysis
- No data is stored on our servers

## Technical Details

### Files Involved

- `lib/hybrid-analyzer.ts` - Main hybrid analysis logic
- `lib/nvidia-vision-analyzer.ts` - NVIDIA vision models
- `lib/ai-vision-analyzer.ts` - OpenAI/Claude/Gemini integration
- `app/(dashboard)/new-analysis/page.tsx` - UI integration
- `app/(dashboard)/settings/page.tsx` - API key configuration

### API Endpoints

- OpenAI: `https://api.openai.com/v1/chat/completions`
- NVIDIA: `https://integrate.api.nvidia.com/v1/chat/completions`
- Kimi K2.5: Uses NVIDIA endpoint with model `moonshotai/kimi-k2.5`

### Models Used

- **Vision**: GPT-4o / Claude 3.5 Sonnet / Gemini 1.5 Pro
- **Analysis**: Kimi K2.5 (via NVIDIA API)
- **Thinking Mode**: Enabled for better reasoning

## Next Steps

After analysis, you can:

1. **Review Results**: See extracted colors, typography, layout
2. **Explore Component Tree**: Hierarchical breakdown
3. **Configure 3D**: If 3D elements detected
4. **Edit Prompt**: Customize the implementation guide
5. **Export**: Copy, open in Cursor/Bolt, download, or share

## Support

If you encounter issues:

1. Check browser console (F12) for errors
2. Verify API key is correct
3. Ensure billing is enabled on your AI provider account
4. Try a different image or provider
