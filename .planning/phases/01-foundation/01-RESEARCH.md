# Phase 1: Foundation - Research

**Researched:** 2025-01-24
**Domain:** Next.js 15 + Tailwind v4 + shadcn/ui + PWA
**Confidence:** HIGH

## Summary

Phase 1 establishes the modern app shell for Madplan v2 using the current best-practice stack: Next.js 15 with App Router, Tailwind CSS v4 with CSS-first configuration, and shadcn/ui components. The PWA capability is achieved through Next.js native manifest support plus optional Serwist for service worker.

The research confirms that:
1. **Tailwind v4 requires CSS-first configuration** - no more `tailwind.config.js` needed, everything in `globals.css` via `@theme`
2. **shadcn/ui is fully compatible with Tailwind v4** - CLI handles setup, colors now use OKLCH
3. **PWA manifest is built into Next.js** - use `app/manifest.ts` for dynamic manifest
4. **Mobile bottom navigation** is not a built-in shadcn component but easily built with Tabs or custom components

**Primary recommendation:** Use the standard `create-next-app` + `shadcn init` flow, configure earth-tone colors in `globals.css` via `@theme`, and implement PWA through native Next.js manifest.

## Standard Stack

The established libraries/tools for this phase:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.x | App framework with App Router | Native PWA manifest, Turbopack, RSC |
| Tailwind CSS | v4.0 | Utility-first CSS | CSS-first config, Oxide engine, faster builds |
| shadcn/ui | Latest | Component library | Copy-paste model, Tailwind-native, accessible |
| TypeScript | 5.x | Type safety | Industry standard, Next.js default |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| next/font | Built-in | Font optimization | Always - self-hosted Google Fonts |
| tw-animate-css | Latest | CSS animations | shadcn/ui default animation library |
| lucide-react | Latest | Icon library | shadcn/ui default icons |

### PWA (Optional Enhancement)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Serwist | Latest | Service worker toolkit | If offline/caching needed (Phase 3) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Serwist | @ducanh2912/next-pwa | Serwist is newer, better maintained |
| Native manifest | next-pwa | next-pwa unmaintained, use native |
| tw-animate-css | tailwindcss-animate | tw-animate-css is the new default |

**Installation:**
```bash
# Create project
npx create-next-app@latest madplan-v2 --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Initialize shadcn/ui (will detect Tailwind v4)
npx shadcn@latest init

# Add core components
npx shadcn@latest add button card tabs sheet badge skeleton
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout with fonts, PWA meta
│   ├── manifest.ts           # PWA manifest (dynamic)
│   ├── globals.css           # Tailwind + theme + colors
│   ├── page.tsx              # Dashboard/home
│   ├── ugeplan/
│   │   └── page.tsx          # Placeholder
│   ├── opskrifter/
│   │   └── page.tsx          # Placeholder
│   ├── tilfoej/
│   │   └── page.tsx          # Placeholder
│   └── indkob/
│       └── page.tsx          # Placeholder
├── components/
│   ├── ui/                   # shadcn/ui components (auto-generated)
│   ├── layout/
│   │   ├── mobile-nav.tsx    # Bottom navigation bar
│   │   ├── header.tsx        # Page header with actions
│   │   └── app-shell.tsx     # Main layout wrapper
│   └── shared/
│       └── empty-state.tsx   # Empty state with illustration
├── lib/
│   └── utils.ts              # cn() helper (shadcn default)
└── public/
    └── icons/                # PWA icons (192, 512, maskable)
```

### Pattern 1: CSS-First Theme Configuration (Tailwind v4)
**What:** Define all design tokens in `globals.css` using `@theme`
**When to use:** Always with Tailwind v4
**Example:**
```css
/* Source: https://tailwindcss.com/docs/colors */
@import "tailwindcss";

@theme {
  /* Earth tone palette - warm kitchen feel */
  --color-sand-50: oklch(0.98 0.01 80);
  --color-sand-100: oklch(0.95 0.02 75);
  --color-sand-200: oklch(0.90 0.03 70);
  --color-sand-500: oklch(0.70 0.05 65);
  --color-sand-900: oklch(0.35 0.05 60);

  --color-terracotta-500: oklch(0.60 0.12 45);
  --color-olive-500: oklch(0.55 0.08 130);

  /* Semantic colors */
  --color-background: var(--color-sand-50);
  --color-foreground: var(--color-sand-900);
  --color-primary: var(--color-terracotta-500);
  --color-accent: var(--color-olive-500);
}

@theme inline {
  --font-sans: var(--font-nunito);
  --font-heading: var(--font-poppins);
}
```

