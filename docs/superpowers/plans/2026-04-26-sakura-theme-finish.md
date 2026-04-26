# Sakura Theme Finish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the Sakura theme so it is selectable, visually coherent, and usable end to end without external asset downloads.

**Architecture:** Build the theme with repo-native code: a dedicated Sakura scene component, Sakura-specific CSS utilities and body overrides, and theme-aware button/table styles. Keep existing theme architecture intact so higher-fidelity bitmap assets can replace the placeholders later without rewriting the theme plumbing.

**Tech Stack:** Next.js, React, Tailwind utility classes, global CSS theme overrides, Vitest

---

### Task 1: Lock the implementation surface

**Files:**
- Modify: `components/dashboard-layout.tsx`
- Modify: `components/dashboard-header.tsx`
- Modify: `components/dashboard-content.tsx`
- Modify: `components/dashboard-tab-bar.tsx`
- Modify: `components/tickets/theme-styles.ts`

- [ ] Confirm which components still assume dark-theme colors or scenes and add Sakura-specific hooks where needed.
- [ ] Keep the write scope narrow: use the existing `ThemeConfig` system and body class system instead of inventing a parallel Sakura-only path.

### Task 2: Add the Sakura scene layer

**Files:**
- Create: `components/sakura-scene.tsx`
- Modify: `components/dashboard-layout.tsx`
- Modify: `app/globals.css`

- [ ] Add a lightweight scene component that renders corner blossoms, drifting petals, and a low-contrast mountain/pagoda silhouette.
- [ ] Register the scene in the theme scene map.
- [ ] Add Sakura-specific animation and utility classes in `app/globals.css`.

### Task 3: Finish Sakura theme styling

**Files:**
- Modify: `lib/theme/themes/sakura.ts`
- Modify: `app/globals.css`
- Modify: `components/tickets/theme-styles.ts`
- Modify: `components/dashboard-tab-bar.tsx`
- Modify: `components/dashboard-content.tsx`

- [ ] Refine the Sakura theme config so header, actions, and mobile controls match the light pastel direction.
- [ ] Add body-level Sakura overrides for links, table rows, inputs, cards, and scrollbars.
- [ ] Add Sakura button and table theme mappings so reusable shared components render consistently.
- [ ] Fix any controls that still hardcode white-on-dark styling.

### Task 4: Verify the finished theme behavior

**Files:**
- Modify: `lib/theme/__tests__/theme-config.test.ts`
- Modify: `lib/types/__tests__/theme.test.ts`

- [ ] Keep the existing Sakura registration tests green.
- [ ] Run focused tests and targeted lint on the touched files.
- [ ] Do a final sanity scan for any remaining theme assumptions that would visually break Sakura.
