# Studio live-preview frame — design

Date: 2026-09-06  
Surfaces: Image template, X screenshot, Business card  
Routes: `/snapshot/new`, `/cards/new`

## Problem

There was no UI spec. Layout was patched against screenshots. That produced three failures on a real iPhone:

1. Sticky 4:5 well filled the screen and cropped the template.
2. Flex sibling export icons + `min-w-0` collapsed the canvas to a 1px sliver on WebKit.
3. Forced `h-80` / `aspect-[1080/1350]` + scale-by-min(width, height) letterboxed every template inside the border. The canvas did not fill the well. Square, landscape, story, carousel, and card templates all picked up empty gutters and a lying frame.

Cursor Chromium at 390×844 is not Safari. It cannot close an iPhone bug.

## Goal

One frame rule for every template, every aspect, Chrome/Safari/Firefox, phone and desktop:

- The rounded inset border wraps the **actual scaled canvas**, not an empty box.
- The template fills that inner area (no side/top letterbox inside the well).
- Sticky preview on phones does not eat the form.
- Export icons never steal width from the canvas.
- Export still reads native px via the existing ref / `html-to-image` pipeline.

## Non-goals

- Redesigning templates, themes, or export output.
- Changing sticky-on-desktop (`md:` / `lg:` column layout).
- Claiming iPhone Safari is verified from Cursor’s browser.

## Template sizes (must all look correct)

Image templates (native px):

| Template            | Size        | Ratio    |
| ------------------- | ----------- | -------- |
| Editorial Portrait  | 1080×1350   | 4:5      |
| Editorial Serif     | 1080×1350   | 4:5      |
| Quote Card          | 1080×1080   | 1:1      |
| Thread Cover        | 1080×1080   | 1:1      |
| Instagram Carousel  | 3240×1350   | 12:5     |
| X Share             | 1200×675    | 16:9     |
| LinkedIn Share      | 1200×627    | ~1.91:1  |
| Story Vertical      | 1080×1920   | 9:16     |

X screenshot canvas: `1080×1080`, `1080×1350`, `1200×675` (user picker).  
Business cards: **1050×600** (all six card templates).

A well locked to 4:5 or to `h-80` is invalid for this table.

## Approaches considered

**A — Mobile-first well follows canvas; scale by width only (recommended)**  
Restore the shipping rule from `4fd068c`. Base (phone) well is `w-full` of the studio column. `scale = min(1, innerWidth / nativeWidth)`. Height is `nativeHeight * scale`. Padding `p-2 sm:p-4` + `rounded-2xl border` hug that rectangle on every side (no letterbox, no second frame). Overlay export icons (no flex sibling). Tablet/desktop only add max-width caps.

**B — Fixed 4:5 / fixed height well, letterbox templates**  
Current broken state. Rejected.

**C — Stretch or crop every template into one box**  
Fills the well but destroys template layout. Rejected.

Chosen: **A**.

## Layout

### Shared well

Same visual for Image, X, and Card. Mobile-first Tailwind (phone first, then tablet, then desktop):

- `mx-auto w-full sm:max-w-[420px] md:max-w-[520px] lg:max-w-[560px]`
- `box-border rounded-2xl border p-2 sm:p-4`
- **No** `h-80`, **no** `aspect-[1080/1350]`, **no** `overflow-hidden` on the well (clip only the scaled canvas)
- Even inset padding on all sides so the theme fill meets the well equally; switching theme must not leave a gutter

Inner stage is 100% of the content box. Scale uses that width only. The well’s used height is padding + scaled canvas height. Switching template/aspect/theme changes well height, not a locked box.

On a ~390px phone (full column, `p-2`):

- 4:5 → canvas width ≈ inner well, height ≈ width × 1.25
- 1:1 → square
- 16:9 / card → short landscape
- 9:16 story → tallest; still full canvas, no gutters

### Sticky

Keep `display: contents` on the mobile preview `<section>` so sticky and form share a parent.

`StudioPreviewSticky`: `w-full`, sticky under `--app-header-h`. Mobile export icons sit **beside** the well (`w-10 shrink-0`), not on the canvas. The well is `w-[calc(100%-3rem)]` so Safari never gets `flex-1` + `min-w-0`. Never overlay icons on the image.

### Scale math (all three previews)

```
scale = min(1, availableWidth / nativeWidth)
scaledW = nativeWidth * scale
scaledH = nativeHeight * scale
```

Do not use `clientHeight` to shrink. That is what letterboxed templates inside the border.

If `availableWidth` is 0 (WebKit first layout), retry on `requestAnimationFrame` up to 12 times, then `ResizeObserver`.

### iOS / WebKit bans

Do not use on the well or canvas:

- `w-auto` with children `width: 100%` (cyclic % → 0px)
- Tailwind `min()` / `svh` height as the only size
- Flex sibling icon column
- `absolute inset-0` on the scaled canvas

Use real classes: `w-full sm:max-w-[420px] md:max-w-[520px] lg:max-w-[560px]`. Inline `width: '100%'` on the well is allowed as a WebKit belt.

## Files

- `apps/the_monkeys/src/components/StudioPreviewSticky.tsx` — overlay icons; `studioPreviewFitClass` = width cap only
- `apps/the_monkeys/src/features/snapshot/components/SnapshotPreview.tsx` — scale by width
- `apps/the_monkeys/src/features/snapshot/components/SnapshotStudio.tsx` — well classes; X scale by width
- `apps/the_monkeys/src/features/cards/components/CardPreview.tsx` — scale by width
- `apps/the_monkeys/src/features/cards/components/CardStudio.tsx` — same well classes
- New: `apps/the_monkeys/src/features/snapshot/lib/fitPreviewScale.ts` — shared, unit-tested math

## Verification (must all pass before commit or push)

Cursor browser, Superpowers workflow. Do **not** commit until every viewport below passes. Chromium is not iPhone Safari; after push the user still hard-refreshes Netlify PR 705 on a real iPhone.

| Viewport | Size | Must pass |
| --- | --- | --- |
| Android phone | 360×800 | Well is full column width; canvas fills inner well; even inset border; overlay icons |
| iPhone | 390×844 | Same. Author row visible on 4:5. No 1px sliver |
| Tablet | 768×1024 | Well ≤ 520px, centered; canvas fills inner well |
| Desktop | 1440×900 | Well ≤ 560px; two-column studio |

On **each** viewport, check Image 4:5, Quote 1:1, X 4:5, X 16:9. Switch at least one theme. Fail if gutters appear inside the well or the well border does not hug the canvas.

## Out of scope until spec change

Changing the sm/md/lg max-width numbers. If story 9:16 is still too tall on a phone after A, shrink max-width for that aspect in a follow-up — do not force height.
