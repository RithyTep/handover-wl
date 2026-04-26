# Sakura Theme Asset Manifest

Prepared for `jira-slack-integration` on `2026-04-26`.

This document defines the exact asset set to collect before implementing a new `sakura` theme in this repo. It follows the current project conventions:

- Theme art lives in `public/assets/<theme>/...`
- Theme cursors live in `public/cursors/...`
- Theme-specific header and action icons can use `public/icons/<theme>/...`
- General product/action icons should continue using `lucide-react`

## Goal

Match the visual direction from the provided Sakura references:

- soft watercolor pink background
- edge-only floral decoration
- floating petal accents
- clean, readable dashboard UI
- light-theme first, with minimal ornamental noise in the center content area

## Recommended Folder Layout

```text
public/
  assets/
    sakura/
      background/
        sakura-dashboard-bg.jpg
        sakura-paper-noise.png
      overlays/
        branch-top-right.png
        branch-bottom-left.png
        petals-scatter-1.png
        petals-scatter-2.png
      scene/
        pagoda.svg
        mountain.svg
      preview/
        sakura-theme-cover.png
  cursors/
    sakura-cursor.svg
    sakura-pointer.svg
  icons/
    sakura/
      blossom.svg
      petal.svg
      branch.svg
      fan.svg
      stamp.svg
      kbd-sakura.svg
```

## Required Assets

### 1. Background Base

Required for the full-page theme background.

Target file:

- `public/assets/sakura/background/sakura-dashboard-bg.jpg`

Selection rule:

- watercolor or very soft painted sakura landscape
- large negative space in center
- decorations pushed to corners and lower edge
- avoid busy blossoms behind table rows and inputs

Suggested sources:

- Pixabay: https://pixabay.com/vectors/cherry-blossom-sakura-spring-10193138/
- Envato Elements: https://elements.envato.com/sakura-gradient-texture-background-9LLFYU2
- Freepik search: https://www.freepik.com/free-photos-vectors/cherry-blossom-watercolor-border

Implementation note:

- Prefer one flattened background image rather than composing five large images in CSS.

### 2. Noise / Paper Texture

Required to avoid flat digital gradients.

Target file:

- `public/assets/sakura/background/sakura-paper-noise.png`

Suggested sources:

- Transparent Textures paper fibers: https://www.transparenttextures.com/paper-fibers.html
- Transparent Textures noisy: https://www.transparenttextures.com/noisy.html

Implementation note:

- Use as a low-opacity overlay above the base background.
- Keep opacity around `0.04` to `0.10`.

### 3. Corner Branch Overlay: Top Right

Required to recreate the reference framing.

Target file:

- `public/assets/sakura/overlays/branch-top-right.png`

Selection rule:

- transparent PNG or SVG
- branch should taper inward from top-right edge
- blossom density should stay near edge, not center

Suggested sources:

- Vecteezy cherry branch search: https://www.vecteezy.com/free-vector/cherry-branch
- Vecteezy watercolor branch example: https://www.vecteezy.com/vector-art/12954719-branch-of-cherry-blossom-illustration-watercolor-painting-sakura-isolated-on-white-background-japanese-flower
- Pixabay branch vector: https://pixabay.com/vectors/blossoms-branch-cherry-floral-2026207/

### 4. Corner Branch Overlay: Bottom Left

Required for lower-left balance.

Target file:

- `public/assets/sakura/overlays/branch-bottom-left.png`

Selection rule:

- transparent PNG or SVG
- branch rises diagonally from lower-left corner
- should feel lighter than the top-right branch

Suggested sources:

- Reuse the same branch source as above if the asset can be mirrored cleanly.
- If not, source a second branch from:
  https://pixabay.com/vectors/search/cherry%20blossom%20branch/

### 5. Petal Overlay Pack

Required for ambient motion and small decorative placements.

Target files:

- `public/assets/sakura/overlays/petals-scatter-1.png`
- `public/assets/sakura/overlays/petals-scatter-2.png`

Selection rule:

- transparent PNG
- isolated petals or sparse cluster
- no heavy bloom bundles

Suggested sources:

