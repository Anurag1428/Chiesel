# API Timeout Issue - Design to Code Analysis

## Problem Summary

The NVIDIA API (Kimi K2.5 vision model) is consistently timing out when analyzing design screenshots, making the application unusable.

## Current Behavior

- **Request Duration**: 2.5 - 5+ minutes per analysis
- **Failure Rate**: ~100% (all requests timeout or connection reset)
- **Error Types**:
  - `HeadersTimeoutError` (connection timeout waiting for response)
  - `ECONNRESET` (connection dropped mid-request)
  - `AbortError` (manual timeout after waiting too long)

## Technical Details

### API Configuration
- **Model**: `moonshotai/kimi-k2.5`
- **Endpoint**: `https://integrate.api.nvidia.com/v1/chat/completions`
- **max_tokens**: Tested 4000, 4500, 5000, 6000, 8000, 10000
- **Timeout**: Tested 60s, 120s, 180s, 300s

### Request Payload
- Base64 encoded image (screenshot or video frame)
- Detailed prompt (~2000 tokens) with:
  - JSON schema for structured output
  - 3D visual signal detection rules
  - Component extraction guidelines
  - Typography, color, layout analysis instructions

### Expected Output
```json
{
  "analysisData": { layout, typography, colors, has3D, animationComplexity },
  "componentTree": [ /* nested component hierarchy */ ],
  "workflowSteps": [ /* implementation phases */ ],
  "mindMapDiagram": { /* visual breakdown */ },
  "scrollAnimations": { /* GSAP code examples */ },
  "enhancedPrompt": "/* detailed implementation guide */"
}
```

## Root Cause Analysis

1. **API Performance**: Kimi K2.5 vision model is too slow for this use case
2. **Prompt Complexity**: Detailed prompt + vision analysis + large JSON output = heavy processing
3. **Token Limit vs Speed**: Higher max_tokens = more complete output but longer processing time
4. **Network Stability**: Long-running requests are prone to connection drops

## Attempted Solutions

| Solution | Result |
|----------|--------|
| Increase timeout to 5 minutes | Still times out, just takes longer to fail |
| Reduce max_tokens to 4000 | Faster but incomplete JSON (cuts off mid-response) |
| Increase max_tokens to 8000+ | Complete JSON but always times out |
| Simplify prompt | Reduces quality, still times out |
| Add retry logic | Same timeout on retry |

## Current Compromise

**Settings**: `max_tokens: 4000`, `timeout: 120s`

**Result**: 
- ~65% accuracy when it works
- Incomplete JSON (missing workflowSteps, mindMapDiagram, scrollAnimations, enhancedPrompt)
- Still prone to timeouts

## Recommended Solutions

### Option 1: Switch AI Provider (Recommended)
Use a faster, more reliable vision model:

**OpenAI GPT-4 Vision**
- Pros: Fast (~5-15s), reliable, excellent vision understanding
- Cons: Requires OpenAI API key, costs per request
- Endpoint: `https://api.openai.com/v1/chat/completions`

**Anthropic Claude 3.5 Sonnet**
- Pros: Very fast (~3-10s), excellent at structured output, good vision
- Cons: Requires Anthropic API key, costs per request
- Endpoint: `https://api.anthropic.com/v1/messages`

**Google Gemini 1.5 Pro**
- Pros: Fast, good vision, generous free tier
- Cons: Requires Google API key
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent`

### Option 2: Streaming Response
Implement streaming to get partial results as they're generated:
- User sees progress in real-time
- Can use partial data even if connection drops
- Better UX during long waits

### Option 3: Two-Pass Analysis
Split into fast + detailed passes:
1. **Pass 1** (5-10s): Basic analysis (layout, colors, typography)
2. **Pass 2** (optional): Detailed analysis (component tree, animations, 3D)

### Option 4: Client-Side Pre-processing
- Compress/resize images before sending
- Extract basic info client-side (colors, dimensions)
- Send only what AI needs to analyze

## Impact

**Current State**:
- ❌ Application is unusable
- ❌ 100% failure rate on analysis
- ❌ Poor user experience (5 min wait → error)

**With Fix**:
- ✅ Fast analysis (5-15 seconds)
- ✅ Complete JSON output
- ✅ Reliable results
- ✅ Better user experience

## Next Steps

1. **Immediate**: Test with OpenAI GPT-4 Vision (fastest path to working solution)
2. **Short-term**: Implement error handling and fallbacks
3. **Long-term**: Add provider selection (let users choose AI model)

## Code Changes Required

### For OpenAI GPT-4 Vision:
```typescript
const response = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ]
      }
    ],
    max_tokens: 4096,
    temperature: 0.2
  })
});
```

### For Anthropic Claude:
```typescript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json"
  },
  body: JSON.stringify({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/jpeg", data: base64Image } },
          { type: "text", text: prompt }
        ]
      }
    ]
  })
});
```

## Questions for Discussion

1. Do we have budget for paid API providers (OpenAI/Anthropic)?
2. Is 65% accuracy acceptable if we stick with current solution?
3. Should we implement multiple provider support?
4. What's the priority: speed vs cost vs accuracy?
5. Can we accept incomplete JSON responses?

---

**Document Created**: 2026-04-07  
**Status**: Critical - Application Non-Functional  
**Priority**: P0 - Blocking Production Use
