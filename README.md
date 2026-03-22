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

## Next Steps

- Implement screenshot upload functionality
- Add AI-powered analysis
- Build prompt generation system
- Create prompt library management