- Vecteezy petals PNG search: https://www.vecteezy.com/free-png/cherry-blossom-petals
- Example petals PNG: https://www.vecteezy.com/png/55062515-delicate-cherry-blossom-petals-on-transparent-background
- SVG Repo petal icon: https://www.svgrepo.com/svg/481054/cherry-blossom-petal

Implementation note:

- One asset should be for static background scatter.
- One asset should be for optional animation.

## Strongly Recommended Assets

### 6. Sakura Theme Glyph Set

These are the only custom decorative icons needed. Keep standard UI actions on `lucide-react`.

Target files:

- `public/icons/sakura/blossom.svg`
- `public/icons/sakura/petal.svg`
- `public/icons/sakura/branch.svg`
- `public/icons/sakura/fan.svg`
- `public/icons/sakura/stamp.svg`
- `public/icons/sakura/kbd-sakura.svg`

Suggested sources:

- SVG Repo cherry blossom: https://www.svgrepo.com/svg/138566/cherry-blossom
- SVG Repo sakura: https://www.svgrepo.com/svg/9753981/Sakura
- SVG Repo Japanese cherry blossom: https://www.svgrepo.com/svg/10664905/japanese-cherry-blossom
- Icons8 cherry blossom: https://icons8.com/icon/0poZ2aC6dx-6/cherry-blossom

Recommended mapping:

- logo icon: `blossom.svg`
- nav icon or feedback icon: `fan.svg`
- changelog icon: `branch.svg`
- keyboard hint icon: `kbd-sakura.svg`
- AI Fill button: `blossom.svg`
- Fill button: `petal.svg`
- Clear button: `stamp.svg`
- Save button: `fan.svg`
- Send button: `branch.svg`

### 7. Scene Accent Icons

Optional but useful for small corner details matching the reference.

Target files:

- `public/assets/sakura/scene/pagoda.svg`
- `public/assets/sakura/scene/mountain.svg`

Suggested sources:

- SVG Repo pagoda: https://www.svgrepo.com/svg/2092/pagoda
- SVG Repo mountain: https://www.svgrepo.com/svg/2207/mountain

Implementation note:

- Use sparingly. One lower-right scene cluster is enough.

## Optional Assets

### 8. Sakura Cursor Pair

Only add this if the cursor remains simple and readable.

Target files:

- `public/cursors/sakura-cursor.svg`
- `public/cursors/sakura-pointer.svg`

Rule:

- do not use a novelty cursor with petals, sparkles, or thick glow
- use a normal arrow silhouette with a subtle sakura tint

Recommendation:

- If no clean cursor is available, skip custom cursors for Sakura.

### 9. Theme Preview Cover

Useful for theme selector UI later.

Target file:

- `public/assets/sakura/preview/sakura-theme-cover.png`

Rule:

- export a 16:9 preview crop from the final background composition

## Asset Quality Rules

- Prefer `SVG` for icons and scene marks.
- Prefer `PNG` for transparent painted overlays.
- Prefer `JPG` or compressed `PNG` for the large background.
- Keep the center 55% to 65% of the background visually quiet.
- Decorations should stay on edges and corners.
- Avoid photoreal blossom photos for core UI framing. Watercolor or illustrated assets will match the references better.

## Licensing Notes

Check the license before downloading into the repo.

- Pixabay assets are generally easy to use, but still verify the asset page.
- SVG Repo listings used above show `CC0 License` on the referenced pages.
- Vecteezy free downloads may require attribution unless you have Pro.
- Freepik licensing depends on the specific asset and plan.
- Envato Elements requires an active subscription and project registration.

## Minimum Collection Checklist

Collect these first:

- `1` large background image
- `1` paper or noise texture
- `2` branch overlays
- `2` petal overlays
- `5` Sakura SVG icons
- `1` pagoda SVG
- `1` mountain SVG

## Implementation Hooks In This Repo

When implementation starts, the likely touch points are:

- `enums/theme.enum.ts`
- `lib/theme/themes/index.ts`
- `lib/theme/theme-config.ts`
- `components/theme-provider.tsx`
- `app/api/theme/route.ts`
- `app/globals.css`

## Recommendation

Do not start by downloading a huge mixed bundle.

Use the minimum checklist, place everything under `public/assets/sakura` and `public/icons/sakura`, then implement the theme around those exact filenames. That will keep the Sakura theme consistent with the current repo structure and prevent asset drift.
