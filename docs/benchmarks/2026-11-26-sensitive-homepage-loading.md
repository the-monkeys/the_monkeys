# Protected homepage loading - local verification, 26 November 2026

The homepage now reuses backend policy decisions from fresh, viewer-bound list reads instead of issuing another policy GET for every protected card and sometimes refreshing the same lists again. Initial protected cards settle together; unrelated ordinary sources do not block them. Public hydration, copied or cached payloads, failed reads and another session never become permission proofs. Receipts bind exact network objects to their QueryClient and auth-query generation. A response superseded by session validation gets one bounded reread against the current generation. Real errors remain closed. Focus/reconnect/mount checks and post-write refreshes remain immediate, and late reveal callbacks cannot affect another account.

Sensitive cards retain the same footprint while pending, restricted and revealed. The shared profiles cover the lead, feed and lower post variants, events, discussions, groups and rail rows. No concealed child is mounted to measure it. Ordinary compact discussion identities no longer grow when names/handles arrive, sensitive trending rows reserve title space, and deferred lower-card bylines/actions retain one row with existing name truncation. The unavailable-author fallback cannot overlap the action column.

Existing design typography, routes, IDs, publishing, schemas and service boundaries remain. No backend change, service, dependency, authorization cache or private-data serialization was introduced. Ordinary callers retain the previous API/default behavior; cancellation arguments and layout options are additive.

## Reproduction and observations

Optimized Next.js build and production server, local APIs on loopback 8081, final UI on localhost:3000, existing safe synthetic NSFW fixtures. No production requests or deployment. The adjacent JSON records the build ID, actual working-source hashes, frame samples and privacy observations.

Before: the mobile event placeholder grew from 80px to about 278px, moving the next row about 198px. A later mobile post moved about 233px; a desktop feed post moved about 84px. Cards finished in several waves.

After: requested viewport widths 320, 390, 820 and 1880px were checked; measured content widths were 305, 375, 805 and 1865px. Recorded mobile, tablet, desktop and anonymous loads had zero movement across all four monitored feed positions and constant protected-slot heights. The four protected gates settled in one sampled transition. A complete mobile scroll loaded all six deferred footers at 44px each; page height stayed 8,988px throughout those samples. A real local 503 profile-lookup test at 305px content width retained a 44px footer, its date and separate actions without overlap. The proxy and its single public metadata cache entry were restored exactly afterward.

Sampled protected-card settlement after initiating reload ranged from about 1.4 to 2.3 seconds for signed-in runs. The first run after restarting the UI was slower than a repeat. These small samples include automation overhead and differing warm-up/cache states; they do not establish a production speed percentage. The structural improvement is removal of duplicate checks/materialization reads and stable rendering, while fresh access checks remain required.

## Verification

- Full frontend suite: 272 files / 2,387 tests passed before the final presentation refinements. Subsequent relevant regression passes included 181 discussion/landing/policy tests, 107 landing/gate tests and the final 40 homepage/layout tests.
- Production build/type checking and scoped lint passed. Final footer lint had no warnings/errors. Existing Browserslist staleness and test-environment warnings are not new application failures.
- Local content/media/HTML matrix: 39 checks passed on the final port-3000 UI. Profile privacy matrix: 108 checks passed, zero email/DOB leaks to other viewers.
- Browser: anonymous, underage and missing-birthday cases mounted no protected body markers/images; underage had no reveal action; missing birthday showed profile actions. Remembered adult consent restored cards without another prompt. Logout removed protected text/images. Final normal-load console checks found no hydration or uncaught errors.
- Meaningful RED/GREEN regressions covered source provenance, pending coordination, stale/cross-account/failure rejection, bounded generation recovery, cancellation and late reveal responses. Browser reproduction caught and verified the mobile image fill, ordinary identity growth and deferred-footer growth.
- Original staged-mobile patch and unrelated backend changes retain their pre-task byte hashes. Generated build artifacts/config changes are excluded from the commit. No PR is created.

## Evidence and limits

Timed JPEG sequences, sequential DOM measurements and MP4 replays are saved locally in `monkeys-smooth-final-20261126` under this chat's visualization directory. They are sampled replays, not continuous native video or measured CLS/LCP/INP. Chromium responsive emulation was used; physical devices, Safari/Firefox and field Core Web Vitals were not tested. Local fixture media is intentionally small and safe. After deployment is confirmed, repeat comparable public-page and device checks before attributing field performance changes to this work.
