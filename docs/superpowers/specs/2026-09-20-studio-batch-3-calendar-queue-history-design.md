# Studio Dashboard UI/UX Overhaul — Batch 3 Design Document

Date: 2026-09-20  
Surfaces: Calendar (`/studio/calendar`), Queue (`/studio/queue`), Publishing History (`/studio/history`)  
Scope: Batch 3 (Calendar, Queue & Publishing Operations)  
Repo: `the_monkeys`  

---

## 1. Overview & Goals

Batch 3 focuses on the operational publishing surfaces of Monkeys Studio:
1. **Calendar (`/studio/calendar`)**: Full-view scheduling calendar (Month & Week grids), day cell navigation, drag/view controls, timezone badge, and mobile day-view optimization.
2. **Queue (`/studio/queue`)**: Priority publishing queue with drag-and-drop sequencing, manual reorder buttons, platform badges, and action menus.
3. **History (`/studio/history`)**: Complete overhaul from a barebones stub into an enterprise-grade publishing audit trail with KPIs, search, filtering by status and channel, retry for failed posts, and responsive table/card layouts.

---

## 2. Architecture & Component Structure

### 2.1. History Overhaul (`src/features/studio/history/`)
Replace the temporary `StudioCollectionPage.tsx` with a dedicated `HistoryView.tsx` component hierarchy:

- `apps/the_monkeys/src/features/studio/history/HistoryView.tsx`:
  - **KPI Metrics Bar**:
    - *Published*: Total successfully published posts.
    - *Failed*: Total failed posts requiring attention.
    - *Success Rate*: Percentage of successful deliveries (`published / (published + failed) * 100`).
    - *Drafts / Total*: Count of remaining drafts and total posts.
  - **Search & Filter Controls**:
    - Search input: filters by `base_text`.
    - Status filter pills: `All`, `Published`, `Failed`, `Draft`.
    - Platform filter dropdown/chips: `All Platforms`, `X`, `LinkedIn`, `Instagram`, `Facebook`, `YouTube`, `TikTok`.
    - Sort order: Newest first (`created_at` or `scheduled_at` descending) vs Oldest first.
  - **Dual Layout**:
    - **Desktop Table (`>= 768px`)**: Columns for *Post Content*, *Platforms*, *Status*, *Published/Scheduled At*, and *Actions*.
    - **Mobile Cards (`< 768px`)**: Stacked cards with platform badges, timestamp, status indicator, and quick actions.
  - **Operational Actions**:
    - *Retry / Re-publish*: For failed posts, calls `publishNow` or opens drawer.
    - *Open in Composer*: Navigates to `/studio/compose/[id]` for edits or cloning.
    - *Delete*: Calls `deleteDraft`.
  - **Polished States**:
    - Animated skeleton cards during query loading.
    - Contextual empty states for no posts vs no search results.
    - Error callout with retry button.

- `apps/the_monkeys/src/app/studio/history/page.tsx`:
  - Render `<HistoryView />`.

### 2.2. Queue View Polish (`src/features/studio/queue/`)
Refine existing `QueueView.tsx`, `QueueHeader.tsx`, and `QueueItem.tsx`:
- Enhance `QueueHeader`:
  - Visual hierarchy, badge styling matching Studio design tokens, and quick link to `/studio/compose`.
- Enhance `QueueItem`:
  - Subtle hover elevation and border contrast.
  - Clear drag handle with touch-action safeguards.
  - Clean platform pills and formatted time with timezone clarity.
- Empty State:
  - Clean illustration, motivational copy, and prominent "+ Add to Queue" CTA.

### 2.3. Calendar View Polish (`src/features/studio/calendar/`)
Refine `CalendarView.tsx`, `CalendarToolbar.tsx`, `MonthGrid.tsx`, and `WeekGrid.tsx`:
- Visual alignment with Linear/Vercel styling (subtle borders, clean typography).
- Mobile responsiveness: Month grid's day cells remain touch-friendly (`min-h-[44px]`), and mobile day drawer/details render cleanly.
- Timezone indicator styling consistent with `FastActionBar` and `ScheduleDrawer`.

---

## 3. Data Flow & State Management

- Uses existing React Query hooks:
  - `useSocialPosts()`: Source for history and drafts.
  - `useSocialQueue()`: Source for queued/scheduled posts.
  - `useSocialCalendar({ from, to })`: Source for calendar range.
  - `useSocialPostMutations()`: `publishNow`, `cancelSchedule`, `deleteDraft`, `schedule`, `reorderQueue`.
- No new external dependencies needed. All styling utilizes existing Tailwind classes and `@remixicon/react` icons.

---

## 4. Verification Plan

### 4.1. Automated Unit Tests
- `apps/the_monkeys/src/features/studio/history/HistoryView.test.tsx`:
  - Verify KPI counts (published, failed, success rate).
  - Verify search query filtering.
  - Verify status and platform filtering.
  - Verify retry and delete actions trigger appropriate mutations.
  - Verify loading and empty states.
- Existing suites:
  - `src/features/studio/calendar/CalendarView.test.tsx` (9 tests)
  - `src/features/studio/calendar/MonthGrid.test.tsx` (13 tests)
  - `src/features/studio/calendar/WeekGrid.test.tsx` (13 tests)
  - `src/features/studio/queue/QueueView.test.tsx` (11 tests)
  - `src/features/studio/components/PostActionsMenu.test.tsx` (11 tests)
  - Verify 100% pass rate with zero regressions.

### 4.2. Manual & Responsive Checks
- Desktop & Mobile viewports for `/studio/calendar`, `/studio/queue`, and `/studio/history`.

