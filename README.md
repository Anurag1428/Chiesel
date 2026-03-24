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

### Export & Sharing

Comprehensive export options for your analysis:

**Export Modal:**
- Copy Prompt: One-click copy to clipboard
- Open in Cursor: Copies prompt and launches Cursor IDE (cursor:// protocol)
- Open in Bolt: Generates bolt.new URL with prefilled prompt
- Download Project Brief: Markdown file with embedded images (base64)
- Shareable Link: Generates unique URL with encoded analysis data

**Features:**
- Multiple export formats
- Visual feedback for actions
- Embedded images in markdown
- URL-encoded data sharing
- No server required for sharing

**Integration:**
- Export button in analysis results
- Save button to store in library
- Shareable links work offline
- Data encoded in URL

### Prompt Library

Manage and reuse past analyses:

**Grid View:**
- Card-based layout
- Thumbnail previews
- Project names
- Creation dates
- Tech tags (Next.js, Three.js, etc.)

**Features:**
- Search by project name or tech tags
- Reuse button to load as template
- Delete individual analyses
- Clear all option
- Responsive grid layout
- Empty state with CTA

**Storage:**
- LocalStorage-based
- Automatic date formatting
- Tech tag extraction
- Thumbnail generation
- Persistent across sessions

**Reuse Functionality:**
- Load saved analysis as template
- Pre-fill all parameters
- Maintain component tree
- Restore 3D configuration
- Quick iteration on designs

### Video Frame Extraction & Motion Analysis

Client-side video processing with FFmpeg.wasm for animation analysis:

**Frame Extraction:**
- Extracts 5 frames evenly spaced throughout the video
- Client-side processing (no server upload required)
- Progress indicator during extraction
- Automatic frame selection

**Filmstrip Timeline:**
- Visual timeline with all extracted frames
- Click any frame to analyze that specific moment
- Film sprocket hole design for authentic look
- Timestamp display for each frame
- Active frame highlighting
- Timeline progress bar

**Motion Detection View:**
- Side-by-side frame comparison
- Visual diff overlay (highlights changes between frames)
- Toggle diff view on/off
- Detected changes list:
  - Position changes (X/Y coordinates)
  - Scale transformations
  - Opacity transitions
  - Rotation detection

**Animation Parameters:**
- Estimated Duration input (0-10 seconds)
- Detected Easing dropdown:
  - Spring
  - Bounce
  - Linear
  - Ease In
  - Ease Out
  - Ease In-Out
- Motion Intensity selector (Low/Medium/High)
- Generated CSS preview

**Features:**
- Real-time parameter adjustment
- User can confirm or change detected values
- Visual feedback with color-coded intensity
- Automatic motion detection (simulated for MVP)
- Ready for CV analysis integration

**Technical:**
- FFmpeg.wasm for client-side video processing
- No server upload required
- Supports MP4 format
- Efficient frame extraction
- Memory-optimized processing

### 3D Configurator

When 3D elements are detected, a comprehensive configurator panel appears with game-engine-style controls:

**Material Properties:**
- Transmission (0-1): Glass-like transparency
- Roughness (0-1): Surface finish (smooth to matte)
- Metalness (0-1): Metallic appearance
- Clearcoat (0-1): Car paint effect

**Geometry Settings:**
- Type: Sphere, Box, Torus, Cylinder, Cone
- Segments (8-128): Mesh detail level

**Lighting Configuration:**
- Ambient Intensity: Global light brightness
- Directional Position: X/Y/Z coordinates
- Point Light Color: Hex color picker

**Camera Controls:**
- FOV (20-100°): Field of view
- Position: X/Y/Z coordinates
- Look-At Target: Camera focus point

**Animation Settings:**
- Auto-Rotate Speed (0-5): Rotation speed
- Enable Damping: Smooth camera movement
- Damping Factor (0.01-0.2): Inertia strength

**Features:**
- Real-time prompt updates as you adjust values
- Tabbed interface for organized controls
- Visual feedback with value displays
- Reset to defaults button
- Generates both vanilla Three.js and React Three Fiber code
- Technical but approachable UI design

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
