# Design Specifications - Linear-Inspired Jira Handover Tool

## Color Palette

### Light Mode
```css
Background:        #FFFFFF (Pure White)
Foreground:        #171717 (Almost Black)
Card:              #FFFFFF
Elevated:          #FAFAFA

Primary:           #171717 (Dark)
Secondary:         #F5F5F5 (Light Gray)
Muted:             #F5F5F5
Muted Foreground:  #737373 (Mid Gray)

Border:            #E3E3E3
Border Subtle:     #EDEDED
Hover:             #F7F7F7

Ring (Focus):      #171717
```

### Dark Mode
```css
Background:        #111111 (True Dark)
Foreground:        #FAFAFA (Off White)
Card:              #141414
Elevated:          #1A1A1A

Primary:           #FAFAFA (White)
Secondary:         #212121 (Dark Gray)
Muted:             #212121
Muted Foreground:  #999999 (Light Gray)

Border:            #2A2A2A
Border Subtle:     #1F1F1F
Hover:             #262626

Ring (Focus):      #FAFAFA
```

## Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
font-feature-settings: "rlig" 1, "calt" 1, "ss01" 1;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

### Font Sizes
```css
xs:   12px / 0.75rem   (Table cells, labels)
sm:   14px / 0.875rem  (Body text)
base: 16px / 1rem      (Default)
lg:   18px / 1.125rem  (Section headers)
xl:   20px / 1.25rem   (Page titles)
```

### Font Weights
```css
Regular:    400  (Body text, inputs)
Medium:     500  (Labels, buttons)
Semibold:   600  (Headings)
Bold:       700  (Emphasis)
```

## Spacing Scale (8px base)

```css
0.5  → 4px
1    → 8px
1.5  → 12px
2    → 16px
3    → 24px
4    → 32px
6    → 48px
8    → 64px
```

## Component Specifications

### Buttons
```css
Height:           36px (h-9)
Padding:          16px horizontal
Border Radius:    6px (rounded-md)
Font Size:        14px (text-sm)
Font Weight:      500 (medium)
Transition:       150ms ease

Small:
  Height:         32px (h-8)
  Padding:        12px horizontal
  Font Size:      12px (text-xs)

Icon:
  Size:           36x36px (h-9 w-9)
  Padding:        0
```

### Inputs
```css
Height:           36px (h-9)
Padding:          12px horizontal, 8px vertical
Border:           1px solid
Border Radius:    6px (rounded-md)
Font Size:        14px (text-sm)
Background:       transparent

Focus:
  Ring Width:     1.5px
  Ring Color:     --ring
```

### Table
```css
Header:
  Height:         36px (h-9)
  Padding:        12px horizontal
  Font Size:      12px (text-xs)
  Font Weight:    500
  Text Transform: uppercase
  Letter Spacing: 0.05em

Row:
  Height:         auto (py-2)
  Padding:        8px vertical, 12px horizontal
  Border:         1px solid (bottom)
  Hover BG:       muted/20

Cell:
  Font Size:      12px (text-xs)
  Padding:        12px horizontal
```

### Sidebar
```css
Collapsed:
  Width:          56px (w-14)

Expanded:
  Width:          224px (w-56)

Transition:       180ms ease-out

Nav Item:
  Height:         36px (h-9)
  Padding:        12px
  Border Radius:  6px (rounded-md)
  Font Size:      14px (text-sm)
```

### Header
```css
Height:           52px (fixed)
Padding:          24px horizontal
Border:           1px solid (bottom)
Position:         sticky top-0
```

### Dialogs
```css
Width:            512px (max-w-lg)
Padding:          24px (p-6)
Border:           1px solid
Border Radius:    8px (rounded-lg)
Shadow:           2xl
Backdrop:         bg-black/60 + backdrop-blur-sm

Title:
  Font Size:      16px (text-base)
  Font Weight:    600
  
Description:
  Font Size:      14px (text-sm)
  Color:          muted-foreground
```

### Command Palette
```css
Width:            512px (max-w-lg)
Max Height:       300px
Border:           1px solid
Border Radius:    8px (rounded-lg)

Input:
  Height:         44px (h-11)
  Padding:        12px

Item:
  Height:         auto (py-1.5)
  Padding:        8px horizontal
  Border Radius:  4px (rounded-sm)
  Font Size:      14px (text-sm)
```

## Borders & Elevation

### Border Styles
```css
Standard:         1px solid border-border
Subtle:           1px solid border-border/50
Table:            1px solid border-border/30

Border Radius:
  sm:   4px   (rounded-sm)
  md:   6px   (rounded-md)
  lg:   8px   (rounded-lg)
  full: 9999px (rounded-full)
```

### Shadows
```css
sm:   0 1px 2px 0 rgb(0 0 0 / 0.05)
md:   0 4px 6px -1px rgb(0 0 0 / 0.1)
lg:   0 10px 15px -3px rgb(0 0 0 / 0.1)
xl:   0 20px 25px -5px rgb(0 0 0 / 0.1)
2xl:  0 25px 50px -12px rgb(0 0 0 / 0.25)
```

## Animations & Transitions

### Duration
```css
Fast:     100ms
Default:  150ms
Medium:   180ms
Slow:     300ms
```

### Easing
```css
Default:  cubic-bezier(0.4, 0, 0.2, 1)  /* ease-out */
Bounce:   cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### Common Transitions
```css
/* Colors */
transition: background-color 150ms, border-color 150ms, color 150ms;

/* Transform */
transition: transform 150ms;

/* All (for theme changes) */
transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
```

## Interactive States

### Hover
```css
Background: +2% brightness
Opacity: Elements: 0.7 → 1.0
Duration: 150ms
```

### Focus
```css
Ring Width:  1.5px
Ring Offset: 0px
Outline:     none
```

### Active
```css
Transform:   scale(0.98)
Duration:    100ms
```

### Disabled
```css
Opacity:     0.5
Cursor:      not-allowed
Pointer Events: none
```

## Scrollbars

### Webkit Styling
```css
Width:            6px
Track:            transparent
Thumb:            border-border
Thumb Hover:      muted-foreground/30
Border Radius:    3px
```

## Accessibility

### Focus Indicators
- Always visible focus rings (1.5px)
- High contrast in both modes
- Skip to content links (future)

### Color Contrast
- WCAG AA compliant
- 4.5:1 minimum for text
- 3:1 for large text

### Keyboard Navigation
- Tab order follows visual layout
- Arrow keys for table navigation (future)
- Enter/Space for actions
- Escape to close modals

## Mobile Responsive

### Breakpoints
```css
sm:  640px   (Small tablets)
md:  768px   (Tablets)
lg:  1024px  (Small laptops)
xl:  1280px  (Desktops)
2xl: 1536px  (Large screens)
```

### Mobile Adjustments
- Sidebar: Collapsed by default
- Header: Reduced padding (16px)
- Buttons: Icon-only on small screens
- Table: Horizontal scroll
- Touch targets: Minimum 44px

---

**Design Token System**: All values are defined as CSS custom properties for easy theming and maintenance.
