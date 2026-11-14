# Studio Search Entrypoints Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Make the existing Studio search landing experience useful immediately, especially on mobile.

**Architecture:** Reuse SnapshotStudio's existing state and URL field. Render the field before the preview while retaining the desktop control column. Use a small shared copy definition for the visible heading, instructions and existing route schema so the selected mode stays consistent.

**Tech Stack:** Next.js 14, React 18, Tailwind 3, Vitest and Testing Library.

**Spec:** `docs/superpowers/specs/2026-11-14-studio-search-entrypoints-design.md`

## Global Constraints

- Keep existing routes, API contracts, public access, exports and saved preferences backward compatible.
- Keep the existing design tokens, Next.js 14 and Tailwind 3. No dependency upgrade.
- Use a compact mobile-first layout, with no new large hero or forced signup.
- Preserve the original checkout's 18 staged mobile files byte for byte.
- Keep all implementation and testing local. Do not publish, deploy, contact people, buy services or alter production.
- No em dashes in controlled visible copy or SEO copy.
- Do not claim guaranteed rankings, traffic or support for private/deleted X posts.

## Review Focus

- X deep links must select X before browser effects, even with a conflicting stored preference.
- Tab changes must update heading and instructions together and preserve unrelated query parameters.
- The URL field must remain a single controlled input, including paste, clear and invalid-link feedback.
- Template mode must retain its controls and exports without an X URL field.
- At 320px, 390px, 768px and 1440px, the field, preview and help must fit the page in light and dark themes.

## Task 1: Search intent and useful help

Files: `snapshot/new/page.tsx`, `snapshot/new/SnapshotNewClient.tsx`, a focused `StudioHelp.tsx`, and Studio page tests.

- [x] Add failing tests for exactly one visible mode-specific H1 and matching readable help in initial HTML.
- [x] Add interaction coverage for switching modes, stored preference and query preservation.
- [x] Implement compact copy and instructions using existing theme tokens; remove the hidden duplicate H1.
- [x] Keep structured FAQ copy consistent with the visible mode-specific help.
- [x] Run focused tests and lint.

## Task 2: Working input before preview

Files: `features/snapshot/components/SnapshotStudio.tsx` and a focused component regression test.

- [x] Add a failing interaction test proving one URL field precedes the preview and still drives paste and clear.
- [x] Move the existing field, preserving state and callbacks. Use explicit desktop grid placement for X mode only.
- [x] Check template mode and invalid-link feedback.
- [x] Run focused tests, type checking, an isolated production build and local responsive browser checks with production access blocked.

## Delivery

### Discovery follow-up

- [x] Reproduce the missing self-canonical X tool entry with a failing sitemap test.
- [x] Add that existing tool URL once, preserving the default Studio canonical and all post URLs.
- [x] Align visible and metadata copy with actual tweet-to-PNG and aspect-ratio capabilities.
- [x] Re-run verification and review the final combined diff before committing and opening the authorized PR.

No extra Learning pages, RSS hub, cache changes, backend changes or content rewrites are included. Existing event and group pages already advertise their RSS feeds; no duplicate implementation is needed.

- [x] Review the complete diff with a fresh reviewer and resolve material findings.
- [x] Save the practitioner research report and experiment priorities outside the application repository.
- [x] Verify the protected mobile staged-patch fingerprint and report the actual verification results.
- [x] Leave the local follow-up reviewable; no deployment is authorized by this plan.

## Execution record

The initial URL-order test failed on the old document order. Initial heading tests failed because the page only had a hidden H1. After implementation, review found that saved tab restoration could leave server FAQ schema inconsistent with visible help. A new schema-consistency test reproduced the problem; FAQ schema now renders from the same active-mode copy as the visible answers, including initial server rendering.

All 28 initial focused tests in seven files passed. After the discovery follow-up, all 1,017 frontend tests passed across 180 files. Scoped lint, standalone TypeScript checking and the final isolated production build passed. Local browser checks covered 320px and 390px phones, a 768px tablet and 1440px desktop, light and dark themes, URL paste and clear, invalid links, template switching and downloads. Both downloaded PNGs have valid signatures and dimensions of 2160 by 2700 pixels. The final copy and three-question FAQ were checked again at phone widths; the existing X canonical was verified in the rendered head.

Browser testing used a synthetic public post and local API, with production application connections blocked. A blank avatar in the initial synthetic fixture caused an export failure; the fixture was corrected to use the existing local default avatar before the successful download checks. This does not verify external X availability or video rendering. No accounts, databases, production services or external posts were changed. Test preview processes were stopped afterward.

The original mobile checkout still has 18 staged files and the same staged-patch SHA256: `ABF1FE8411D653863BBC54639D0B4B45EE4819A316FA31DFBD7869F7F69A702D`. Next.js' generated tsconfig changes were restored. No dependencies or backend files changed.

The report is saved outside the repository as `monkeys-growth-experiments-2026-11-14.html` in this chat's local artifact directory. It distinguishes Google clicks from visits, signups, citations and social views, and labels portfolio allocations as targets and 2027 expectations as hypotheses.
