# Studio Dashboard Overhaul: Batch 4 (Creative Tools) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the Creative Tools surfaces (`/studio/cards/*` and `/studio/snapshot/*`) to eliminate navigation leaks, provide mobile-first touch ergonomics, and ensure seamless visual cohesion with the Monkeys Studio design system.

**Architecture:**
- Make `StudioTabs.tsx` route-aware, preserving the `/studio` URL hierarchy.
- Refine `CardGallery.tsx` and detail pages with touch-friendly actions and Studio route links (`/studio/cards/new`, `/studio/cards/[cardId]`).
- Refine `SnapshotPickerPage` and detail pages with high-contrast preview frames and `/studio/snapshot/*` route links.

**Tech Stack:** Next.js 14, React 18, Tailwind CSS, `@the-monkeys/ui`, `@remixicon/react`, Vitest, React Testing Library.

**Spec:** [docs/superpowers/specs/2026-09-20-studio-batch-4-creative-tools-design.md](file:///home/gautam/Desktop/Monkeys/the_monkeys/docs/superpowers/specs/2026-09-20-studio-batch-4-creative-tools-design.md)

## Global Constraints
- Preserve existing card creation, editing, and export functionality in `CardStudio.tsx`.
- Preserve existing snapshot image template and X screenshot generation in `SnapshotStudio.tsx`.
- Keep all internal studio links under `/studio/...`.

---

### Task 1: Route-Aware StudioTabs & Navigation Cohesion

**Files:**
- Modify: `apps/the_monkeys/src/components/StudioTabs.tsx`
- Create: `apps/the_monkeys/src/components/StudioTabs.test.tsx`

**Interfaces:**
- Consumes: `usePathname()` from `next/navigation`
- Produces: `StudioTabs` component with automatic studio route detection.

- [ ] **Step 1: Write unit tests for StudioTabs**
  Create `apps/the_monkeys/src/components/StudioTabs.test.tsx`:
  - Test that when rendered on `/studio/cards`, tab hrefs point to `/studio/snapshot/new?view=template`, `/studio/snapshot/new?view=x`, and `/studio/cards`.
  - Test that when rendered on `/cards`, tab hrefs point to `/snapshot/new?view=template`, etc.

- [ ] **Step 2: Run test to verify it fails**
  Run: `npm test src/components/StudioTabs.test.tsx`
  Expected: FAIL.

- [ ] **Step 3: Update StudioTabs.tsx**
  Implement pathname check using `usePathname()`. If `pathname?.startsWith('/studio')`, route tabs to `/studio/...`.

- [ ] **Step 4: Run test to verify it passes**
  Run: `npm test src/components/StudioTabs.test.tsx`
  Expected: PASS.

---

### Task 2: Digital Cards Polish & Touch Ergonomics (`/studio/cards/*`)

**Files:**
- Modify: `apps/the_monkeys/src/features/cards/components/CardGallery.tsx`
- Modify: `apps/the_monkeys/src/app/studio/cards/[cardId]/page.tsx`
- Create: `apps/the_monkeys/src/features/cards/components/CardGallery.test.tsx`

**Interfaces:**
- Consumes:
  - `listCards()`, `deleteCard()`, `duplicateCard()` from `features/cards/lib/cardsRemote`
- Produces:
  - Polished `CardGallery` component with touch-friendly action buttons and studio-safe links.

- [ ] **Step 1: Write unit tests for CardGallery**
  Create `apps/the_monkeys/src/features/cards/components/CardGallery.test.tsx`:
  - Test card list rendering.
  - Test "Create New" link points to `/studio/cards/new` in studio mode.
  - Test card edit link points to `/studio/cards/[cardId]`.
  - Test duplicate and delete actions.

- [ ] **Step 2: Update CardGallery.tsx and [cardId]/page.tsx**
  - Add `studioMode` prop (or auto-detect pathname).
  - Update action links to `/studio/cards/new` and `/studio/cards/[cardId]`.
  - Ensure action buttons (`Edit`, `Duplicate`, `Delete`) are always visible on touch screens (`opacity-100 sm:opacity-0 sm:group-hover:opacity-100`).
  - Update back link in `[cardId]/page.tsx` to `/studio/cards`.

- [ ] **Step 3: Run CardGallery tests**
  Run: `npm test src/features/cards/components/CardGallery.test.tsx`
  Expected: PASS.

---

### Task 3: Social Snapshots Polish & Route Cohesion (`/studio/snapshot/*`)

**Files:**
- Modify: `apps/the_monkeys/src/app/studio/snapshot/page.tsx`
- Modify: `apps/the_monkeys/src/app/studio/snapshot/[blogId]/page.tsx`

**Interfaces:**
- Consumes:
  - `useAuth()`, `useGetPublishedBlogByUsername()`
- Produces:
  - Polished `SnapshotPickerPage` with studio-safe navigation.

- [ ] **Step 1: Update studio snapshot links in page.tsx and [blogId]/page.tsx**
  - Change `/snapshot/new` to `/studio/snapshot/new`.
  - Change `/snapshot/[blogId]` to `/studio/snapshot/[blogId]`.
  - Update back link in `[blogId]/page.tsx` to `/studio/snapshot`.
  - Enhance "Start from scratch" hero card with Linear/Vercel styling and icon.

- [ ] **Step 2: Run Studio page tests to verify zero regressions**
  Run: `npm test src/app/studio/StudioPages.test.tsx`
  Expected: PASS.

---

### Task 4: Comprehensive Studio Suite Verification

- [ ] **Step 1: Run full Studio test suite**
  Run: `npm test src/features/studio` and `npm test src/app/studio`
  Expected: All tests PASS.