### Pattern 2: Next.js Font with CSS Variables
**What:** Import fonts via next/font, expose as CSS variables for Tailwind
**When to use:** Always for custom fonts
**Example:**
```tsx
// Source: https://nextjs.org/docs/app/getting-started/fonts
// layout.tsx
import { Nunito, Poppins } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da" className={`${nunito.variable} ${poppins.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

### Pattern 3: PWA Manifest with Dynamic Values
**What:** Use `app/manifest.ts` for type-safe, dynamic PWA manifest
**When to use:** Always for PWA
**Example:**
```tsx
// Source: https://nextjs.org/docs/app/guides/progressive-web-apps
// app/manifest.ts
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Madplan",
    short_name: "Madplan",
    description: "Planlaeg ugens maaltider",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F2", // sand-50
    theme_color: "#CB6843",     // terracotta-500
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
```

### Pattern 4: Mobile Bottom Navigation
**What:** Fixed bottom bar with 4 navigation items using icons + labels
**When to use:** Mobile-first apps with main navigation sections
**Example:**
```tsx
// Custom implementation - no shadcn component exists
// components/layout/mobile-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Book, Plus, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/ugeplan", icon: Calendar, label: "Ugeplan" },
  { href: "/opskrifter", icon: Book, label: "Opskrifter" },
  { href: "/tilfoej", icon: Plus, label: "Tilfoej" },
  { href: "/indkob", icon: ShoppingCart, label: "Indkob" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t safe-area-pb">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg",
                "transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

### Anti-Patterns to Avoid
- **Using tailwind.config.js with v4:** Use `@theme` in CSS instead
- **Installing @next/font:** It's built into Next.js as `next/font` since v14
- **Using tailwindcss-animate:** Use tw-animate-css (new shadcn default)
- **Setting icon purpose to "any maskable":** Use separate icons for each purpose
- **Hardcoding colors in components:** Always use CSS variables/theme colors

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PWA manifest | JSON file + meta tags | `app/manifest.ts` | Type-safe, dynamic values, Next.js convention |
| Font loading | @font-face rules | next/font | Self-hosting, no CLS, optimized |
| Icon library | Custom SVGs | lucide-react | Consistent, tree-shakeable, shadcn default |
| CSS utilities | Custom classes | Tailwind utilities | Consistent API, JIT compilation |
| Component styling | CSS modules | Tailwind + cn() | shadcn pattern, variant support |
| Dark mode toggle | Custom implementation | next-themes | SSR-safe, prevents flash |

**Key insight:** The Next.js + Tailwind + shadcn stack has conventions for almost everything. Following them means less code and better integration.

## Common Pitfalls

### Pitfall 1: Tailwind v4 @theme vs @theme inline
**What goes wrong:** Colors/fonts don't work because wrong directive used
**Why it happens:** `@theme` creates new values, `@theme inline` references existing CSS variables
**How to avoid:**
- Use `@theme` for static values (oklch colors, font stacks)
- Use `@theme inline` when referencing CSS variables from elsewhere (next/font variables)
**Warning signs:** Tailwind classes like `font-heading` or `bg-primary` not applying

### Pitfall 2: PWA Icons Wrong Size or Purpose
**What goes wrong:** App icon looks zoomed/cropped wrong on Android or iOS
**Why it happens:** Different platforms handle icons differently
**How to avoid:**
- Provide both 192x192 AND 512x512 (required for Chrome install)
- Provide separate maskable icon with 80% safe zone (center circle)
- Add `<link rel="apple-touch-icon">` in HTML for iOS (Safari ignores manifest)
**Warning signs:** Icon looks cut off on Android, wrong icon on iOS home screen

### Pitfall 3: Safe Area Insets Ignored
**What goes wrong:** Bottom nav hidden behind iPhone home indicator
**Why it happens:** Modern phones have notches and home indicators
**How to avoid:** Add safe area padding: `pb-safe` or `env(safe-area-inset-bottom)`
**Warning signs:** UI cut off at bottom on newer iPhones

### Pitfall 4: shadcn Component Ownership Confusion
**What goes wrong:** Expecting `npm update` to fix component bugs
**Why it happens:** shadcn copies code into your project - you own it
**How to avoid:**
- Track modifications in component files
- Periodically check shadcn changelog for fixes
- Re-add component to get updates (will overwrite customizations)
**Warning signs:** Bug exists in your code but "fixed" in latest shadcn

### Pitfall 5: next/font Variable Not Resolving in Tailwind
**What goes wrong:** `font-heading` class doesn't apply the font
**Why it happens:** Tailwind v4 can't automatically detect Next.js injected CSS variables
**How to avoid:** Explicitly map variables in `@theme inline`:
```css
@theme inline {
  --font-heading: var(--font-poppins);
}
```
**Warning signs:** Font utilities don't apply, browser shows default font

## Code Examples

Verified patterns from official sources:

### Complete globals.css for Madplan (Earth Tones)
```css
/* Source: Tailwind v4 docs + shadcn/ui Tailwind v4 guide */
@import "tailwindcss";
@import "tw-animate-css";

/*
 * Earth tone palette for "Madplan" - warm kitchen feel
 * Colors use OKLCH for perceptual consistency
 */
@theme {
  /* Sand/Beige - Primary neutral */
  --color-sand-50: oklch(0.98 0.008 80);
  --color-sand-100: oklch(0.95 0.015 75);
  --color-sand-200: oklch(0.90 0.025 70);
  --color-sand-300: oklch(0.82 0.035 68);
  --color-sand-400: oklch(0.72 0.045 65);
  --color-sand-500: oklch(0.62 0.050 62);
  --color-sand-600: oklch(0.52 0.050 60);
  --color-sand-700: oklch(0.42 0.045 58);
  --color-sand-800: oklch(0.32 0.035 55);
  --color-sand-900: oklch(0.22 0.025 52);

  /* Terracotta - Accent/Primary action */
  --color-terracotta-50: oklch(0.96 0.02 45);
  --color-terracotta-100: oklch(0.90 0.05 42);
  --color-terracotta-200: oklch(0.82 0.08 40);
  --color-terracotta-300: oklch(0.72 0.11 38);
  --color-terracotta-400: oklch(0.65 0.13 36);
  --color-terracotta-500: oklch(0.58 0.14 35);
  --color-terracotta-600: oklch(0.50 0.13 33);
  --color-terracotta-700: oklch(0.42 0.11 30);
  --color-terracotta-800: oklch(0.35 0.09 28);
  --color-terracotta-900: oklch(0.28 0.07 25);

  /* Olive - Secondary accent */
  --color-olive-50: oklch(0.96 0.02 130);
  --color-olive-100: oklch(0.90 0.04 128);
  --color-olive-200: oklch(0.82 0.06 125);
  --color-olive-300: oklch(0.72 0.08 122);
  --color-olive-400: oklch(0.62 0.09 120);
  --color-olive-500: oklch(0.52 0.08 118);
  --color-olive-600: oklch(0.45 0.07 115);
  --color-olive-700: oklch(0.38 0.06 112);
  --color-olive-800: oklch(0.30 0.05 110);
  --color-olive-900: oklch(0.22 0.04 108);

  /* Border radius - rounded, friendly */
  --radius-sm: 0.375rem;
  --radius-md: 0.625rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
}

/* Semantic color mapping for shadcn/ui compatibility */
:root {
  --background: var(--color-sand-50);
  --foreground: var(--color-sand-900);

  --card: var(--color-sand-100);
  --card-foreground: var(--color-sand-900);

  --primary: var(--color-terracotta-500);
  --primary-foreground: white;

  --secondary: var(--color-sand-200);
  --secondary-foreground: var(--color-sand-800);

  --accent: var(--color-olive-500);
  --accent-foreground: white;

  --muted: var(--color-sand-200);
  --muted-foreground: var(--color-sand-600);

  --border: var(--color-sand-300);
  --input: var(--color-sand-300);
  --ring: var(--color-terracotta-400);

  --radius: 0.625rem;
}

/* Map to Tailwind utilities */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* Font mapping from next/font */
  --font-sans: var(--font-nunito), system-ui, sans-serif;
  --font-heading: var(--font-poppins), system-ui, sans-serif;
}

