# Theme Integration Checklist

A step-by-step guide for adding a new theme to the Jira Handover Dashboard.

## Architecture Overview (Updated Dec 2024)

Theme configuration is now modular:
```
lib/theme/
├── types.ts                 # Theme type definitions
├── theme-config.ts          # Main accessor functions + nav items
└── themes/
    ├── index.ts             # Theme map and re-exports
    ├── default.ts           # Default theme config
    ├── pixel.ts             # Pixel theme config
    ├── lunar.ts             # Lunar theme config
    ├── christmas.ts         # Christmas theme config
    ├── coding.ts            # Coding theme config
    ├── clash.ts             # Clash theme config
    └── angkor-pixel.ts      # Angkor Pixel theme config
```

## Prerequisites
- Theme name (e.g., "lunar", "pixel", "christmas")
- Theme display name (e.g., "Lunar", "Pixel", "Christmas")
- Theme icon emoji (e.g., "🧧", "🎮", "🎄")
- Color palette and design mockup

---

## Step 1: Add Theme to Type Union
**File:** `lib/types/index.ts`

Update the Theme type union:
```typescript
export type Theme = "default" | "christmas" | "pixel" | "lunar" | "your_theme";
```

---

## Step 2: Add Theme Metadata
**File:** `lib/constants.ts`

Add to the `THEMES` array:
```typescript
{
  id: "your_theme" as Theme,
  name: "Your Theme",
  description: "Description of your theme",
  icon: "🎨",
},
```

---

## Step 3: Create Theme Configuration File
**File:** `lib/theme/themes/your-theme.ts`

```typescript
/**
 * Your Theme Configuration
 */

import { Zap, Trash2, Save, Send, Sparkles } from "lucide-react"
import type { ThemeConfig } from "../types"

export const yourThemeConfig: ThemeConfig = {
  header: {
    container: "your header container classes",
    logo: {
      svgIcon: "/icons/your-theme/logo.svg", // or use icon prop for Lucide
      title: "title classes",
      titleGradient: "gradient classes", // optional
    },
    badge: "badge classes",
    nav: {
      link: "nav link classes",
      kbd: "keyboard shortcut classes",
      kbdIcon: "/icons/your-theme/key.svg", // optional
    },
  },
  layout: {
    body: "theme-your_theme",
    background: "your-theme-bg",
    mobileBar: "mobile bar classes",
  },
  table: {
    container: "table container classes",
    header: "table header classes",
    headerCell: "header cell classes",
    row: "row classes",
    cell: "cell classes",
    mobileCard: "mobile card classes",
    detailsButton: "details button classes",
  },
  actions: {
    aiFill: {
      id: "ai-fill",
      label: "Theme Fill",
      svgIcon: "/icons/your-theme/star.svg", // or use icon prop
      className: "button classes",
      iconClassName: "icon classes", // optional
    },
    quickFill: { /* ... */ },
    clear: { /* ... */ },
    refresh: { /* ... */ },
    copy: { /* ... */ },
    save: { /* ... */ },
    send: { /* ... */ },
  },
  mobileActions: {
    aiFill: {
      id: "ai-fill",
      icon: Sparkles, // or use svgIcon
      className: "mobile button classes",
      iconColor: "icon color class",
    },
    quickFill: { /* ... */ },
    clear: { /* ... */ },
    save: { /* ... */ },
    send: { /* ... */ },
  },
}
```

---

## Step 4: Register Theme in Index
**File:** `lib/theme/themes/index.ts`

```typescript
// Add export
export { yourThemeConfig } from "./your-theme"

// Add import
import { yourThemeConfig } from "./your-theme"

// Add to THEME_CONFIGS map
export const THEME_CONFIGS: Record<Theme, ThemeConfig> = {
  // ... existing themes
  your_theme: yourThemeConfig,
}
```

---

## Step 5: Update Navigation Items (if theme-specific)
**File:** `lib/theme/theme-config.ts`

In `getHeaderNavItems()`:
```typescript
if (theme === "your_theme") {
  return [
    { href: "/feedback", label: "Your Label", svgIcon: "/icons/your-theme/icon.svg" },
    { href: "/changelog", label: "Your Label", svgIcon: "/icons/your-theme/icon.svg" },
  ]
}
```

---

## Step 6: Add CSS Styles
**File:** `app/globals.css`

### 6.1 Add body styles in `@layer base`:
```css
body.theme-your_theme {
  font-family: 'Your Font', sans-serif;
  background-color: #your-bg-color;
  color: #your-text-color;
}

/* Theme link colors */
body.theme-your_theme a[href*="jira"],
body.theme-your_theme a[href*="atlassian"] {
  color: #your-link-color;
}

/* Theme input styles */
body.theme-your_theme input[type="text"],
body.theme-your_theme input:not([type]) {
  background-color: #your-input-bg !important;
  border: 1px solid #your-border !important;
  color: #your-text !important;
}

/* Theme scrollbar */
body.theme-your_theme ::-webkit-scrollbar-thumb {
  background: #your-scrollbar-color;
}
```

### 6.2 Add utility classes in `@layer utilities`:
```css
.your-theme-bg {
  background-color: #your-bg;
  font-family: 'Your Font', sans-serif;
}

.your-theme-card {
  background-color: rgba(x, x, x, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
}

.your-theme-btn-primary {
  background: linear-gradient(to right, #color1, #color2);
  color: white;
}
```

---

## Step 7: Update Theme Store
**File:** `lib/stores/theme-store.ts`

Add your theme to localStorage validation:
```typescript
if (stored === "default" || stored === "your_theme" || /* ... other themes */) {
```

---

## Step 8: Create Scene Component (Optional)
**File:** `components/your-theme-scene.tsx`

```typescript
"use client";

export function YourThemeScene() {
  return (
    <>
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Add decorative elements */}
      </div>

      {/* Floating decorations */}
      <YourDecoration />
    </>
  );
}
```

---

## Verification Checklist

- [ ] Theme appears in theme selector dropdown
- [ ] Theme persists after page refresh (localStorage)
- [ ] Body background and colors apply correctly
- [ ] Header styling (icon, title, badge, buttons)
- [ ] Action buttons have correct theme styling
- [ ] Table styling (header, rows, cells)
- [ ] Mobile view styling
- [ ] Input fields have theme colors
- [ ] Links have theme colors
- [ ] Scrollbar has theme styling
- [ ] Scene/decorations render (if applicable)
- [ ] Build passes: `npm run build`
- [ ] No console errors in browser

---

## Files Changed Summary

| File | Purpose |
|------|---------|
| `lib/types/index.ts` | Update type union |
| `lib/constants.ts` | Add theme metadata |
| `lib/theme/themes/your-theme.ts` | (New) Theme configuration |
| `lib/theme/themes/index.ts` | Register theme |
| `lib/theme/theme-config.ts` | Add nav items (if theme-specific) |
| `lib/stores/theme-store.ts` | Update localStorage validation |
| `app/globals.css` | Add CSS styles |
| `components/your-theme-scene.tsx` | (Optional) Background effects |
| `public/icons/your-theme/` | (New) Theme icons |
