# Theme Integration Checklist

A step-by-step guide for adding a new theme to the Jira Handover Dashboard.

## Prerequisites
- Theme name (e.g., "lunar", "pixel", "christmas")
- Theme display name (e.g., "Lunar", "Pixel", "Christmas")
- Theme icon emoji (e.g., "🧧", "🎮", "🎄")
- Color palette and design mockup

---

## Step 1: Add Theme to Enum
**File:** `enums/theme.enum.ts`

```typescript
export enum Theme {
  DEFAULT = "default",
  CHRISTMAS = "christmas",
  PIXEL = "pixel",
  LUNAR = "lunar",
  // Add your new theme here:
  YOUR_THEME = "your_theme",
}
```

---

## Step 2: Add Theme Metadata
**File:** `lib/constants.ts`

Add to the `THEMES` array:
```typescript
{
  id: Theme.YOUR_THEME,
  name: "Your Theme",
  description: "Description of your theme",
  icon: "🎨",
},
```

---

## Step 3: Update Theme Type
**File:** `lib/types/index.ts`

Update the Theme type union:
```typescript
export type Theme = "default" | "christmas" | "pixel" | "lunar" | "your_theme";
```

---

## Step 4: Update Theme Store
**File:** `lib/stores/theme-store.ts`

Add your theme to localStorage validation (2 places):
```typescript
// In loadFromLocalStorage:
if (stored === Theme.DEFAULT || stored === Theme.CHRISTMAS || stored === Theme.PIXEL || stored === Theme.LUNAR || stored === Theme.YOUR_THEME) {

// At the bottom of the file:
if (stored === Theme.DEFAULT || stored === Theme.CHRISTMAS || stored === Theme.PIXEL || stored === Theme.LUNAR || stored === Theme.YOUR_THEME) {
```

---

## Step 5: Add CSS Styles
**File:** `app/globals.css`

### 5.1 Add body styles in `@layer base`:
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

### 5.2 Add utility classes in `@layer utilities`:
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

## Step 6: Update Dashboard Layout
**File:** `components/dashboard-layout.tsx`

### 6.1 Import your scene component (if any):
```typescript
import { YourThemeScene } from "@/components/your-theme-scene";
```

### 6.2 Add to body class removal:
```typescript
document.body.classList.remove("theme-christmas", "theme-default", "theme-pixel", "theme-lunar", "theme-your_theme");
```

### 6.3 Add background class condition:
```typescript
className={cn(
  "h-dvh flex flex-col overflow-hidden relative",
  theme === Theme.CHRISTMAS ? "christmas-bg"
  : theme === Theme.PIXEL ? "pixel-bg p-6"
  : theme === Theme.LUNAR ? "lunar-bg"
  : theme === Theme.YOUR_THEME ? "your-theme-bg"
  : "bg-background"
)}
```

### 6.4 Add scene component render:
```typescript
{theme === Theme.YOUR_THEME && <YourThemeScene />}
```

---

## Step 7: Update Dashboard Header
**File:** `components/dashboard-header.tsx`

### 7.1 Import icon:
```typescript
import { YourIcon } from "lucide-react";
```

### 7.2 Update header styling:
```typescript
// Header background
theme === Theme.YOUR_THEME ? "border-color bg-color backdrop-blur-sm"

// Title text color
theme === Theme.YOUR_THEME ? "text-your-color"

// Icon render
{theme === Theme.YOUR_THEME && <YourIcon className="w-7 h-7 text-color" />}

// Title style
theme === Theme.YOUR_THEME ? "font-semibold bg-gradient-to-r from-color1 to-color2 bg-clip-text text-transparent"

// Badge style
theme === Theme.YOUR_THEME ? "your-theme-badge"

// Button styles
theme === Theme.YOUR_THEME ? "text-color hover:text-hover-color hover:bg-hover-bg"

// Kbd styles
theme === Theme.YOUR_THEME ? "text-color bg-bg border border-border rounded"
```

---

## Step 8: Update Dashboard Actions
**File:** `components/dashboard-actions.tsx`

### 8.1 Import icon:
```typescript
import { YourIcon } from "lucide-react";
```

### 8.2 Add theme action buttons in `getActions()`:
```typescript
if (theme === Theme.YOUR_THEME) {
  return [
    {
      id: "ai-fill",
      label: "Theme Fill",
      icon: YourIcon,
      onClick: onAIFillAll,
      className: "your-theme-btn-primary text-white border-none",
    },
    // ... other buttons with theme-specific styling
  ];
}
```

---

## Step 9: Update Dashboard Mobile Actions
**File:** `components/dashboard-mobile-actions.tsx`

### 9.1 Import icon:
```typescript
import { YourIcon } from "lucide-react";
```

### 9.2 Add theme actions in `getActions()`:
```typescript
if (theme === Theme.YOUR_THEME) {
  return [
    {
      id: "ai-fill",
      icon: YourIcon,
      onClick: onAIFillAll,
      className: "your-theme-btn-primary active:opacity-80",
      iconColor: "text-white",
    },
    // ... other buttons
  ];
}
```

### 9.3 Update container styling:
```typescript
theme === Theme.YOUR_THEME ? "bg-your-bg border-your-border"
```

---

## Step 10: Update Tickets Table
**File:** `components/tickets-table.tsx`

Update all theme conditionals:
- Details button styling
- Table container styling
- Table header styling
- Table row styling
- Table cell styling
- Mobile card styling

Pattern:
```typescript
theme === Theme.YOUR_THEME ? "your-theme-specific-classes"
```

---

## Step 11: Create Scene Component (Optional)
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

## Step 12: Create Decoration Component (Optional)
**File:** `components/your-decoration.tsx`

```typescript
"use client";

export function YourDecoration() {
  return (
    <div className="fixed bottom-8 right-8 z-50 pointer-events-none">
      {/* Your animated decoration */}
    </div>
  );
}
```

---

## Verification Checklist

- [x] Theme appears in theme selector dropdown
- [x] Theme persists after page refresh (localStorage)
- [x] Body background and colors apply correctly
- [x] Header styling (icon, title, badge, buttons)
- [x] Action buttons have correct theme styling
- [x] Table styling (header, rows, cells)
- [x] Mobile view styling
- [x] Input fields have theme colors
- [x] Links have theme colors
- [x] Scrollbar has theme styling
- [x] Scene/decorations render (if applicable)
- [x] No TypeScript errors (`npx tsc --noEmit`)
- [x] No console errors in browser

---

## Files Changed Summary

| File | Purpose |
|------|---------|
| `enums/theme.enum.ts` | Add enum value |
| `lib/constants.ts` | Add theme metadata |
| `lib/types/index.ts` | Update type union |
| `lib/stores/theme-store.ts` | Update localStorage validation |
| `app/globals.css` | Add CSS styles |
| `components/dashboard-layout.tsx` | Add scene + body class |
| `components/dashboard-header.tsx` | Header styling |
| `components/dashboard-actions.tsx` | Action buttons |
| `components/dashboard-mobile-actions.tsx` | Mobile buttons |
| `components/tickets-table.tsx` | Table styling |
| `components/your-theme-scene.tsx` | (New) Background effects |
| `components/your-decoration.tsx` | (New) Floating decoration |
| `public/assets/clash/background.png` | (New) Clash theme background |
| `lib/theme/theme-config.ts` | Add Clash theme config |
