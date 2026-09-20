# Studio Dashboard UI/UX Overhaul — Batch 4 Design Document

Date: 2026-09-20  
Surfaces: Digital Cards (`/studio/cards/*`), Social Snapshots (`/studio/snapshot/*`), Shared Creative Navigation (`StudioTabs.tsx`)  
Scope: Batch 4 (Creative Tools & Studio Navigation Cohesion)  
Repo: `the_monkeys`  

---

## 1. Overview & Goals

Batch 4 focuses on the Creative Tools within Monkeys Studio:
1. **Studio Route Cohesion**:
   - Eliminate navigation leaks where creative tools inside `/studio/...` link out to root-level `/cards` and `/snapshot` routes.
   - Update `StudioTabs.tsx` to detect `/studio` context so switching between "Image template", "X screenshot", and "Business card" remains within the `/studio` shell.
2. **Digital Cards Polish (`/studio/cards/*`)**:
   - Elevate `CardGallery.tsx` to enterprise SaaS standards:
     - Always-accessible action controls on mobile touch devices (removing the `opacity-0 group-hover:opacity-100` trap).
     - Card preview tiles with template and theme badges, updated timestamp, and vCard quick download.
     - Ensure links to edit/create point to `/studio/cards/[cardId]` and `/studio/cards/new`.
3. **Social Snapshots Polish (`/studio/snapshot/*`)**:
   - Elevate post picker (`/studio/snapshot/page.tsx`):
     - Hero card for "Start from scratch" with clear call to action pointing to `/studio/snapshot/new`.
     - Responsive post cards linking to `/studio/snapshot/[blogId]`.
     - Clear loading skeletons and empty states.
4. **Editor Canvases (`/studio/cards/[cardId]`, `/studio/snapshot/[blogId]`, `/studio/snapshot/new`)**:
   - Ensure back links return to `/studio/cards` and `/studio/snapshot`.
   - Preserve existing card editor and snapshot studio capabilities.

---

## 2. Component Architecture & Changes

### 2.1. Shared Studio Creative Tabs (`src/components/StudioTabs.tsx`)
- Detect whether the current route starts with `/studio`:
  - If inside `/studio`:
    - `template`: `/studio/snapshot/new?view=template`
    - `x`: `/studio/snapshot/new?view=x`
    - `card`: `/studio/cards`
  - If outside `/studio`:
    - `template`: `/snapshot/new?view=template`
    - `x`: `/snapshot/new?view=x`
    - `card`: `/cards`

### 2.2. Card Gallery Component (`src/features/cards/components/CardGallery.tsx`)
- Props: add optional `studioMode?: boolean` (defaults to true when rendered in studio).
- Route links:
  - Create: `studioMode ? '/studio/cards/new' : '/cards/new'`
  - Edit: `studioMode ? '/studio/cards/' + card.id : '/cards/' + card.id`
- Mobile Ergonomics:
  - Responsive action row with `opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity` so buttons are always visible and clickable on touch devices.
  - Template/theme pill badge, formatted date, and quick action buttons (`Edit`, `Duplicate`, `Delete`).

### 2.3. Snapshot Post Picker (`src/app/studio/snapshot/page.tsx`)
- Internal Links:
  - "Start from scratch" links to `/studio/snapshot/new`.
  - Blog cards link to `/studio/snapshot/[blogId]`.
  - Sign-in and empty states styled with Studio design tokens.

### 2.4. Card & Snapshot Detail Pages
- `apps/the_monkeys/src/app/studio/cards/[cardId]/page.tsx`:
  - Back link points to `/studio/cards`.
- `apps/the_monkeys/src/app/studio/snapshot/[blogId]/page.tsx`:
  - Back link points to `/studio/snapshot`.

---

## 3. Verification Plan

### 3.1. Automated Unit Tests
- Create `apps/the_monkeys/src/features/cards/components/CardGallery.test.tsx`:
  - Verify card listing and creation button links.
  - Verify duplicate and delete triggers.
  - Verify empty and loading states.
- Create `apps/the_monkeys/src/components/StudioTabs.test.tsx`:
  - Verify studio prefix detection for routes.

### 3.2. Studio Suite Regression
- Run `npm test src/features/studio` and `npm test src/app/studio/StudioPages.test.tsx`.
- Verify 100% pass rate.

