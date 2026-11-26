# Production Page Performance Implementation Plan

> For agentic workers: use Superpowers executing-plans; complete the checked verification gates before committing.

**Goal:** Measure an optimized local build, reduce demonstrated shared bottlenecks, and preserve immediate writes, design, existing API contracts and NSFW authorization.

**Architecture:** Keep the current services and query boundaries. Reuse local production-mode builds for repeatable before/after HTTP and browser measurements. Improve proven expensive work before considering caches; no shared cache of viewer permissions or private payloads.

**Tech stack:** Next.js 14, React Query 5, Go gRPC, PostgreSQL, Python standard-library benchmark client.

**Spec:** User-approved performance pass in this chat, November 26, 2026; same branches, actual checkouts, no production or staged mobile changes, commit and push, no PR.

## Global constraints
- Retain the current codex/nsfw-reporting-age-gate branches; preserve unrelated patches and staged mobile checkout.
- All build/runtime API origins point to loopback services. No production load test in this run.
- Profile/avatar and other successful writes update existing query caches immediately and invalidate related reads. Old in-flight responses must not undo a successful mutation.
- Never trade away current-viewer NSFW policy checks, media protection, account separation, or private DOB/email exclusion.
- The optimized build is a production-mode workload on local fixtures, not a claim of production capacity or field Core Web Vitals.

## Review focus
- Avatar upload during an older read, missing-avatar recovery and simultaneous mounted avatars.
- Account changes, permission errors, privacy changes and new moderation revisions.
- Concurrent reads with repeated targets and mixed content types; no bypassing inaccessible or deleted content.
- Different data sets, redirects, cold compilation and warm HTTP caches must not be presented as equivalent measurements.
- A slow or failed endpoint remains visible as a failure in the benchmark, rather than disappearing from percentile calculations.

## Tasks
- [x] Build the current frontend into an isolated output directory with local-only API origins; record source SHA and environment, then start it on loopback.
- [x] Add a dependency-free benchmark harness plus local HTTP-server tests; inventory all static page routes and representative dynamic routes, identifying protected and unavailable paths.
- [x] Save before measurements at concurrency 1 and 4, raw samples and errors, warm-up rules and representative-data limitations.
- [x] Inspect measured frontend/backend critical paths. For each change, reproduce with a meaningful failing regression, implement minimally, then verify privacy and immediate-update compatibility. Do not add caches merely to improve benchmark scores.
- [x] Build the changed source under identical options and repeat the same route and API measurements. Record noisy or non-improving outcomes honestly.
- [x] Run affected regressions, full suite where relevant, type/lint/build checks; verify full mobile/tablet/desktop browser loads and profile-photo updates on disposable local accounts.
- [x] Save a readable baseline/comparison and future post-deployment commands. Verify protected patches unchanged.

Delivery uses the existing branches: commit and push only relevant files, no PR.

## Execution notes
- Application files will be selected only after the production baseline identifies a bottleneck. A sidecar review examines moderation query fan-out without changing permissions.
- Build CPU and heap limits are identical before/after to fit the existing hardware; no new service or machine-resource purchases.

- Baseline: 38 routes, five measured samples each, concurrency 1 and 4; one sequential warmup per route. Anonymous `/feed` redirects are expected. `/learn` fails with HTTP 500 after its public catalog request returns 503.
- Measured shared frontend issue: namespace icon lookup retains all 3,058 Remix exports (2,308,082 raw / approximately 451 KB gzip in the root layout chunk). Replace with synchronous named-import registry preserving the declared icon API.
- Measured backend issue: twelve scalar scanner-owner lookups take a median 868.683 ms combined; equivalent full-view batch join takes 59.034 ms. Batch only scanner facts inside the existing Check transaction; retain fresh identities, visibility, rating/reveal and media checks.
- Frontend full regression suite after icon change: 267 files / 2,313 tests passed.

- Final verification: 268 frontend files / 2,319 tests passed; 20 benchmark-tool tests passed; production build/lint passed. Browser diagnostics also reproduced a baseline nested-button TopicListDialog hydration failure. The asChild correction preserves the styled trigger; SSR, dialog behavior and production browser regressions passed.
