# Mission Control v2

A dual‑mode Mission Control system with Apple Glass / Liquid Glass design language.

## Features

### 🎨 Visual Identity
- **Deep midnight‑blue gradient** background
- **Animated mesh blobs** with parallax effects
- **Glass material** with backdrop blur, borders, and inner shadows
- **Premium typography** with increased tracking
- **Framer Motion** spring transitions and magnetic hover effects

### 📱 Mobile/Desktop App
- **Responsive glass card** layouts
- **Horizontal scrollable** agent feed on mobile
- **Responsive grid** (3‑5 columns) on desktop
- **Live agent status** with real‑time updates
- **Build timeline** with glowing nodes
- **System HUD** with circular progress rings

### 🌐 Web Version (Browser‑First)
- **Three‑column layout** with adaptive breakpoints
- **Persistent top command bar** with Spotlight‑style input
- **Real‑time panels** for agent logs and build events
- **Responsive rules**:
  - ≥ 1440px: Full 3‑column layout
  - 1024–1439px: Collapse right column
  - < 1024px: Switch to mobile layout

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4** with custom theme tokens
- **Framer Motion** for animations
- **Radix UI** for accessible components
- **Lucide React** for icons

## Project Structure

```
mission-control-v2/
├── app/
│   ├── layout.tsx          # Root layout with animated background
│   └── page.tsx            # Dual‑mode layout switcher
├── components/
│   ├── ui/                 # Reusable UI primitives
│   │   ├── glass-card.tsx
│   │   ├── circular-progress.tsx
│   │   └── command-bar.tsx
│   ├── layout/             # Layout components
│   │   ├── mobile-layout.tsx
│   │   ├── desktop-layout.tsx
│   │   └── navigation-rail.tsx
│   └── charts/             # Dashboard components
│       ├── agent-feed.tsx
│       ├── build-timeline.tsx
│       └── system-hud.tsx
├── lib/
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript definitions
└── styles/
    └── globals.css         # Global styles with glass effects
```

## Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## Design Tokens

### Colors
- `glass-dark`: `rgba(10, 15, 30, 0.95)`
- `glass-light`: `rgba(255, 255, 255, 0.1)`
- `glass-border`: `rgba(255, 255, 255, 0.2)`
- `midnight-gradient`: `linear-gradient(135deg, #00104d 0%, #0038e6 50%, #001d80 100%)`

### Animations
- `float`: 6s ease‑in‑out infinite
- `pulse-glow`: 2s ease‑in‑out infinite
- `sweep`: 1.5s ease‑in‑out infinite

### Typography
- **Font**: Inter / SF Pro Display
- **Tracking**: Increased for premium floating feel
- **Weight scale**: 300 → 600 only

## Deployment

The application is optimized for Vercel deployment with static prerendering.

## License

MIT