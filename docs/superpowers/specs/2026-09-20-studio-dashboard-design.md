# Studio Dashboard UI/UX Overhaul — Design Document

Date: 2026-09-20  
Surfaces: Studio Shared Layout, Studio Dashboard (`/studio`), Studio Accounts (`/studio/accounts`)  
Scope: Batch 1 (Layout & Core Dashboard)  
Repo: `the_monkeys`  

---

## 1. Overview & Goals

The Monkeys Studio dashboard (`/studio`) is the central control plane for content creators, publishers, and researchers. The objective is to elevate it to an enterprise-grade SaaS experience (comparable to Linear, Vercel, and Stripe) with:
1. **Unified Workspace Shell**: Eliminating the desktop dual-sidebar collision between `AppShell` and `StudioLayout`.
2. **Standardized Hierarchy**: Consistent breadcrumbs, sticky top navigation header, contextual actions, and uniform padding.
3. **100% Mobile Responsiveness**: Sticky top header + ergonomic mobile bottom navigation tab bar + slide-over drawer for secondary routes.
4. **Batch 1 Pages Polish**:
   - `/studio` (Main Dashboard): KPI summary cards with trend styling, quick-action shortcuts, and a rich recent activity feed with status badges, timestamps, and loading skeletons.
   - `/studio/accounts`: Channel grid with platform branding, connection status badges, validation limits (character/media counts), and clean loading/provisioning states.

---

## 2. Layout Wrapper Architecture

### 2.1. AppShell Integration
In `apps/the_monkeys/src/components/layout/app-shell/AppShell.tsx`:
- Detect Studio routes: `const isStudioPage = pathname?.startsWith('/studio');`
- When `isStudioPage` is true, render `Navbar` and `{children}` without `FeedSidebarDesktop` or the global feed `RightRail`.
- This provides Studio with the full desktop viewport width while maintaining global branding and navigation.

### 2.2. Studio Desktop Sidebar (`StudioSidebar.tsx` / `StudioLayout.tsx`)
- Fixed width: `w-64 shrink-0`
- Sticky positioning: `sticky top-0 h-screen`
- Sections:
  - **Brand & Header**: Studio glyph, version badge, workspace label.
  - **Primary CTA**: Prominent `+ New Post` button linking to `/studio/compose`.
  - **Group 1: Overview**: Dashboard (`/studio`, icon: `RiDashboardLine`).
  - **Group 2: Publishing**: Composer (`/studio/compose`, icon: `RiPencilLine`), Queue (`/studio/queue`, icon: `RiTimeLine`), Calendar (`/studio/calendar`, icon: `RiCalendarLine`), History (`/studio/history`, icon: `RiHistoryLine`), Media (`/studio/media`, icon: `RiImageLine`).
  - **Group 3: Creative Tools**: Snapshots (`/studio/snapshot`, icon: `RiCameraLensLine`), Cards (`/studio/cards`, icon: `RiCoupon3Line`).
  - **Group 4: Settings**: Accounts (`/studio/accounts`, icon: `RiSettings3Line`).
  - **Footer**: `← Back to Monkeys` quick exit link.

### 2.3. Sticky Top Header (`StudioHeader.tsx`)
- Height: `h-14` (56px), `sticky top-0 z-30`
- Styling: `backdrop-blur-md bg-background-light/80 dark:bg-background-dark/80 border-b border-border-light dark:border-border-dark/60`
- Elements:
  - Left: Dynamic breadcrumbs (`Studio` / `Dashboard` or `Studio` / `Accounts`).
  - Right: Contextual action buttons (e.g., `New Post` CTA on dashboard, `Refresh` or `Filter`).
  - Mobile: Hamburger button (`lg:hidden`) to open the full navigation drawer.

### 2.4. Mobile Navigation (`StudioMobileNav.tsx`)
- For viewports `< lg`:
  - **Bottom Navigation Bar**: Fixed bottom bar (`fixed bottom-0 inset-x-0 z-40 bg-background-light/95 dark:bg-background-dark/95 border-t backdrop-blur-lg`) with 5 primary touch targets:
    1. Dashboard (`/studio`)
    2. Compose (`/studio/compose`)
    3. Queue (`/studio/queue`)
    4. Calendar (`/studio/calendar`)
    5. More (trigger for slide-over drawer)
  - **Slide-over Drawer**: Radix Dialog / Sheet exposing Accounts, Media, History, Snapshots, Cards, and Back to Feed.

---

## 3. Batch 1: Core Dashboard & Accounts Design

### 3.1. Main Dashboard (`/studio/page.tsx`)
- **Header Banner**: Welcoming, professional header with dynamic greeting, subtitle, and primary `New Post` CTA.
- **Metric Cards (3-column grid, responsive to 1-col on mobile)**:
  - *Drafts*: Count, icon, description ("In progress, ready to polish"), click-to-filter/view.
  - *Scheduled*: Count, icon, description ("Queued for upcoming release"), click-to-queue.
  - *Published*: Count, icon, description ("Successfully delivered to channels"), click-to-history.
  - Preserves exact test selectors (`Drafts`, `Scheduled`, `Published` card containers).
- **Quick Action Row**:
  - `Write a Post`, `View Calendar`, `Manage Channels`, `Design Snapshot`.
- **Recent Activity Feed**:
  - Clean card container with header and "View all" link.
  - List items with:
    - Post title / base text snippet.
    - Status badge with color-coding:
      - `draft`: Neutral gray / zinc badge.
      - `scheduled`: Amber / blue badge with scheduled indicator.
      - `published`: Emerald / green badge with check icon.
      - `failed`: Red / destructive badge.
    - Hover card highlight and subtle arrow indicator.
  - Loading skeleton state (animated pulse skeletons matching test assertions).
  - Empty state with informative message and action button.

### 3.2. Accounts View (`/studio/accounts/page.tsx`)
- **Header**: "Connected Accounts", subtitle explaining channel publishing permissions and validation constraints.
- **Platform Cards Grid (2-column grid, responsive to 1-col on mobile)**:
  - Platforms: X (Twitter), LinkedIn, Instagram, Facebook, YouTube, TikTok.
  - Card Header: Platform brand icon + platform name + Status Pill (`Connected` in green or `Disconnected` in muted gray).
  - Account Info: Handle (`@username`) or loading/provisioning state.
  - Validation Badges:
    - Character limit (e.g. `Character limit: 280` or `3000`).
    - Max media count (e.g. `Max media: 4`).
  - Error state: When account is not provisioned, displays clean alert callout.
  - All existing test assertions preserved (`Connected`, `Character limit:`, `Account was not provisioned...`).

---

## 4. Verification Plan

### 4.1. Automated Unit Tests
- Run `pnpm --filter the_monkeys test -- apps/the_monkeys/src/app/studio/StudioPages.test.tsx`
- Ensure all metric counters, loading states, error states, and account validation assertions pass 100%.

### 4.2. Manual & Responsive Checks
- Desktop (`>= 1024px`): Verify single sidebar, sticky header, breadcrumbs, metrics, cards.
- Tablet (`768px - 1023px`): Verify grid collapses gracefully to 2 columns, header remains sticky.
- Mobile (`< 768px`): Verify bottom tab bar, drawer sheet, 1-column cards, touch targets (`>= 44px`).

