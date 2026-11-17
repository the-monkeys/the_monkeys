# Editor readiness design implementation plan

> **For agentic workers:** Use superpowers:executing-plans for inline implementation, with one independent final review. Steps use checkbox syntax.

**Goal:** Apply the approved Monkeys editor toolbar/report mockup and explain the actual score in simple English through a report-footer action.

**Architecture:** Reuse the existing editor, publication drawer and optional browser-local analyser. Extract a responsive toolbar with Edit/Preview tabs and a matching SEO & AI action. Restyle the existing bottom drawer without changing report data or rules; put the score explanation inside its scrolling body, opened from the footer so long help text cannot crowd out controls.

**Tech stack:** Existing Next.js 14, React 18, Tailwind 3 and Radix/Vaul components. No dependency upgrades.

**Spec:** Approved design in this chat on November 17: uniform unboxed Edit/Preview/SEO & AI controls, existing black Publish primary action, neutral connection status, white/black/coral theme and responsive bottom report drawer. The owner additionally requested an explanation of the score in the footer. This document includes the complete implementation brief.

## Constraints

- Branch codex/editor-readiness-design starts from freshly fetched origin/main 38842903. Earlier SEO branch remains pushed separately.
- Preserve the separate original 18 staged mobile fixes. No backend, production, database, licence-notice or dependency changes.
- Preserve editor document identity, unsaved content, title enforcement, permissions, image-upload constraints, scheduling and publishing validation.
- Formula remains Math.round(100 * passed / counted), where counted means scored SEO checks with pass/improve status. All counted checks have equal weight. Unknown, manual and not-applicable items and all non-SEO observations are excluded. No counted checks yields null, not zero.
- Product copy describes actual behavior in original wording, without claims of exclusivity, origin, third-party endorsement or predicted rankings. Required licence notices remain intact. No legal guarantee is represented by this UI work.
- Use existing project tokens/components and compatible Tailwind utilities; the installed version takes precedence over a generic skill's version recommendation.

## Review focus

- Opening/retrying/closing reports must not remount or save/publish the editor.
- Checking, stale and error states must never represent an old report as a current result or block authoring.
- Private/unknown/partial content must not acquire an exact public preview.
- At 320px, large text and short viewport heights, header actions remain usable and report help remains scrollable with reachable Close/Back controls.
- Browser-local checks must not turn a connection indicator into a false Saved claim or introduce network analysis.

## Tasks

- [x] 1. Add score explanation regression tests and footer-to-body help. Explain the six-post-check categories, equal weights, rounded example (4/6 -> 67), exclusions, no-data behavior, and separate answer/source review. Keep analyser/rules unchanged. Existing scoring tests remain authoritative.
- [x] 2. Extract and test the editor toolbar. Keep existing Tabs semantics and callbacks, preview upload guard, and publication/readiness actions. Add an opt-in toolbar presentation to PostReadiness, retaining the existing default entry contract for other callers. Show connection/saving state honestly. Reuse a single icon/text style for all three tools.
- [x] 3. Restyle the report with existing tokens: serif title, neutral summary, clear statuses, compact findings, search preview, Close and footer actions. Preserve findings, visibility explanations and accessibility. Keep checking and failure notices isolated from toolbar layout.
- [x] 4. Verify relevant regressions, types, scoped lint and local responsive behavior with non-production data. Get one independent review; fix actionable findings. Verify the original mobile staging fingerprint. Delivery is a commit and push on this branch; the owner creates the PR.

## Footer copy

**How this score works**

Each automated SEO check that can be evaluated counts equally. We divide passed checks by all counted checks, multiply by 100 and round to a whole number. For example, 4 passed checks out of 6 gives 67/100. Checks marked Improve count but do not add points. Unknown, Human review and Not applicable items are excluded. If no checks can be counted, no estimate is shown. Answer readiness and Source clarity are reviewed separately and do not change this number. This is a checklist estimate, not a prediction of search rankings, indexing, traffic or AI citations. Review suggestions, return to your draft and check again after changes.

## Execution record

- Latest main fetched and fresh branch created; editor and readiness files match the earlier branch, so no unrelated SEO changes are being carried over.
- Added original explanatory copy to the report footer's "How this score works" action. It opens help in the report body, including the actual counted values and a rounded example. The analyser, rules, adapters, data and API contracts are unchanged.
- Existing default "Check readiness" entry remains available to other callers. Only the post editor opts into the matching "SEO & AI" toolbar action. Saving status uses existing state; it never equates Online with Saved.
- Browser checks used the real toolbar, PostReadiness and drawer components with a temporary local sample. No sample article was created, saved or published. The temporary route was removed after verification.
- Verified 320x568 and 390x844 mobile, 820x1180 tablet, 1440x900/1000 desktop and 320x360 short-screen layouts, plus light/dark mode, upload-disabled Preview, Offline, restricted preview, Escape and return focus. All report controls retain at least 44px height. Long help scrolls only the body; outer overflow clipping keeps the header/footer fixed.
- An independent review identified shortcut leakage from portaled retry controls and insufficient small-text contrast. Both were fixed. A regression using the real editor shortcut hook reproduced the undo issue before the fix and passes afterward. Coral is retained as an accent beside readable status text.
- Final affected test run: 11 files, 189 tests passed. The broader run had 1,023 passes and three failures caused by assertions for the old button label and inline toolbar source location; those assertions were updated and all affected files passed the final run. The entire suite was not repeated after these targeted corrections.
- TypeScript and scoped lint passed. An isolated Next.js production build passed using synthetic local API data and a network guard denying production application requests. Generated build files and the build-only TypeScript include were removed/restored afterward.
- The separate original mobile checkout still has 18 staged files and fingerprint ABF1FE8411D653863BBC54639D0B4B45EE4819A316FA31DFBD7869F7F69A702D. Its existing site-wide navbar overflows at 320px; that unrelated navbar work was not changed here. The editor toolbar and report fit at 320px.
