# Studio Phase 2: Interactive Queue Reordering & Calendar Surfaces Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement interactive Queue Reordering (`/studio/queue`) and rich Month & Week Calendar Grid surfaces (`/studio/calendar`) with mobile responsiveness and shared post actions.

**Architecture:** Modular feature slices under `src/features/studio/queue/` and `src/features/studio/calendar/` powered by TanStack React Query (`useSocialQueue`, `useSocialCalendar`, `useSocialPostMutations`), `date-fns` for date interval arithmetic, and shared `PostActionsMenu` for in-place actions (Publish Now, Reschedule, Cancel Schedule, Delete Draft).

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, `date-fns`, TanStack React Query, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-19-studio-phase-2-queue-and-calendar-design.md`

## Global Constraints
- Do not install heavy external calendar engines like `@fullcalendar`; use `date-fns` already in `package.json`.
- Queue reordering must support both drag-and-drop handles and accessible `▲ Up` / `▼ Down` buttons for mobile and keyboard accessibility.
- Queue reordering must use optimistic UI updates with automatic rollback on error.
- Calendar must support both Month and Week views with a segmented toggle and navigation (`‹ Prev`, `Today`, `Next ›`).
- Mobile screens (< 768px) must provide mobile-adapted UX: Month view uses a compact date matrix with dot indicators and day agenda list; Week view uses a day-tab switcher.
- All existing 220 tests in `the_monkeys` and all Go backend tests in `monkeys_brain` must continue to pass without regression.

---

### Task 1: Shared Post Actions Menu & Reschedule Modal (`PostActionsMenu.tsx`)

**Files:**
- Create: `apps/the_monkeys/src/features/studio/components/RescheduleModal.tsx`
- Create: `apps/the_monkeys/src/features/studio/components/PostActionsMenu.tsx`
- Create: `apps/the_monkeys/src/features/studio/components/PostActionsMenu.test.tsx`

**Interfaces:**
- Consumes:
  - `useSocialPostMutations()`: `publishNow`, `cancelSchedule`, `deleteDraft`, `schedule`.
  - `SocialPost` from `@/features/studio/types`.
- Produces:
  - `<PostActionsMenu post={post} onActionComplete?: () => void />`
  - `<RescheduleModal isOpen={boolean} post={post} onClose={() => void} />`

- [ ] **Step 1: Write failing test for PostActionsMenu and RescheduleModal**

Create `apps/the_monkeys/src/features/studio/components/PostActionsMenu.test.tsx`:
```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PostActionsMenu from './PostActionsMenu';
import { SocialPost } from '../types';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockPublishNow = { mutateAsync: vi.fn(), isPending: false };
const mockCancelSchedule = { mutateAsync: vi.fn(), isPending: false };
const mockDeleteDraft = { mutateAsync: vi.fn(), isPending: false };
const mockSchedule = { mutateAsync: vi.fn(), isPending: false };

vi.mock('@/hooks/studio/useSocialPosts', () => ({
  useSocialPostMutations: () => ({
    publishNow: mockPublishNow,
    cancelSchedule: mockCancelSchedule,
    deleteDraft: mockDeleteDraft,
    schedule: mockSchedule,
  }),
}));

const testPost: SocialPost = {
  id: 'post-1',
  base_text: 'Test scheduled post',
  state: 'scheduled',
  status: 'scheduled',
  version: 2,
  scheduled_at: '2026-10-15T14:00:00Z',
  schedule_timezone: 'UTC',
  created_at: '2026-09-19T00:00:00Z',
  updated_at: '2026-09-19T00:00:00Z',
};

