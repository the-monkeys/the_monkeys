# Multilingual article slugs implementation plan

> **For agentic workers:** Use superpowers:executing-plans inline, with one independent final review.

**Goal:** Generate readable multilingual article slugs while keeping old shared URLs resolvable, existing ASCII-only English slugs unchanged, and article IDs intact.

**Architecture:** Update the pure slug generator and shared post-URL helpers. Public paths are percent-encoded once at URL boundaries; publish/schedule payloads keep an ordinary string and the same ID suffix. Existing ID-based article lookup accepts old and new aliases without redirects or record migrations. Keep RSS GUIDs on their existing legacy permalink calculation while updating item links.

**Stack:** Existing Next.js 14, React 18, TypeScript target and Vitest. No new packages, backend changes or protobuf generation.

**Approved brief:** Fresh branch from latest main; local tests for Hindi and other languages; preserve URLs/IDs/design/privacy; no production or staged mobile changes; commit and push without a PR.

## Decisions and compatibility

- Branch codex/multilingual-article-slugs starts from freshly fetched main 38842903. Earlier Publishing readiness work stays on its separate pushed branch; this fix is independent.
- Preserve Unicode letters, numbers and combining marks, normalize new slugs to NFC, remove joining-format characters without splitting their word, and use hyphens for separators. Empty/emoji-only/mark-only input has a readable fallback.
- Preserve the exact ASCII English apostrophe/possessive behavior. Keep a legacy generator for old RSS identities, including decomposed input behavior.
- Old shared paths continue to load using their final ID. Canonical links for non-Latin titles become readable Unicode URLs; this is deliberate. Do not force redirects or rewrite stored articles.
- Publishing uses the same public title extraction/truncation as the reader, while sending an unencoded slug string. Metadata, JSON-LD, sitemap, RSS links, topic/learning cards and notification paths use the shared encoded title helpers.
- Search/following responses may supply a bare prefix or a complete stored slug. Remove only a matching ID suffix when needed, encode once and reject malformed/path-like stored values in favor of a title-based fallback. Never append an article ID twice.
- Existing public/private rendering, permissions, title enforcement, save/schedule/publish handlers and API payload shapes remain intact. No language-prefix routes or translations are introduced.
- Do not change the original 18 staged mobile files or shared dependencies. No production requests, writes, submissions or indexing actions.

## Tasks

- [x] 1. Add failing slug, encoding, legacy-ID and feed/discovery consistency fixtures. Implement the bounded helpers, Unicode normalization and RSS identity compatibility.
- [x] 2. Use the shared helpers in publication, canonicals, search/following adapters and feeds. Verify multilingual publish/schedule bodies and old aliases resolve the same IDs; preserve unrelated behavior.
- [x] 3. Run focused regressions and the full frontend suite. Request one final review, resolve findings, then run types/lint and one isolated production build with synthetic local data and production network access denied. Verify rendered Hindi and legacy URLs in the local browser at responsive sizes.
- [x] 4. Clean generated verification files, verify original mobile staging, commit and push this branch. No PR.

## Evidence

- Current ASCII-only replacement strips Hindi/Japanese completely and damages accented Latin text. The reader already fetches by final article ID; gateway publication forwards the slug string unchanged to gRPC, so the fix needs no backend contract changes.
- Ruling: retaining old aliases does not mean retaining the unreadable canonical for non-Latin titles. Canonicals/discovery are upgraded together, while old paths keep resolving by ID.

- Regression evidence: the original generator failed 31 multilingual/URL assertions. Additional regressions reproduced a combining-mark-only stored prefix and a legacy document title fallback before their fixes.
- Focused verification: 82 tests passed across slug generation, URL boundaries, discovery consistency, real search components and editor publication/scheduling. Hindi publish and schedule preserve the original draft ID and document.
- TypeScript and scoped ESLint passed. One fresh independent whole-change review returned no findings.
- Read-only original checkout verification: 18 staged mobile files, unchanged SHA-256 fingerprint `ABF1FE8411D653863BBC54639D0B4B45EE4819A316FA31DFBD7869F7F69A702D`.

- Isolated production build passed with synthetic loopback APIs and a guard denying production application traffic; no backend build or data changes were needed.
- HTTP verification passed for 14 new/legacy aliases across Hindi, German, Japanese, Arabic and English. All returned HTTP 200, with consistent canonical URLs, sitemap entries and RSS links, and unchanged legacy RSS GUIDs.
- Browser verification: Hindi at 390×844, 820×1180 and 1440×900, with document widths 375, 805 and 1425 respectively (no horizontal page overflow). New and old Hindi/Japanese paths displayed the same article title and canonical. Existing design and navigation were retained. Screenshots saved outside the repository.
- Temporary browser tab closed, viewport reset, and only this task's synthetic API and verification server stopped. Existing local UI and backend services were left running. Build-only TypeScript config edits and output were removed.

- Final full frontend regression run: **183 files / 1,076 tests passed**, exit 0. Focused suite, TypeScript, scoped ESLint, independent review and isolated production build passed before delivery.
- Final original mobile staging check passed again: the same 18 files and exact fingerprint. Delivery is limited to this branch's 14 relevant files; the final Git commit and upstream tracking record the commit/push outcome. No PR or production changes.
