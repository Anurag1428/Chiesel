# DesignToCode Features

## Overview
DesignToCode is a comprehensive tool that analyzes website screenshots and generates detailed implementation prompts for developers.

## Core Features

### 1. Video Frame Extraction & Motion Analysis

**Client-Side Video Processing:**
- FFmpeg.wasm integration for browser-based processing
- No server upload required (privacy-friendly)
- Supports MP4 video format
- Progress tracking during extraction

**Frame Extraction:**
- Extracts 5 frames evenly spaced throughout video
- Automatic timestamp calculation
- High-quality PNG output
- Efficient memory management

**Filmstrip Timeline:**
- Visual timeline with film sprocket holes
- Click to select any frame
- Timestamp display (MM:SS.MS format)
- Active frame highlighting
- Timeline progress bar
- Horizontal scroll for navigation

**Motion Detection View:**
- Side-by-side frame comparison
- Visual diff overlay (blend mode)
- Toggle diff on/off
- Detected changes list:
  - Position changes (X/Y coordinates)
  - Scale transformations
  - Opacity transitions
  - Rotation detection

**Animation Parameters:**
- Duration input (0-10 seconds, 0.1 step)
- Easing function selector:
  - Spring
  - Bounce
  - Linear
  - Ease In/Out/In-Out
- Motion intensity (Low/Medium/High)
- Generated CSS preview
- Real-time parameter updates

**MVP Implementation:**
- Full UI/UX complete
- Mock motion detection
- Ready for CV analysis integration
- All parameters user-adjustable

### 2. File Upload & Analysis
- **Multi-file Upload**: Support for up to 5 files (PNG, JPG, WEBP, MP4)
- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **File Preview**: Thumbnail previews with remove functionality
- **Progress Tracking**: 4-step analysis process with visual indicators
  1. Uploading
  2. Analyzing Visuals
  3. Extracting Components
  4. Generating Prompt

### 2. Visual Analysis
- **Layout Detection**: Identifies grid systems, flexbox patterns, and structural elements
- **Typography Analysis**: Extracts font families, sizes, and weights
- **Color Extraction**: Detects and extracts hex color codes
- **3D Element Detection**: Boolean flag for Three.js/WebGL content
- **Animation Complexity**: Rates animations as low/medium/high

### 3. Interactive Design Preview
- **Hotspot System**: Clickable markers on design preview
- **Contextual Information**: Hover/click to view component details
- **Image Viewer**: High-quality preview with border styling

### 4. Component Tree
- **Recursive Structure**: Nested component hierarchy
- **Collapsible Nodes**: Expand/collapse for better navigation
- **Visual Indicators**:
  - Type icons (📦 section, 🧩 component, 🔷 element)
  - Tech badges (Three.js, GSAP, Framer Motion, React, Tailwind)
  - Confidence bars (color-coded: green >80%, yellow 50-80%, red <50%)
- **Drag & Drop**: Reorder components manually
- **Selection System**: Click to view detailed information
- **Details Panel**: Shows properties, tech stack, and child count

### 5. Prompt Generation Engine

#### Generated Sections:
1. **Master Implementation Prompt**
   - Project name and overview
   - Generation timestamp

2. **General Rules**
   - Pixel perfection guidelines
   - Responsive design requirements
   - Semantic HTML standards
   - Accessibility (WCAG 2.1 AA)
   - Code quality expectations
   - Performance priorities
   - Cross-browser compatibility

3. **Tech Stack Detection**
   - Smart recommendations based on analysis:
     - 3D elements → Three.js
     - High animation → GSAP
     - Medium animation → Framer Motion
     - Low animation → CSS
   - Lists all detected technologies from component tree
   - Suggests React, TypeScript, Tailwind, Next.js

4. **Component Breakdown**
   - Layout structure description
   - Recursive component hierarchy
   - Properties and configurations
   - Confidence scores for each component

5. **Design System**
   - CSS variables for colors
   - Typography scale (xs to 5xl)
   - Semantic color assignments
   - Font specifications

6. **Interactions & Animations**
   - Complexity-based recommendations
   - Code examples for each level:
     - High: GSAP ScrollTrigger examples
     - Medium: Framer Motion examples
     - Low: CSS transition examples
   - Scroll behavior guidelines
   - Hover state specifications

7. **Performance Requirements**
   - Lighthouse score targets (90+)
   - Core Web Vitals thresholds
   - Optimization strategies:
     - Image optimization
     - Code splitting
     - Asset loading
   - Next.js Image component examples

8. **Implementation Checklist**
   - Step-by-step verification list
   - Quality assurance items

### 6. Monaco Editor Integration
- **Syntax Highlighting**: Full markdown support
- **Dark Theme**: Matches application theme
- **Live Editing**: Real-time prompt customization
- **Line Numbers**: Easy reference
- **Word Wrap**: Readable long lines
- **Auto Layout**: Responsive editor sizing

### 7. Export Functionality

#### Export Formats:
1. **Raw Markdown** (.md)
   - Standard markdown file
   - Ready for documentation

2. **Cursor Rules** (.cursorrules)
   - Formatted for Cursor IDE
   - Includes AI assistant instructions
   - Development guidelines

3. **Claude Code Instructions** (.md)
   - Optimized for Claude AI
   - Structured approach guidelines
   - Code style specifications

#### Export Features:
- **Copy to Clipboard**: One-click copy
- **Download**: Automatic file download
- **Custom Naming**: Based on project name
- **Format Conversion**: Automatic formatting per export type

## Technical Implementation

### Dependencies
- **Next.js 14**: App Router, Server Components
- **React 18**: Hooks, Context
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Component library
- **Framer Motion**: Animations
- **@monaco-editor/react**: Code editor
- **@dnd-kit**: Drag and drop
- **@radix-ui**: Accessible primitives
- **react-dropzone**: File uploads
- **lucide-react**: Icons

### Architecture
- **Component-Based**: Modular, reusable components
- **Type-Safe**: TypeScript throughout
- **Responsive**: Mobile-first design
- **Accessible**: WCAG compliant
- **Performant**: Optimized rendering

## Demo Pages

1. **Dashboard** (`/`)
   - Overview and welcome

2. **New Analysis** (`/new-analysis`)
   - Full analysis workflow
   - Upload → Analyze → Results → Prompt

3. **Component Tree Demo** (`/component-tree-demo`)
   - Standalone tree viewer
   - Interactive demonstration

4. **Prompt Generator Demo** (`/prompt-demo`)
   - Standalone prompt editor
   - Export functionality showcase

5. **Prompt Library** (`/prompt-library`)
   - Saved prompts (placeholder)

6. **Settings** (`/settings`)
   - Configuration (placeholder)

## Future Enhancements

- OpenAI Vision API integration
- Real image analysis (currently mock data)
- Prompt library with save/load
- User authentication
- Project management
- Version history
- Collaboration features
- Custom templates
- API endpoints
- Webhook integrations