/* Safe area for mobile devices */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .safe-area-pb {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
```

### Root Layout with Fonts and Metadata
```tsx
// Source: https://nextjs.org/docs/app/getting-started/fonts
// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Nunito, Poppins } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Madplan",
  description: "Planlaeg ugens maaltider",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Madplan",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#CB6843",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da" className={`${nunito.variable} ${poppins.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="font-sans bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
```

### App Shell with Mobile Navigation
```tsx
// components/layout/app-shell.tsx
import { MobileNav } from "./mobile-nav";
import { Header } from "./header";

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
}

export function AppShell({ children, title, actions }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title={title} actions={actions} />
      <main className="flex-1 pb-20 px-4 pt-4">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.js | CSS @theme directive | Tailwind v4 (Jan 2025) | No more JS config files |
| tailwindcss-animate | tw-animate-css | shadcn/ui Jan 2025 | Different import syntax |
| HSL colors | OKLCH colors | Tailwind v4 / shadcn | Better perceptual consistency |
| forwardRef | data-slot | shadcn/ui 2025 | Simpler component patterns |
| next-pwa | Native manifest + Serwist | 2024 | next-pwa unmaintained |
| @next/font | next/font | Next.js 14 | Built-in, no separate package |

**Deprecated/outdated:**
- **tailwind.config.js**: Still works but CSS-first is recommended
- **next-pwa**: Unmaintained, use native manifest.ts
- **@ducanh2912/next-pwa**: Works but Serwist is preferred
- **HSL in shadcn**: Now uses OKLCH for new projects

## Open Questions

Things that couldn't be fully resolved:

1. **Exact OKLCH values for earth tones**
   - What we know: OKLCH format and structure
   - What's unclear: Precise values that create the "warm kitchen" feel
   - Recommendation: Start with provided palette, adjust based on visual testing

2. **shadcn/ui bottom navigation**
   - What we know: Feature request exists, not yet implemented
   - What's unclear: When/if official component will ship
   - Recommendation: Build custom component using Tabs or simple links

3. **Service worker in Phase 1 vs Phase 3**
   - What we know: Basic installability works without service worker
   - What's unclear: Whether service worker is needed for good "Add to Home Screen" experience
   - Recommendation: Skip service worker in Phase 1, add in Phase 3 for caching

## Sources

### Primary (HIGH confidence)
- [shadcn/ui Next.js Installation](https://ui.shadcn.com/docs/installation/next) - Setup steps
- [shadcn/ui Tailwind v4 Guide](https://ui.shadcn.com/docs/tailwind-v4) - Migration and @theme usage
- [Tailwind CSS v4 Colors](https://tailwindcss.com/docs/colors) - @theme directive, OKLCH
- [Next.js PWA Guide](https://nextjs.org/docs/app/guides/progressive-web-apps) - manifest.ts, icons
- [Next.js Fonts](https://nextjs.org/docs/app/getting-started/fonts) - next/font usage
- [Serwist Getting Started](https://serwist.pages.dev/docs/next/getting-started) - Service worker setup

### Secondary (MEDIUM confidence)
- [Google Fonts in Next.js 15 + Tailwind v4](https://www.buildwithmatija.com/blog/how-to-use-custom-google-fonts-in-next-js-15-and-tailwind-v4) - Font + Tailwind integration
- [Tailwind v4 Discussion: Theming](https://github.com/tailwindlabs/tailwindcss/discussions/18471) - Best practices
- [PWA Icon Requirements](https://logofoundry.app/blog/pwa-icon-requirements-safe-areas) - Maskable icon safe zones

### Tertiary (LOW confidence)
- Various Medium articles on earth tone palettes - Color hex codes
- shadcn/ui GitHub discussions - Bottom navigation patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official documentation verified
- Architecture: HIGH - Standard Next.js patterns
- Tailwind v4 setup: HIGH - Official docs + shadcn guide
- PWA manifest: HIGH - Next.js official docs
- Color palette: MEDIUM - General guidance, specific values need testing
- Bottom navigation: MEDIUM - Community patterns, no official component

**Research date:** 2025-01-24
**Valid until:** 2025-03-24 (stable tech, 60-day validity)
