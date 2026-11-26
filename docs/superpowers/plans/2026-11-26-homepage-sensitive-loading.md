# Homepage sensitive-content loading implementation plan

> Execute inline on the existing codex/nsfw-reporting-age-gate branch; use an independent layout implementer and final reviewer. User authorized implementation, local checks, commit and push; no PR.

## Scope and evidence
A local production-mode replay reproduced account -> individual policy -> list rereads, separate reveal waves, and an 80px mobile event placeholder becoming 278px. Preserve safe-card design, URLs, immediate writes, API compatibility and backend age/consent/ACL enforcement. Never mount concealed content to measure it. Do not touch production, the original staged-mobile checkout, or unrelated backend changes.

## Tasks
1. Add failing behavioral regressions for using fresh viewer-scoped list policy as the authoritative landing access result, without trusting public hydration, cached/failed requests, another viewer, stale revisions or mismatched targets. Keep the existing individual check fallback elsewhere. Reuse checked list data rather than an additional discussion-detail read.
2. Add a landing-only access provider using exact response-object identity and successfully fetched viewer-specific query results. Group the initial protected-card readiness so independent lists settle together. Keep successful routine refreshes steady; preserve explicit write invalidation and account reset behavior. Verify underage, missing DOB, denial/error and logout fail closed.
3. Add sensitive-only layout profiles shared by placeholders, gates and revealed cards across lead/feed/events/discussions/groups/rail/more-post variants. Derive tracks from existing typography/media ratios; keep safe-card path unchanged. Test before implementation and verify actual browser geometry across mobile/tablet/desktop.
4. Run relevant regressions and full frontend tests, lint and a local optimized production build. Record the whole homepage load at multiple viewport sizes. Recheck local API privacy/age matrix and immediate update paths. Inspect errors and compare timing/geometry with the saved before replay.
5. Independent review; fix material findings. Verify unrelated/staged files unchanged. Commit only relevant files and push the existing branch. No PR, production or unrelated service changes.

## Ledger
- Investigation complete: recordings and source identify duplicate policy/materialization reads plus inconsistent pending/restricted/revealed geometry.
- Ruling: retain existing branch per user, rather than create a new branch or merge main.
- Ruling: only current-viewer responses from successful mounted source reads can replace duplicate per-target checks; this is response provenance, not a persistent permissions cache.

- Implemented viewer-bound network receipts, exact-object landing policy reuse, grouped initial readiness, cancellation and fresh focus/mount reads; legacy per-target fallback unchanged.
- Implemented sensitive-only shared card tracks across all landing variants; no concealed child is mounted for sizing.
- Independent review caught an initial auth-generation race. Added a separate non-authorizing superseded-read hint and one reread per current validation generation. RED reproduced two failures; GREEN: 22 provenance tests.
- Browser inspection caught a zero-height mobile lead image container despite a successful protected image response; corrected grid fill. Final browser recording remains required.

- Final browser samples: protected slot heights and all four measured feed positions were constant at actual content widths 375, 805 and 1865px. Logged-out samples also held positions and mounted zero protected images/body markers.
- Full-page scrolling found a separate deferred ordinary byline footer growing from 44px to 94.7px for a long author name. Keep byline/actions in fixed grid columns and use existing author truncation; preserve all links/date/actions and fonts. Final production recheck required.

- Verification complete: final optimized build/type check and lint passed; full suite 272/2,387 plus post-refinement scoped runs. Final 39 content/media/HTML checks and 108 profile checks passed.
- Final whole-page recordings show stable feed positions and protected slot heights across mobile/tablet/desktop and anonymous states. Six lower footers stay44px with constant page height. Real503profilefailure at305px width also stays44px, withdate/actionsandnooverlap.
- Temporary local proxy fault and single metadata cache entry restored exactly; UI left onport3000. Browser temporarytabsclosed, originalhomepage restored and viewportreset. Review approved with browser-verification limits; scoped changes prepared for commit/push; final commit identity is reported in chat.
