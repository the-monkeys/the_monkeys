# Free creator and event readiness: local verification

Date: 12 November 2026

Branch: `codex/free-creator-event-seo`, based on `ffa870a3`.

Visible feature checkout: `C:/Users/Dave/.codex/worktrees/free-creator-event-seo/the_monkeys`.

## Delivered behavior

- Post creators can open **Check readiness** from the editor. Event hosts have the same control in standalone event creation/editing and group event creation.
- One shared drawer provides an explainable automated SEO estimate, Answer readiness observations and Source clarity review questions. Everything is free. There are no payment gates, model calls, provider keys or new packages.
- The report reads current unsaved values. It never changes content, calls editor save/submit handlers, geocodes, uploads, or blocks valid publishing and scheduling. It refreshes after 800 milliseconds while open; closed reports perform no analysis.
- Account, resource and revision guards prevent stale results from replacing a newer report. Unsupported, malformed and oversized documents show partial coverage rather than an exact preview. Analysis stays within fixed limits.
- Restricted content has no public preview. Unknown audience or enclosing-group visibility stays unknown. Private meeting-link and attendee fields never enter the event projection.
- Missing legacy event visibility is unknown until explicitly chosen. Pending cover uploads are unknown. Existing instants, seconds, timezone, recurrence, venue and submit contracts are preserved.
- A local loading/error boundary handles rejected report downloads and render failures. Retry creates a new loading attempt. Editor content and normal controls remain available.

## Automated evidence

Commands ran against the existing installed project tools with a local runtime guard blocking production requests. No dependency installation or lockfile change was needed.

- Full suite: `node node_modules/vitest/vitest.mjs run --maxWorkers=2 --minWorkers=1 --silent`. **166 files, 952 tests passed**, 449.32 seconds. Includes existing editor title/history, publication, event form/time/calendar, SEO/schema/catalog/feed/route-policy and metadata/sitemap coverage.
- Types: `node node_modules/typescript/bin/tsc --noEmit`. Passed.
- Scoped lint: existing ESLint binary over changed TypeScript files, the new readiness directory, shared helper and tests. No errors or warnings.
- Production build: existing Next build binary with `NEXT_DIST_DIR=.next/readiness-build`, two workers, loopback-only fixture APIs and production access blocked. Passed, including all 47 static pages. Existing Browserslist age, Tailwind glob and storage-fallback warnings are outside this feature.
- `git diff --check`: passed.
- Public metadata extraction was moved literally into `postSeoContent.ts`. Before/after regression tests preserve title precedence, descriptions, images, private/draft behavior, canonical boundary cases and JSON-LD. No robots, sitemap, RSS, canonical policy or publisher change was made.
- Generated bundle manifests: no readiness UI/engine markers in initial root layout, landing, public post or public event route chunks. Report content is a separate lazy chunk (`68251.b80febdb41518539.js` in this build); authoring routes contain only the entry/analysis dependencies and local recovery UI.

### Review regressions fixed before final verification

An independent read-only review found seven issues, all addressed with regression coverage:

1. Failed report download could reach the page error boundary. Reproduced in loader tests, then passed with editor/state preservation, retry, close and late-completion guards.
2. Repeated unfinished HTML tags caused nonlinear processing. Replaced the report adapter's regex scanning with forward-only bounded tokenization. Malformed input becomes partial and skips public preview extraction. The public SEO helper remains unchanged.
3. Oversized nested-list metadata could bypass the allocation budget. Metadata now uses bounded inspected strings and stops when coverage becomes partial.
4. Unresolved/private enclosing post groups could appear public. Context is now passed from the existing publication state and handled conservatively. Integration RED: expected unknown, received public. GREEN: all 15 publication-page tests passed.
5. Missing legacy event visibility inherited a form default. The report now distinguishes missing data from an explicit public selection.
6. Existing-event cover upload state was not projected. Upload pending is now observed without triggering uploads.
7. Group event creation used a separate form. It now has the same report without changing its one-body submission signature. Standalone/group form regression coverage passed 18 tests.

