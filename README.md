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