describe('PostActionsMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders trigger button and toggles dropdown menu', () => {
    render(<PostActionsMenu post={testPost} />);
    const trigger = screen.getByRole('button', { name: /post actions/i });
    expect(trigger).toBeDefined();
    fireEvent.click(trigger);
    expect(screen.getByText(/edit in composer/i)).toBeDefined();
    expect(screen.getByText(/publish now/i)).toBeDefined();
    expect(screen.getByText(/reschedule/i)).toBeDefined();
    expect(screen.getByText(/cancel schedule/i)).toBeDefined();
    expect(screen.getByText(/delete/i)).toBeDefined();
  });

  it('navigates to composer on edit click', () => {
    render(<PostActionsMenu post={testPost} />);
    fireEvent.click(screen.getByRole('button', { name: /post actions/i }));
    fireEvent.click(screen.getByText(/edit in composer/i));
    expect(mockPush).toHaveBeenCalledWith('/studio/compose/post-1');
  });

  it('calls publishNow mutation on publish click', async () => {
    mockPublishNow.mutateAsync.mockResolvedValue({});
    render(<PostActionsMenu post={testPost} />);
    fireEvent.click(screen.getByRole('button', { name: /post actions/i }));
    fireEvent.click(screen.getByText(/publish now/i));
    await waitFor(() => {
      expect(mockPublishNow.mutateAsync).toHaveBeenCalledWith({
        id: 'post-1',
        expectedVersion: 2,
      });
    });
  });

  it('calls cancelSchedule mutation on cancel click', async () => {
    mockCancelSchedule.mutateAsync.mockResolvedValue({});
    render(<PostActionsMenu post={testPost} />);
    fireEvent.click(screen.getByRole('button', { name: /post actions/i }));
    fireEvent.click(screen.getByText(/cancel schedule/i));
    await waitFor(() => {
      expect(mockCancelSchedule.mutateAsync).toHaveBeenCalledWith({
        id: 'post-1',
        expectedVersion: 2,
      });
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/features/studio/components/PostActionsMenu.test.tsx` in `apps/the_monkeys`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `RescheduleModal.tsx` and `PostActionsMenu.tsx`**

1. Create `apps/the_monkeys/src/features/studio/components/RescheduleModal.tsx`:
   - Modal overlay with date picker (`min = today`), time picker (`HH:MM`), timezone selector.
   - Validation ensuring new timestamp is in the future.
   - Converts local date + time to UTC ISO string (`localDateTimeToUtcIso`).
   - Calls `schedule.mutateAsync({ id: post.id, input: { scheduled_at: newIso, schedule_timezone: tz }, reschedule: true })`.
   - Closes modal on success.

2. Create `apps/the_monkeys/src/features/studio/components/PostActionsMenu.tsx`:
   - 3-dot button (`aria-label="Post actions"`).
   - Popover / dropdown container with outside click listener.
   - Action items:
     - `Edit in Composer`: `router.push('/studio/compose/' + post.id)`.
     - `Publish Now`: calls `publishNow.mutateAsync({ id: post.id, expectedVersion: post.version })`.
     - `Reschedule`: opens `RescheduleModal`.
     - `Cancel Schedule`: calls `cancelSchedule.mutateAsync({ id: post.id, expectedVersion: post.version })`.
     - `Delete`: window confirmation, then `deleteDraft.mutateAsync({ id: post.id, expectedVersion: post.version })`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/features/studio/components/PostActionsMenu.test.tsx` in `apps/the_monkeys`
Expected: PASS.

- [ ] **Step 5: Commit shared post actions menu**

```bash
git -C /home/gautam/Desktop/Monkeys/the_monkeys add src/features/studio/components/RescheduleModal.tsx src/features/studio/components/PostActionsMenu.tsx src/features/studio/components/PostActionsMenu.test.tsx
git -C /home/gautam/Desktop/Monkeys/the_monkeys commit -m "feat(studio): add shared PostActionsMenu and RescheduleModal"
```

---

### Task 2: Interactive Queue Reordering & Queue View (`the_monkeys`)

**Files:**
- Create: `apps/the_monkeys/src/features/studio/queue/QueueHeader.tsx`
- Create: `apps/the_monkeys/src/features/studio/queue/QueueItem.tsx`
- Create: `apps/the_monkeys/src/features/studio/queue/SortableQueueList.tsx`
- Create: `apps/the_monkeys/src/features/studio/queue/QueueView.tsx`
- Modify: `apps/the_monkeys/src/app/studio/queue/page.tsx`
- Create: `apps/the_monkeys/src/features/studio/queue/QueueView.test.tsx`

**Interfaces:**
- Consumes:
  - `useSocialQueue()`
  - `useSocialPostMutations().reorderQueue`
  - `PostActionsMenu`
- Produces:
  - `<QueueView />` embedded in `/studio/queue/page.tsx`

- [ ] **Step 1: Write failing test for QueueView and reordering**

Create `apps/the_monkeys/src/features/studio/queue/QueueView.test.tsx`:
- Tests queue rendering with position numbers (`#1`, `#2`, `#3`).
- Tests clicking `▲ Move Up` and `▼ Move Down` buttons reorders the list and calls `reorderQueue.mutateAsync` with the new ID order.
- Tests optimistic rollback if `reorderQueue.mutateAsync` rejects.
- Tests empty state when `posts` is empty.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/features/studio/queue/QueueView.test.tsx` in `apps/the_monkeys`
Expected: FAIL.

- [ ] **Step 3: Implement Queue components**

1. `QueueHeader.tsx`:
   - Header with `"Publishing Queue"`, post count badge, and `+ Add to Queue` link to `/studio/compose`.
2. `QueueItem.tsx`:
   - 6-dot drag grip handle (`⠿`) with `touch-action: none`.
   - Position badge `#N`.
   - `▲` and `▼` buttons (with `disabled={index === 0}` and `disabled={index === total - 1}`).
   - Post text snippet, platform badges, scheduled time pill.
   - `PostActionsMenu` 3-dot dropdown.
3. `SortableQueueList.tsx`:
   - Manages local `items` array.
   - Drag-and-drop event handlers (`onDragStart`, `onDragOver`, `onDrop`).
   - Accessible reorder handlers `onMoveUp(index)` and `onMoveDown(index)`.
   - Fires `reorderQueue.mutateAsync(newIds)` with optimistic local update and catch rollback.
4. `QueueView.tsx`:
   - Fetches `useSocialQueue()`.
   - Handles loading skeleton and empty state.
5. Update `apps/the_monkeys/src/app/studio/queue/page.tsx` to render `<QueueView />`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/features/studio/queue/QueueView.test.tsx` in `apps/the_monkeys`
Expected: PASS.

- [ ] **Step 5: Commit Queue components**

```bash
git -C /home/gautam/Desktop/Monkeys/the_monkeys add src/features/studio/queue/ src/app/studio/queue/page.tsx
git -C /home/gautam/Desktop/Monkeys/the_monkeys commit -m "feat(studio): implement interactive queue reordering and QueueView"
```

---

### Task 3: Calendar Month Grid & Mobile Agenda (`the_monkeys`)

**Files:**
- Create: `apps/the_monkeys/src/features/studio/calendar/CalendarPostChip.tsx`
- Create: `apps/the_monkeys/src/features/studio/calendar/CalendarDayCell.tsx`
- Create: `apps/the_monkeys/src/features/studio/calendar/MonthGrid.tsx`
- Create: `apps/the_monkeys/src/features/studio/calendar/MonthGrid.test.tsx`

**Interfaces:**
- Consumes:
  - `date-fns` (`startOfMonth`, `endOfMonth`, `startOfWeek`, `endOfWeek`, `eachDayOfInterval`, `isSameMonth`, `isToday`, `isSameDay`, `parseISO`)
  - `SocialPost` from `@/features/studio/types`
  - `PostActionsMenu`
- Produces:
  - `<MonthGrid currentDate={Date} posts={SocialPost[]} onSelectDay={(day: Date) => void} />`

- [ ] **Step 1: Write failing test for MonthGrid**

Create `apps/the_monkeys/src/features/studio/calendar/MonthGrid.test.tsx`:
- Tests generating 35 or 42 day cells for a given month.
- Tests matching scheduled posts to the correct day cell by date string.
- Tests clicking a day cell invokes `onSelectDay(day)`.
- Tests mobile agenda mode (< 768px): renders date dots and day post list.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/features/studio/calendar/MonthGrid.test.tsx` in `apps/the_monkeys`
Expected: FAIL.

- [ ] **Step 3: Implement MonthGrid and subcomponents**

1. `CalendarPostChip.tsx`:
   - Renders platform icon badge, formatted time (`10:30 AM`), truncated text.
   - Clicking chip navigates to `/studio/compose/${post.id}`.
   - Includes 3-dot trigger for `PostActionsMenu`.
2. `CalendarDayCell.tsx`:
   - Day number header, dimmed for other months, highlighted for `isToday`.
   - Hover `+` icon button linking to `/studio/compose?date=YYYY-MM-DD`.
   - Renders up to 3 `CalendarPostChip`s, plus `+N more` pill if > 3 posts.
3. `MonthGrid.tsx`:
   - Desktop view: 7 column grid (Mon - Sun) with `eachDayOfInterval`.
   - Mobile agenda view: Compact date matrix selector on top with post indicator dots, and active day agenda list below.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/features/studio/calendar/MonthGrid.test.tsx` in `apps/the_monkeys`
Expected: PASS.

- [ ] **Step 5: Commit MonthGrid components**

```bash
git -C /home/gautam/Desktop/Monkeys/the_monkeys add src/features/studio/calendar/CalendarPostChip.tsx src/features/studio/calendar/CalendarDayCell.tsx src/features/studio/calendar/MonthGrid.tsx src/features/studio/calendar/MonthGrid.test.tsx
git -C /home/gautam/Desktop/Monkeys/the_monkeys commit -m "feat(studio): add MonthGrid and mobile agenda calendar view"
```

---

### Task 4: Calendar Week Grid & Hourly Timeline (`the_monkeys`)

**Files:**
- Create: `apps/the_monkeys/src/features/studio/calendar/WeekGrid.tsx`
- Create: `apps/the_monkeys/src/features/studio/calendar/WeekGrid.test.tsx`

**Interfaces:**
- Consumes:
  - `date-fns` (`startOfWeek`, `endOfWeek`, `eachDayOfInterval`, `isSameDay`, `format`, `parseISO`)
  - `SocialPost`
  - `PostActionsMenu`
- Produces:
  - `<WeekGrid currentDate={Date} posts={SocialPost[]} />`

- [ ] **Step 1: Write failing test for WeekGrid**

Create `apps/the_monkeys/src/features/studio/calendar/WeekGrid.test.tsx`:
- Tests rendering 7 day columns for the active week.
- Tests hourly slots (00:00 to 23:00) with scheduled posts positioned in their hour cell.
- Tests clicking an empty hourly slot navigates to `/studio/compose?date=...`.
- Tests mobile day-tab switcher rendering single-day timeline.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/features/studio/calendar/WeekGrid.test.tsx` in `apps/the_monkeys`
Expected: FAIL.

- [ ] **Step 3: Implement WeekGrid.tsx**

1. Desktop view (>= 768px):
   - Left 24-hour time axis.
   - 7 columns with sticky header (weekday name + date number).
   - Real-time indicator line across today's column.
   - Hourly cells with hover state and click navigation to composer with prefilled date/hour.
   - Positioned scheduled post cards with platform badges and `PostActionsMenu`.
2. Mobile view (< 768px):
   - Horizontal day tab bar for the 7 days of the week.
   - Selected day displays that day's 24-hour vertical timeline without horizontal crowding.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/features/studio/calendar/WeekGrid.test.tsx` in `apps/the_monkeys`
Expected: PASS.

- [ ] **Step 5: Commit WeekGrid components**

```bash
git -C /home/gautam/Desktop/Monkeys/the_monkeys add src/features/studio/calendar/WeekGrid.tsx src/features/studio/calendar/WeekGrid.test.tsx
git -C /home/gautam/Desktop/Monkeys/the_monkeys commit -m "feat(studio): add WeekGrid timeline view with mobile day switcher"
```

---

### Task 5: Calendar Container, Toolbar & Route Integration (`the_monkeys`)

**Files:**
- Create: `apps/the_monkeys/src/features/studio/calendar/CalendarToolbar.tsx`
- Create: `apps/the_monkeys/src/features/studio/calendar/CalendarView.tsx`
- Modify: `apps/the_monkeys/src/app/studio/calendar/page.tsx`
- Create: `apps/the_monkeys/src/features/studio/calendar/CalendarView.test.tsx`

**Interfaces:**
- Consumes:
  - `useSocialCalendar({ from, to, page_size })`
  - `MonthGrid`, `WeekGrid`
- Produces:
  - `<CalendarView />` embedded in `/studio/calendar/page.tsx`

- [ ] **Step 1: Write failing test for CalendarView and CalendarToolbar**

Create `apps/the_monkeys/src/features/studio/calendar/CalendarView.test.tsx`:
- Tests view mode toggle between `Month` and `Week`.
- Tests navigation: clicking `‹ Prev` moves backward, `Next ›` moves forward, `Today` resets to current date.
- Tests date query parameters `from` and `to` update when navigating dates.
- Tests rendering loading skeleton and error states.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/features/studio/calendar/CalendarView.test.tsx` in `apps/the_monkeys`
Expected: FAIL.

- [ ] **Step 3: Implement CalendarToolbar and CalendarView**

1. `CalendarToolbar.tsx`:
   - `‹ Prev`, `Today`, `Next ›` buttons.
   - Dynamic title: Month format (`MMMM yyyy`) or Week range (`MMM d – MMM d, yyyy`).
   - Segmented toggle: `Month` vs `Week`.
   - `+ New Post` link button.
   - Timezone pill indicator.
2. `CalendarView.tsx`:
   - State: `currentDate: Date`, `viewMode: 'month' | 'week'`.
   - Computes interval start/end using `date-fns` (`startOfWeek(startOfMonth(...))` for month, `startOfWeek(...)` for week).
   - Fetches `useSocialCalendar({ from: start.toISOString(), to: end.toISOString() })`.
   - Conditionally renders `<MonthGrid />` or `<WeekGrid />`.
3. Update `apps/the_monkeys/src/app/studio/calendar/page.tsx` to render `<CalendarView />`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/features/studio/calendar/CalendarView.test.tsx` in `apps/the_monkeys`
Expected: PASS.

- [ ] **Step 5: Commit CalendarView and page integration**

```bash
git -C /home/gautam/Desktop/Monkeys/the_monkeys add src/features/studio/calendar/CalendarToolbar.tsx src/features/studio/calendar/CalendarView.tsx src/features/studio/calendar/CalendarView.test.tsx src/app/studio/calendar/page.tsx
git -C /home/gautam/Desktop/Monkeys/the_monkeys commit -m "feat(studio): integrate CalendarToolbar and CalendarView into /studio/calendar"
```

---

### Task 6: Full Verification & Integration Gate

**Files:**
- Both repos: `the_monkeys` and `monkeys_brain`

- [ ] **Step 1: Run frontend test suite**
Run: `npm test` in `apps/the_monkeys`.
Expected: PASS (all existing + new tests pass).

- [ ] **Step 2: Run frontend lint**
Run: `npm run lint` in `apps/the_monkeys`.
Expected: PASS with 0 errors and 0 warnings on new Studio code.

- [ ] **Step 3: Run backend gateway and service test suite**
Run: `go test -v ./microservices/the_monkeys_gateway/internal/social_post/... ./microservices/the_monkeys_social_post/...` in `monkeys_brain`.
Expected: PASS.

- [ ] **Step 4: Whole-branch code review and walkthrough artifact**
Generate review package, verify all requirements met, and update `walkthrough.md`.
