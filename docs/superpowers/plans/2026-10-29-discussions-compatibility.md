# Discussion release compatibility

Use the existing local repositories. Do not access production, change event data, generate protobuf code, push, or merge a remote PR.

## Tasks

1. Resolve the local integration of main into PR 731 on codex/discussions-compatibility. Preserve modern event timezone, calendar, notification and members-only sharing fixes, together with discussion and mixed-feed behavior. Preserve all pre-existing user changes.
2. Add failing regressions for group draft scope across refresh and reopening, unresolved group lookup, explicit scope removal and discussion feed pagination. Persist scope through the existing draft JSON contract and resolve intended groups directly with active membership checks.
3. Add failing regressions for signed-in discussion detail. Keep anonymous discovery as the SEO eligibility check, but render the authenticated payload when a session is supplied without leaking private content into discovery.
4. On a separate backend fix branch, reproduce and fix private edit existence disclosure and attachment leakage from redacted tombstones. Preserve intentional owner access and existing deep reply support. No proto changes are required.
5. Run focused regressions, frontend type/lint checks and the full frontend suite. Run the affected backend unit packages with external access disabled. Review the integrated change and check responsive UI locally where the local stack is available.

## Review focus

Group intent must never silently become public while unresolved. Legacy drafts without scope retain public defaults. No frontend-only permission bypass. Public SEO must not use private authenticated bodies. Event behavior from main must survive the old PR integration. Keep user edits and generated discussion files out of new commits.

## Decisions and progress

- Preserve author access after leaving a group and existing deep reply support; both are intentional shipped contracts. Tightening them would break compatibility.
- Thread pagination after 100 replies and reply deletion need separate API/product work and are not proven regressions in this PR. Report these limitations explicitly.
- The integration merge is local only and does not authorize a remote merge or push.
- Integration: all 17 file conflicts resolved. Main's timezone implementation retained exactly; mixed group feed and configurable sharing retained from PR 731.
- Discussion rendering: authenticated detail and site-feed payloads now receive the session; anonymous payload remains separate for metadata and JSON-LD. Regressions failed before the fix, then 13/13 passed.
- Shared event previews now accept the viewer timezone. Regression failed before the fix, then preview tests 15/15 passed.
- First full frontend run: 738/741 passed. Three failures were old menu-order/empty-copy expectations after the integration. Updated those tests; their focused run passed 8/8. Final full run is in progress.
- Group publication implementation: 38 focused tests passed; draft scope persists using existing JSON fields; pending/failed membership cannot publish; explicit removal remains possible; group discussion pagination is independent of blog pagination.
- TypeScript check passed after correcting the iterator to support the existing compilation target. Existing user tsconfig changes preserved.
- Browser verification is pending: the Monkeys local backend containers are stopped. No production or unrelated running project was contacted.
- Final review: discussion rendering, preview, sharing and backend tombstone/edit changes had no further findings. Two group publication issues require fixes: viewer-independent blog cache on failed revalidation, and absent explicit detach in final publish/schedule requests. Add regression coverage before fixing.
- Review ruling: cross-draft editor state is isolated by Next 14's dynamic parameter router key; no speculative remount change is needed. Cost if wrong is stale publication state, covered by existing refresh/reopen tests but not a runtime route-navigation test.
- Review ruling: the final-action detach finding is not reproduced by the current backend. Gateway publish and schedule normalize omitted/empty group_slug to public explicitly (routes.go lines 486 and 546). Keep this backward-compatible contract; explicit empty draft fields are still required for draft persistence. Reassess if a future publication API adopts omission-as-preservation semantics.
- Final frontend verification before the cache review correction: 150/150 files, 741/741 tests passed with external networking blocked. TypeScript passed. Lint passed with existing warnings.
- Backend discussion regressions: eight privacy/redaction failures reproduced before implementation. All four affected packages passed afterwards (database, domain, service and gateway), including owner-access and deep-reply compatibility coverage.
- Backend old-client draft preservation: regression reproduced scope erasure, unreadable-scope overwrites and concurrent replacements. Implementation preserves only absent scope keys, keeps explicit empty values, refuses unreadable scope and uses Elasticsearch sequence guards. Fresh read-only review found no additional issues; final tests are pending.
- The reviewer withdrew the final-action detach finding after verifying both current gateway handlers. No publication API behavior change is required.
- Final backend verification passed all five affected packages with vet enabled, dependency downloads disabled and mocked SQL/Elasticsearch. Four fix files staged; existing generated discussion files remain unstaged.
- Cache correction verified RED to GREEN: blog queries are isolated by viewer and group standing; failed revalidation suppresses cached previews; unverified blog pagination does not prevent independent discussion pagination. Existing query invalidation prefixes remain compatible.
- Frozen final verification: 151/151 frontend test files, 751/751 tests passed. TypeScript passed. Lint exited successfully with existing warnings. Offline test output is in the backend's ignored logs/discussions-compatibility-*-verified.log files; backend package output is logs/discussions-compatibility-backend-tests.log.
- Both repositories remain on codex/discussions-compatibility with relevant changes staged. No commit, push or remote merge performed. The frontend's fully resolved local integration merge awaits commit. User configuration/design/landing edits and backend generated files remain excluded.
- Before remote merge: commit and publish the reviewed changes, then run local browser checks against the local backend. The backend is currently stopped, so no browser end-to-end or viewport verification is claimed. No production access or existing event-data changes occurred.