The final full suite includes these fixes. Detailed RED/GREEN logs live in the backend checkout's ignored `logs/readiness/` directory, not in the release or a public repository.

## Local browser checks

Preview: `http://127.0.0.1:3002`, with a separate in-memory fixture API on loopback. The user's existing preview/API destination was not changed. Test records were explicitly labelled “Local test”; no real account, database, production API or meeting link was used.

- Real creator editor: opened the report, edited the H1, observed the refreshed title, closed/reopened, and confirmed title preservation and restored trigger focus.
- Standalone event edit: changed unsaved title, observed it in the report, closed it and successfully saved to the fixture. Result remained `2099-11-12T13:30:12Z` to `2099-11-12T15:00:54Z`, `Asia/Kolkata`.
- Standalone event creation: checked incomplete content at 320px; partial findings appeared, title stayed intact and Save draft remained enabled.
- Private group event creation: members-only content showed “Not intended for public search” and no search preview. Closing kept form values and restored focus.
- Successful normal post publishing and scheduling used existing UI controls and reached the fixture's publish and schedule endpoints. The native time field needed a keyboard commit during browser automation; no scheduling code was changed.
- One shared drawer was measured at 320, 390, 430, 768 and 1440px. Light/dark themes, 44px controls, no horizontal drawer overflow, internal scrolling, Tab focus containment and close-focus restoration were checked. At 320x420px the drawer was 378px tall and remained scrollable. This is reduced-height keyboard simulation, not physical iOS/Android keyboard testing.
- Offline chunk failure and deliberately failed analysis were covered with deterministic automated rejection tests. They were not tested by disconnecting the user's network.

Browser outcome record: ignored `logs/readiness/browser-final-flow-results.json`. Screenshots: `creator-final-mobile.png`, `creator-final-mobile-dark.png`, `event-final-mobile.png`, `group-event-final-mobile.png` in the same ignored directory.

These checks validate frontend behavior against fixtures. They do not claim a new real-backend end-to-end deployment or physical-device Safari validation.

## Local performance

Windows, AMD Ryzen 9 8945HS, Node 24.4.1. Five runs of snapshot extraction plus analysis, measured with `performance.now()` in Vitest:

- 10,000-word draft: 4.99 to 9.15 milliseconds.
- Maximum bounded document: 5.07 to 13.69 milliseconds.
- 60,000-character malformed markup: 6.62 to 13.58 milliseconds.
- Oversized list metadata: 1.97 to 4.01 milliseconds.

The independent review's adversarial case previously took 17,524.97 milliseconds and measured 25.89 milliseconds after its fix. Final measured cases remain below the plan's 50ms worker threshold on this machine. This is a local benchmark, not a promise for every device.

## Preservation and delivery

- Original frontend remains on `codex/mobile-landing-fixes`, HEAD `ffa870a3`, with all **18 staged mobile files** unchanged. Staged binary-diff SHA-256 before and after: `BDD545DF3BB4B3B3CDDAC6C73768A25DC69CE3309CDEA46D3013388117A173D8`.
- The feature checkout has only uncommitted feature/document/test edits. Nothing was staged, committed, pushed, merged or deployed for this request.
- No backend code, production data, environment credentials or original dependency installation was changed. Generated build-directory changes to this checkout's `tsconfig.json` were reverted.
- Optional publish-drawer score summary was omitted to avoid a second stale summary and nested modal behavior. The original publish drawer is unchanged.
- Plan Task 8 (separate backend indexing cleanup), model-assisted rewriting, analytics, group/discussion analysis and future comment features remain separate work. Existing group event hosts are included in this first release.

## Rollback

Remove the readiness entry from the editor, EventForm and GroupEventForm, then remove the feature directory and associated tests. Revert the shared SEO-helper extraction together with its public caller only if its unchanged baseline tests still pass. No database migration, saved-content rewrite, billing state or URL change needs reversal.
