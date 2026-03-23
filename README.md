# DesignToCode

A tool that analyzes website screenshots and generates implementation prompts.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide React (icons)
- React Dropzone (file uploads)
- Vercel AI SDK (streaming responses)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── (dashboard)/          # Dashboard layout group
│   ├── layout.tsx       # Sidebar layout
│   ├── page.tsx         # Dashboard home
│   ├── new-analysis/    # New analysis page
│   ├── prompt-library/  # Prompt library page
│   └── settings/        # Settings page
├── layout.tsx           # Root layout
└── globals.css          # Global styles

components/
└── sidebar.tsx          # Sidebar navigation
```

## Theme

The app uses a dark theme with slate-950 as the base color. The theme is configured in `app/globals.css` and applied via the `dark` class on the `<html>` element.

## Features

### Prompt Generation Engine

Automatically generates comprehensive implementation prompts from design analysis:

**Prompt Sections:**
1. Master Implementation Prompt (header with project info)
2. General Rules (pixel perfection, responsive design, accessibility)
3. Tech Stack Detection (recommended libraries based on visual cues)
4. Component Breakdown (recursive tree structure with all details)
5. Design System (CSS variables for colors, typography scale)
6. Interactions & Animations (scroll triggers, hover states, complexity-based recommendations)
7. Performance Requirements (Lighthouse targets, optimization strategies)

**Editor Features:**
- Monaco Editor with markdown syntax highlighting
- Live editing with dark theme
- Copy to clipboard functionality
- Export options:
  - Raw Markdown (.md)
  - Cursor Rules (.cursorrules)
  - Claude Code Instructions (.md)

**Smart Recommendations:**
- Detects 3D elements → suggests Three.js
- High animation complexity → suggests GSAP
- Medium complexity → suggests Framer Motion
- Low complexity → suggests CSS animations
- Extracts all detected technologies from component tree

### Component Tree

Recursive, interactive component hierarchy viewer:

- Collapsible/expandable nodes for nested structures
- Click to select and view detailed information in side panel
- Visual tech badges (Three.js, GSAP, Framer Motion, React, etc.)
- Color-coded confidence indicators:
  - Green (>80%): High confidence
  - Yellow (50-80%): Medium confidence
  - Red (<50%): Low confidence - needs review
- Drag & drop to reorder components for manual adjustments
- Displays component properties, detected technologies, and child counts
- Supports sections, components, and elements

### New Analysis Page

Upload and analyze design screenshots or videos:

- Drag & drop file upload (PNG, JPG, WEBP, MP4)
- Support for up to 5 files
- File preview with thumbnails
- Project naming
- Multi-step analysis progress indicator
- Split-view results:
  - Left: Interactive image with clickable hotspots
  - Right: Detailed analysis results

Analysis detects:
- Layout structure
- Typography (fonts, sizes, weights)
- Color palette (hex codes)
- 3D elements detection
- Animation complexity rating

Currently uses mock data for demonstration. OpenAI Vision integration coming soon.

## Next Steps

- Implement screenshot upload functionality
- Add AI-powered analysis
- Build prompt generation system
- Create prompt library management