## Local runtime follow-up

- Rebuilt only blog and discussions, sequentially. Other required API/data services used cached images. AI commented out in the local root Compose working copy, deliberately left unstaged as a local-only change.
- Local services use the internal restore-local network, local PostgreSQL/Elasticsearch/MinIO and blocked outbound mail/FRN. Existing local access proxy exposes loopback API ports. Frontend runs on 127.0.0.1:3000 with a separate ignored isolation harness blocking production HTTP requests and browser analytics.
- Restored DB was at clean version 22 with no discussion tables. Applied existing migrations 23 and 24 transactionally to the local database only; an event-row checksum guard verified all event records were unchanged.
- Refreshed the local gateway connection after the new discussion container became available; anonymous discussion feed now returns HTTP 200.
- In the signed-in @dave UI, created one clearly labelled synthetic local discussion, posted one reply and liked it. Reload retained the reply and pressed like state. Checked discussion thread at 390, 768 and 1366 pixels with no horizontal overflow. Screenshot: backend ignored logs/discussions-local-thread-desktop.png.
- Full group privacy/end-to-end scenarios remain pending. User redirected the next activity to backend discussion improvements for a short-post/community-thread hybrid. This is design discussion, not approval to implement new features or change current APIs.

## Discussion visual consistency follow-up

- User prioritized the sparse discussion detail layout and inconsistent action icons. Kept the existing APIs, permissions, edit window and delete confirmation unchanged.
- Discussion feed and detail now share heart icons, visible Like/Reply/Share labels, 44-pixel action targets and the existing coral focus/active styling. Feed actions are interactive; Reply links to the thread's replies section. Share reuses the existing dialog with an optional visible trigger label, preserving other callers.
- Used neutral bordered cards, the existing Newsreader heading font, a balanced content width and full-width action rows. Existing group mixed-feed cards remain embedded in their parent rows. Metadata and schemas were unchanged.
- Added checks for labelled reply/share controls, share dialog opening, guest login gating and failed-like rollback. Verified RED before implementation, then all 42 discussion tests passed. Full suite: 754/754 tests across 151 files passed. TypeScript passed; lint exited successfully with existing warnings.
- Local browser checks: feed and detail, like/unlike, share dialog and reply navigation. Verified 390, 768 and 1366 pixel layouts without horizontal overflow, plus light/dark styling. Restored the original light theme and default viewport. Screenshots are in the backend's ignored logs/discussions-design-mobile.png and logs/discussions-design-desktop.png.
- This follow-up changed frontend presentation only. No production access, API changes, commit, push or remote merge.
