# Studio Dashboard Overhaul: Batch 3 (Calendar, Queue & History) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the publishing operations surfaces (`/studio/calendar`, `/studio/queue`, and `/studio/history`), replacing the barebones history stub with an enterprise-grade publishing audit trail, and polishing calendar and queue views with Linear/Vercel SaaS aesthetics and 100% mobile responsiveness.

**Architecture:** 
- Implement dedicated `HistoryView.tsx` in `features/studio/history` with KPI metric counters, multi-dimensional search & filtering (status, platform, query), desktop table + mobile cards dual layout, and retry/edit/delete mutations.
- Refine `QueueView`, `QueueHeader`, and `QueueItem` with upgraded visual polish and touch-friendly drag handles.
- Refine `CalendarView`, `CalendarToolbar`, and `MonthGrid` for seamless responsive navigation and theme consistency.

**Tech Stack:** Next.js 14, React 18, Tailwind CSS, `@the-monkeys/ui`, `@remixicon/react`, `date-fns`, Vitest, React Testing Library.

**Spec:** [docs/superpowers/specs/2026-09-20-studio-batch-3-calendar-queue-history-design.md](file:///home/gautam/Desktop/Monkeys/the_monkeys/docs/superpowers/specs/2026-09-20-studio-batch-3-calendar-queue-history-design.md)

## Global Constraints
- Preserve all existing query hooks (`useSocialPosts`, `useSocialQueue`, `useSocialCalendar`, `useSocialPostMutations`).
- Maintain zero regressions across existing tests in `CalendarView.test.tsx`, `MonthGrid.test.tsx`, `WeekGrid.test.tsx`, and `QueueView.test.tsx`.
- Support responsive breakpoints: single column cards on mobile (`< 768px`), table / grid on tablet and desktop (`>= 768px`).
- Retain existing design tokens and color scheme (brand orange `#F05627`, background light/dark, border light/dark).

---

### Task 1: Enterprise Publishing History View (`/studio/history`)

**Files:**
- Create: `apps/the_monkeys/src/features/studio/history/HistoryView.tsx`
- Create: `apps/the_monkeys/src/features/studio/history/HistoryView.test.tsx`
- Modify: `apps/the_monkeys/src/app/studio/history/page.tsx`

**Interfaces:**
- Consumes:
  - `useSocialPosts()`: `{ data: { items?: SocialPost[] } | SocialPost[], isLoading, isError, refetch }`
  - `useSocialPostMutations()`: `{ publishNow, deleteDraft }`
- Produces:
  - `HistoryView({ className }: { className?: string }): JSX.Element`

- [ ] **Step 1: Write the failing unit tests for HistoryView**
  Create `apps/the_monkeys/src/features/studio/history/HistoryView.test.tsx`:
  - Test KPI calculations (Published count, Failed count, Success Rate %, Drafts count).
  - Test search filter by post content text.
  - Test status filter pills (`All`, `Published`, `Failed`, `Draft`).
  - Test platform filter chips/select (`X`, `LinkedIn`, etc.).
  - Test retry failed post calling `publishNow.mutateAsync`.
  - Test delete post calling `deleteDraft.mutateAsync`.
  - Test loading skeleton and empty states.

- [ ] **Step 2: Run test to verify it fails**
  Run: `npm test src/features/studio/history/HistoryView.test.tsx`
  Expected: FAIL (module `HistoryView` not found).

- [ ] **Step 3: Implement HistoryView component**
  Create `apps/the_monkeys/src/features/studio/history/HistoryView.tsx`:
  - KPI summary bar with Published, Failed, Success Rate %, and Total Drafts.
  - Filter toolbar: search input, status segmented buttons, platform filter pills, and sort toggle.
  - Responsive layout: Desktop table (`md:table`) and Mobile cards (`md:hidden`).
  - Status badges: `Published` (green), `Failed` (red with error note), `Draft` (gray).
  - Platform badges: X, LinkedIn, Instagram, Facebook, YouTube, TikTok.
  - Action buttons: Retry/Publish Now, Edit in Composer (`/studio/compose/[id]`), Delete.
  - Skeleton loading state and contextual empty states.

- [ ] **Step 4: Update page.tsx to render HistoryView**
  Update `apps/the_monkeys/src/app/studio/history/page.tsx` to render `<HistoryView />`.

- [ ] **Step 5: Run tests to verify they pass**
  Run: `npm test src/features/studio/history/HistoryView.test.tsx`
  Expected: PASS.

---

### Task 2: Polish Queue View (`/studio/queue`) for Desktop & Mobile Ergonomics

**Files:**
- Modify: `apps/the_monkeys/src/features/studio/queue/QueueHeader.tsx`
- Modify: `apps/the_monkeys/src/features/studio/queue/QueueItem.tsx`
- Modify: `apps/the_monkeys/src/features/studio/queue/QueueView.tsx`

**Interfaces:**
- Consumes:
  - `useSocialQueue(100)`
  - `useSocialPostMutations()`
- Produces:
  - Polished `QueueView`, `QueueHeader`, `QueueItem` components.

- [ ] **Step 1: Inspect and refine QueueHeader**
  - Update `QueueHeader.tsx` with high-polish badge styling, dynamic subtitle, and "+ Add to Queue" CTA linking to `/studio/compose`.

- [ ] **Step 2: Inspect and refine QueueItem**
  - Update `QueueItem.tsx`:
    - Refine drag handle with `cursor-grab active:cursor-grabbing` and `touch-action: none`.
    - Enhance sequence badge (`#1`, `#2`).
    - Enhance reorder buttons with accessible labels and hover treatments.
    - Refine platform badges and formatted scheduled timestamp with timezone pill.

- [ ] **Step 3: Verify QueueView unit tests pass with zero regressions**
  Run: `npm test src/features/studio/queue/QueueView.test.tsx`
  Expected: 11 / 11 tests PASS.

---

### Task 3: Polish Calendar View (`/studio/calendar`) for Desktop & Mobile Ergonomics

**Files:**
- Modify: `apps/the_monkeys/src/features/studio/calendar/CalendarToolbar.tsx`
- Modify: `apps/the_monkeys/src/features/studio/calendar/CalendarView.tsx`
- Modify: `apps/the_monkeys/src/features/studio/calendar/MonthGrid.tsx`

**Interfaces:**
- Consumes:
  - `useSocialCalendar({ from, to, page_size })`
- Produces:
  - Polished `CalendarView`, `CalendarToolbar`, `MonthGrid` components.

- [ ] **Step 1: Refine CalendarToolbar**
  - Polish heading, segmented Month/Week toggle, Prev/Today/Next controls, timezone pill, and "+ New Post" button.

- [ ] **Step 2: Refine MonthGrid & CalendarDayCell**
  - Ensure mobile day cells maintain touch targets (`min-h-[44px]`).
  - Polish post chip indicators and selection borders.

- [ ] **Step 3: Verify all Calendar unit tests pass with zero regressions**
  Run: `npm test src/features/studio/calendar`
  Expected: 35 / 35 tests PASS (`CalendarView.test.tsx`, `MonthGrid.test.tsx`, `WeekGrid.test.tsx`).

---

### Task 4: Comprehensive Studio Suite Verification

**Files:**
- Test all studio features and pages across Batches 1, 2, and 3.

- [ ] **Step 1: Run all feature tests in src/features/studio**
  Run: `npm test src/features/studio`
  Expected: All tests pass.

- [ ] **Step 2: Run all Studio page tests in src/app/studio**
  Run: `npm test src/app/studio/StudioPages.test.tsx`
  Expected: All tests pass.
