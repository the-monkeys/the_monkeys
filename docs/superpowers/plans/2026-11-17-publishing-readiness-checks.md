# Publishing readiness implementation plan

> **For agentic workers:** Use superpowers:executing-plans inline, with one independent final review. Steps use checkbox syntax.

**Goal:** Rename the optional article/event review to Publishing readiness and strengthen evidence-based local checks without representing checklist completion as overall SEO strength.

**Architecture:** Keep the existing bounded snapshot adapters, report hook and themed drawer. Add pure text-quality predicates and conservative structural checks. Retain internal report fields, existing check IDs, visibility handling and public rendering rules; add checks without changing editor documents, forms or APIs.

**Tech stack:** Existing Next.js 14, React 18, TypeScript, Tailwind 3, Vitest. No new dependencies or backend work.

**Approved brief:** The owner requested Publishing readiness, stronger article/event checks, the existing responsive design and backward compatibility, local verification, no production access, preservation of staged mobile work, and a commit/push without a PR.

## Design and constraints

- The branch starts from freshly fetched main 38842903. The prior approved design commit is carried forward because main does not yet contain it.
- Use Publishing readiness for the entry and drawer. Keep Edit/Preview/Publish behavior and shared icon/text design. Long labels may wrap onto another toolbar row.
- Make passed/applicable counts the prominent result. Do not show an overall SEO/GEO/AEO rating or ranking prediction. Explain exclusions and human-review items through How these checks work.
- Preserve seoScore and scoreSeoChecks as legacy internal checklist-percentage contracts. Keep version v1 accepted for older reports; newly analysed reports identify the revised rules as publishing-readiness-v2.
- Titles must contain readable non-placeholder text. Descriptions must also add information beyond the title; no mandatory word count, keyword density, image or FAQ.
- Topic checks flag placeholder labels without claiming relevance. Heading checks flag empty body headings, repeated body H1s and skipped levels while preserving legacy title handling.
- Keep URL checks explicitly structural: do not open links/images or claim availability. Add optional unscored link-text and image-context observations; captions must not be presented as verified rendered alt text.
- Events use the same text predicates, reject placeholder/coordinate-only/URL-only in-person venues, and inspect description link structure. Virtual venues remain not applicable. Existing timezone, DST and saved/archive instant behavior is unchanged.
- Unknown/partial input stays unknown, optional omissions remain not applicable, private previews stay protected and new checks never save, submit or gate publishing.
- All product copy is original descriptive wording. No claims of engine endorsement or factual/semantic certainty; licence notices remain intact.

## Tasks

- [x] 1. Add failing article/event fixtures for placeholders, duplicate descriptions, Unicode/short legitimate text, optional image/link context, headings, partial input, venue modes and malformed references. Implement pure checks and version compatibility, preserving extraction limits and existing IDs.
- [x] 2. Rename the entry, drawer and footer and make counts prominent. Update the explanation and focused UI/integration regressions. Preserve drawer scrolling, focus/shortcut boundaries and stale/error states.
- [x] 3. Run relevant scoring/adapters/privacy/performance, editor/publication, event and accessibility regressions, types/lint and a local build where appropriate. Verify real components at mobile/tablet/desktop sizes using local content without publishing it.
- [x] 4. Request one independent final review, resolve findings and verify the separate 18-file mobile staging fingerprint. Delivery is a commit and push of codex/publishing-readiness-checks; no PR is created.

## Evidence and rulings

- Ruling: keep the percentage fields internally for compatibility but remove the overall percentage from product display. Completion of a small structural checklist cannot establish overall SEO quality.
- Ruling: inspect URL syntax only and label it accordingly. Network probes would exceed this local-only scope and could disclose draft/private destinations.
- Ruling: retain Tailwind 3 and the existing TypeScript target. Unicode character properties use a cached RegExp constructor compatible with the current build configuration; no configuration or dependency upgrade is needed.
- Kept existing check IDs and added event description-link checks plus optional unscored image/link-text observations. Legacy v1 report fixtures remain supported. No editor documents, event payloads, publication validation, schedule conversion or public-page SEO rendering were changed.
- Red/green regressions reproduced placeholder acceptance, title-only descriptions, empty/repeated body headings, placeholder/URL-only venues, unclear unknown-schedule diagnostics and count grammar. Existing past-event, DST, private-preview, extraction-bound and no-network invariants passed.
- The independent reviewer found trailing colons/semicolons bypassed repeated-title detection. Article/event fixtures reproduced the issue; shared terminal-separator normalization fixes it while preserving distinctions such as C++ versus C#.
- Full regression run: 182 files, 1,068 tests passed. After the final review/copy fixes, the affected readiness, article publication, event form and group-event submission run passed 246 tests in 13 files. The full suite was not repeated after these focused corrections.
- Scoped lint and the isolated production build passed. The build used synthetic local API data with production application hosts denied. Generated build files and the temporary TypeScript include are removed/restored after verification.
- Browser verification used the existing local article and an unsaved local event form at 320px/390px mobile, 820px tablet and 1440px desktop, including dark mode, footer help and Escape/return focus. The article's editable text was unchanged before/after review; the event was never saved or published. Missing schedule input remained Unknown and placeholder/repeated descriptions produced Improve.
- Original mobile staging remains 18 files on codex/mobile-landing-fixes, fingerprint ABF1FE8411D653863BBC54639D0B4B45EE4819A316FA31DFBD7869F7F69A702D. Its separate site-wide navbar overflow at 320px remains outside this change; the report controls fit at 320px.
