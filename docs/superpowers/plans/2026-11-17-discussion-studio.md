# Discussion Studio implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task by task.

**Goal:** Open a public discussion in the existing Studio with its text, author handle, genuine verification status and original link.

**Architecture:** Reuse the article Social Snapshot card and SnapshotStudio. Add a separate `/snapshot/discussion/[id]` entry so existing article IDs and Studio URLs retain their meaning. Read the original discussion through the existing anonymous loader; only visible public discussions may be exported. Read verification from the original author's public profile, never from the viewer or URL parameters. Extend SnapshotInput additively and show attribution in existing templates only for discussion input.

**Tech stack:** Existing Next.js App Router, React Query, Snapshot templates, Vitest and in-app browser.

**User refinements:** Use the existing Quote Card as the default, matching the supplied example. Add an accessible ellipsis menu on every discussion card with Copy snap and Open Studio. Discussion links must advertise a public server-rendered PNG through Open Graph and Twitter metadata, so preview fetchers do not need JavaScript or a login. The same Quote Card renderer supplies the square clipboard image and landscape link preview. Private/deleted content is excluded at request time. Clipboard failures offer image download and native sharing where supported. Receiving apps choose whether and when to display cached previews; test the actual PNG and metadata locally without posting to external services.

Match the profile dropdown's container, spacing, rounded rows and icon sizes. Add Report as a frontend-only form with submission disabled and an explicit coming-soon message; do not call a reporting API. Use one curved vector quote mark for discussion Studio, copied snaps and preview images so font fallback cannot change its shape.

- [x] Add failing adapter, route, entry and template tests: full multilingual text, omitted legacy fields, missing/deleted authors, verified/unverified profiles, original URL, private/deleted/missing discussion exclusions, unchanged article Studio.
- [x] Implement the discussion adapter and server entry; reuse the existing Studio controls, responsive layout and Social Snapshot card.
- [x] Preserve author attribution and original link in all template exports without changing article/manual/X appearance. Keep existing export controls and content editing.
- [x] Run focused regressions, types, lint, production build and fresh review. Test actual local discussion → Studio → image export on mobile, tablet and desktop.
- [x] Confirm the separate 18 staged mobile files are unchanged before delivery. Commit and push only this feature branch after verification; no PR and no production access.
- [x] Add card menus, PNG generation and share metadata with tests for public access, missing/private/deleted content, clipboard fallback, source attribution and responsive interaction.

## Verification record

- Branch starts at latest fetched main `23efbd6f` (merged publishing-readiness/multilingual-slug work).
- 160 tests across 30 focused suites pass. Scoped lint and the isolated production build pass, including its TypeScript check. Fresh review has no remaining actionable findings.
- Real local browser checks cover 390×844, 820×1180 and 1440×900 layouts. Menus fit the viewport; report submission stays disabled; native image clipboard copying succeeds. Existing Hindi article Studio and the X screenshot controls still work.
- Long Hindi/emoji text, 100 short lines and 250 wide CJK characters fit the export canvas. The CJK text height is 432px, with no text overflow or overlap with the author attribution.
- Actual anonymous PNG responses are 1080×1080 for Copy snap and 1200×630 for link previews. Local scraper-style requests with Twitterbot, Facebook, WhatsApp and Telegram user agents receive the expected Open Graph/Twitter tags.
- Local-only multilingual discussion `0d44c8cdcba32c84` was created through the UI for Hindi, Chinese and emoji checks. Existing discussion and article content was not edited.
- No external social posts were made. Actual receiving-app preview behavior is checked after deployment; this local verification covers the served metadata and image bytes.
- The original mobile checkout still has exactly 18 staged files and its staged binary diff retains SHA-256 `ABF1FE8411D653863BBC54639D0B4B45EE4819A316FA31DFBD7869F7F69A702D`.
- The new PNG handler is part of the Next.js frontend deployment. No Go service, database schema, authorization code or dependency versions changed. DM Sans assets include their open-font license.
