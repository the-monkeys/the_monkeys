# Landing community previews implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Surface a few genuine public discussions and groups in the approved landing-page layout.

**Architecture:** Add bounded anonymous public readers and selectors, reuse them in server prefetch and client queries, then compose a compact community section into the current landing content. Existing backend routes and discussion component defaults remain compatible.

**Tech Stack:** Existing Next.js 14, React Query, Tailwind 3, Vitest and in-app browser. Retain installed versions.

**Spec:** `docs/superpowers/specs/2026-11-18-landing-community.md`.

## Global constraints

No production requests or mutations; no backend/auth changes; no staged mobile modifications; no PR. Use branch `codex/landing-community-previews` from fetched main `0ebe69f0`.

## Review focus

- Private/unlisted/group-only, hidden, deleted, draft, malformed and duplicate records must not appear.
- A single endpoint failure must not remove the other section or existing articles/events.
- Missing authors, verification data, images, dates and legacy audience fields must remain safe and readable.
- Long Unicode names, text and URLs must fit 320px mobile, tablet and desktop; keyboard links/menu must remain usable.
- SSR and client queries must use matching anonymous keys without following-feed or membership cache collisions.

### Task 1: Public selection and transport

Files: add `src/lib/landingCommunity.ts`, `src/services/landing/communityApi.ts` and adjacent tests; add `src/hooks/landing/useLandingCommunity.ts`.

- [x] Write failing selector and transport tests: bounds, ranking, privacy, legacy site records, bad envelopes, anonymous no-store reads, upstream failure and cancellation.
- [x] Implement `selectLandingDiscussions(value: unknown): Discussion[]` and `selectLandingGroups(value: unknown): GroupItem[]`, returning at most three/two safe records without mutating inputs.
- [x] Implement bounded readers and shared query options; preserve existing API helpers unchanged.
- [x] Run tests and confirm green.

### Task 2: Approved presentation and integration

Files: add `src/components/landing/LandingCommunity.tsx`; extend `DiscussionCard.tsx` with optional compact mode; modify `LandingPageClient.tsx` and `app/page.tsx`; add component and integration tests.

- [x] Write failing presentation and integration tests for links, real content, independent empty/error/loading sections, original filters and backward-compatible full cards.
- [x] Reuse discussion components and existing theme tokens; compact previews hide rich link cards and clamp text. Render public group cards with safe missing-image fallback.
- [x] Add community sections before the current filter navigation; keep navigation immediately adjacent to the current editorial feed. Prefetch both anonymous queries in parallel with existing queries.
- [x] Run targeted regressions, types, lint and isolated production build with application production hosts blocked.

### Task 3: Local browser and delivery

- [x] Verify actual local public data and guest access at mobile, tablet and desktop sizes; inspect navigation, dark mode, menus and overflow. Use synthetic fixtures only for missing edge-case data, explicitly labeled in verification.
- [x] Obtain one fresh whole-branch code review, fix actionable issues and rerun affected checks.
- [x] Commit only relevant changes, push branch and verify remote SHA. Do not open a PR. Initial delivery: `74f08f43`; the staged mobile baseline was rechecked unchanged before delivery.

## Execution record

- Existing linked worktree reused. Original mobile staged diff has 18 files and SHA-256 `ABF1FE8411D653863BBC54639D0B4B45EE4819A316FA31DFBD7869F7F69A702D`.
- Backend public-list reads already enforce group visibility and publication state; new frontend reads add defensive filtering. No backend modifications required.

## Final verification

- All 66 focused tests across 13 suites pass, including old landing filters and full discussion cards, private/draft/deleted exclusions, legacy audience reads, SSR hydration, failed endpoints, API cancellation, group image fallback and compact-preview keyboard navigation.
- Scoped lint has no warnings or errors. Final isolated production build passes against the local synthetic API with production application hosts blocked. A later direct TypeScript check found test-option errors, corrected in the header follow-up below.
- Native in-app browser checks use actual restored local public discussions and groups at 390x844, 820x1180 and 1440x1000, with light/dark mode, the discussion menu, individual destinations and both browse links. Three discussions and two groups render; no sample/mock content is shipped.
- Anonymous HTTP to the local landing page returns 200 with real public discussion/group links in the server HTML. Login state and account permissions were not changed.
- New sections fit 320px as well. Initial verification found a pre-existing shared-header overflow at 320px on `/groups` (profile controls extended to x=370). The user subsequently authorized the separate header fix below. At 390px, 820px and 1440px the page has no horizontal overflow.
- Fresh review's compact-preview keyboard issue was reproduced, then fixed: only the full-card link, visible author and menu stay interactive inside compact previews. Default full cards retain inline links and rich previews.
- Real screenshots and test/build/anonymous-HTML evidence are saved locally in the `landing-community-2026-11-18` artifact folder. Restored test discussions are explicitly labeled local-only; no existing content was modified.
- Original staged mobile work remains 18 files with the same recorded SHA-256. No backend, dependency, authorization, production or other-project container changes. Required existing local Monkeys services were started; AI and notification services remain off.

## 320px header follow-up

- User requested the fix on this same branch. The header's cumulative gaps and empty desktop-search wrapper required 370px even when the viewport was only 320px.
- Reduce gaps only below 375px; restore the existing larger-screen spacing at 375px. Hide the entire desktop-search slot below its existing desktop breakpoint. Keep control sizes, colors, actions, login logic and permissions unchanged.
- Real browser geometry at 320px now reports a 305px document/client width (15px vertical scrollbar) and the profile button ends at x=305, with every control visible. Widths 360, 374, 375, 390, 820 and 1440 also have no horizontal overflow. Create/profile menus fit at 320px; light/dark checks pass. Normal viewport and light theme restored after the visible local demo.
- Extended the real Tailwind stylesheet regression test; reproduced the old empty-slot failure before the fix. All 25 targeted tests across six suites pass. Direct TypeScript validation passes; scoped lint has no warnings or errors. Four unsupported options in an earlier discussion regression test were removed without changing its intended assertions.
- Actual screenshots and breakpoint measurements are saved locally under `header-overflow-2026-11-18`. No production, backend, dependency or authentication changes. The separate staged mobile checkout remains untouched.
