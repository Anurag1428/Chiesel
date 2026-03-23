import { ComponentNode } from "@/types/component-tree";

export const mockComponentTree: ComponentNode[] = [
  {
    id: "hero",
    type: "section",
    label: "Hero Section",
    detectedTech: "Three.js",
    confidence: 0.92,
    props: {
      background: "gradient",
      height: "100vh",
      animation: "parallax",
    },
    children: [
      {
        id: "nav",
        type: "component",
        label: "Navbar",
        detectedTech: "React",
        confidence: 0.88,
        props: {
          position: "fixed",
          transparent: true,
        },
        children: [
          {
            id: "logo",
            type: "element",
            label: "Logo",
            confidence: 0.95,
            props: {
              src: "/logo.svg",
              width: "120px",
            },
          },
          {
            id: "nav-links",
            type: "element",
            label: "Navigation Links",
            confidence: 0.91,
            props: {
              items: ["Home", "About", "Services", "Contact"],
            },
          },
        ],
      },
      {
        id: "hero-content",
        type: "component",
        label: "Hero Content",
        detectedTech: "GSAP",
        confidence: 0.85,
        props: {
          alignment: "center",
          animation: "fade-in-up",
        },
        children: [
          {
            id: "hero-title",
            type: "element",
            label: "Main Heading",
            confidence: 0.93,
            props: {
              fontSize: "4rem",
              fontWeight: "bold",
            },
          },
          {
            id: "hero-subtitle",
            type: "element",
            label: "Subtitle",
            confidence: 0.89,
            props: {
              fontSize: "1.5rem",
              color: "#64748B",
            },
          },
          {
            id: "cta-button",
            type: "element",
            label: "CTA Button",
            confidence: 0.96,
            props: {
              text: "Get Started",
              variant: "primary",
            },
          },
        ],
      },
    ],
  },
  {
    id: "features",
    type: "section",
    label: "Features Section",
    detectedTech: "Framer Motion",
    confidence: 0.78,
    props: {
      layout: "grid",
      columns: 3,
    },
    children: [
      {
        id: "feature-1",
        type: "component",
        label: "Feature Card 1",
        confidence: 0.82,
        props: {
          icon: "⚡",
          title: "Fast Performance",
        },
      },
      {
        id: "feature-2",
        type: "component",
        label: "Feature Card 2",
        confidence: 0.79,
        props: {
          icon: "🎨",
          title: "Beautiful Design",
        },
      },
      {
        id: "feature-3",
        type: "component",
        label: "Feature Card 3",
        confidence: 0.81,
        props: {
          icon: "🔒",
          title: "Secure & Reliable",
        },
      },
    ],
  },
  {
    id: "footer",
    type: "section",
    label: "Footer",
    detectedTech: "Tailwind",
    confidence: 0.65,
    props: {
      background: "#0F172A",
      padding: "4rem 0",
    },
    children: [
      {
        id: "footer-links",
        type: "component",
        label: "Footer Links",
        confidence: 0.72,
        props: {
          columns: 4,
        },
      },
      {
        id: "copyright",
        type: "element",
        label: "Copyright Text",
        confidence: 0.88,
        props: {
          text: "© 2024 Company Name",
        },
      },
    ],
  },
];
