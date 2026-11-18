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
- [ ] Commit only relevant changes, push branch and verify remote SHA. Do not open a PR. The staged mobile baseline was rechecked unchanged before delivery.

## Execution record

- Existing linked worktree reused. Original mobile staged diff has 18 files and SHA-256 `ABF1FE8411D653863BBC54639D0B4B45EE4819A316FA31DFBD7869F7F69A702D`.
- Backend public-list reads already enforce group visibility and publication state; new frontend reads add defensive filtering. No backend modifications required.

## Final verification

- All 66 focused tests across 13 suites pass, including old landing filters and full discussion cards, private/draft/deleted exclusions, legacy audience reads, SSR hydration, failed endpoints, API cancellation, group image fallback and compact-preview keyboard navigation.
- Scoped lint has no warnings or errors. Final isolated production build (including TypeScript validation) passes against the local synthetic API with production application hosts blocked.
- Native in-app browser checks use actual restored local public discussions and groups at 390x844, 820x1180 and 1440x1000, with light/dark mode, the discussion menu, individual destinations and both browse links. Three discussions and two groups render; no sample/mock content is shipped.
- Anonymous HTTP to the local landing page returns 200 with real public discussion/group links in the server HTML. Login state and account permissions were not changed.
- New sections fit 320px as well. A pre-existing shared-header overflow at 320px reproduces on the unchanged `/groups` page (profile controls extend to x=370); header/mobile-fix files are intentionally untouched. At 390px, 820px and 1440px the page has no horizontal overflow.
- Fresh review's compact-preview keyboard issue was reproduced, then fixed: only the full-card link, visible author and menu stay interactive inside compact previews. Default full cards retain inline links and rich previews.
- Real screenshots and test/build/anonymous-HTML evidence are saved locally in the `landing-community-2026-11-18` artifact folder. Restored test discussions are explicitly labeled local-only; no existing content was modified.
- Original staged mobile work remains 18 files with the same recorded SHA-256. No backend, dependency, authorization, production or other-project container changes. Required existing local Monkeys services were started; AI and notification services remain off.
