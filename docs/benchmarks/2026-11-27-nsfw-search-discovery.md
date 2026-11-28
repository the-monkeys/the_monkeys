# NSFW article search discovery — local verification, 27 November 2026

## Outcome and scope

Implemented on the existing `codex/nsfw-reporting-age-gate` branches in the actual backend and frontend checkouts. Verified indexing crawlers can obtain original published public NSFW article text, while human login, profile-birthday eligibility, reveal consent and media protection remain enforced. Author data, article IDs and existing canonical URLs are preserved.

No production deployment, Compose modification, new production service, database migration or PR was performed. Production crawling is **not enabled by this report**: the private settings and trusted ingress contract in `docs/nsfw-search-discovery.md` must be configured and verified before enabling it.

Age checks use the existing self-reported birthday. This is not separate identity or age verification. External providers control their indexing, previews and AI citations; local tests cannot prove ranking improvement or contain off-site snippets to adults.

## Verified code and commands

Backend baseline: `11d46d4d4a9ee1e3b32e2f9851de31d03c47ad4b`.
Frontend baseline: `4a2dc692`.
The accompanying source-manifest JSON records SHA-256 hashes of every changed code/test file at verification. Line endings are normalized for reproducibility.

- Frontend: `node node_modules/vitest/vitest.mjs run --maxWorkers=4 --minWorkers=2` — **279 files, 2,479 tests passed**.
- Frontend: `node node_modules/typescript/bin/tsc --noEmit --incremental false` — passed.
- Frontend lint — passed with existing warnings; not a warning-free claim.
- Final optimized Next build — passed, `.next-seo-nsfw-requestguard`; shared first-load JS 96.4 kB, server middleware 26.9 kB. Built with rollout off, then enabled through private local runtime settings.
- Backend: `go test ./microservices/the_monkeys_blog/... ./microservices/the_monkeys_gateway/... ./common/moderation/...` — passed. This is the affected service scope, not a claim that every service/database integration test in the platform ran.
- Existing Gateway and Blog Dockerfiles built successfully into local test images; no Dockerfile or dependency changes.
- Live HTTP matrix against final UI **port 3000** and the test-only local proxy — **95 checks passed**. Redacted results accompany this report.

## Human/browser checks

Built-in Chromium browser, existing synthetic local sessions; no real-user account/profile/content edits for this feature.

- Anonymous article: login gate; original protected body absent.
- Minor: under-18 restriction, no Show content button.
- Missing birthday: existing Add your birthday flow.
- Adult: original article text and fixture image visible; consent persists after reload. The image was also checked after load, rather than interpreting an initial in-flight image as failure.
- Birthday boundary: the synthetic account turning 18 today can reveal inline without navigation. The fixture formerly called one_day_under_18 is no longer underage today; tests calculate its current age.
- Minor and adult article layouts at 320, 820 and 1440 pixels: no horizontal overflow.
- Anonymous homepage at the same widths: no horizontal overflow or sensitive-warning inner scrollbars; protected article body absent.
- Earlier control check: normal Smart Home article at those widths retained one H1, canonical/indexing metadata and no horizontal overflow.
- Final guarded build was retested on port 3002, then the same artifact was served on port 3000 and the minor/adult journeys repeated there.
- Viewport override reset; requested localhost homepage left open. No console errors in the focused final article inspection.

These checks supplement the previous user-journey regression report. They do not claim every control on every page or every browser engine was retested for this addition.

## HTTP and compatibility evidence

The 95-check matrix covers six current age/account states, original body and restricted image authorization, private/no-store responses, and four crawler identities: Googlebot, Google-InspectionTool, OAI-SearchBot and PerplexityBot.

It checks original canonical preservation, index/snippet eligibility, registration-gated schema, absence of article-body duplication in JSON-LD, and absence of private signing/ingress values in returned HTML or headers.

After warming crawler responses, anonymous/minor/missing-birthday HTML, embedded streams and Flight responses remain protected. Fake user agents, incorrect source IPs, incorrect ingress secrets, real RSC/Flight prefetch, forged document markers and excluded user-triggered AI agents do not receive protected text.

A header-only prefetch probe that Next treats as ordinary HTML remains a document for a genuinely authenticated indexing crawler. It is not equivalent to actual Flight prefetch and does not authorize a spoofed bot/browser.

The sitemap lists the existing restricted canonical exactly once; RSS excludes its original content and location. Owner profiles remain readable, and public username/account endpoints plus another signed-in reader do not receive the tested private profile values or nonempty private fields.

Contract tests cover default-off configuration, absent/old-backend capabilities, optional fields, public/private/draft/future exclusions, signed-target binding and refresh failure behavior. No separate old-release production deployment matrix was run.

## Regressions found and corrected

- Independent whole-change review found legacy metadata missing optional audience and incomplete crawler rendering of Markdown/research/quote fields. Fresh anonymous policy now establishes visibility, and escaped original text fields and punctuation are retained. Explicit non-public audience remains denied.
- Sitemap integration exposed omission of the stored slug from public catalog source selection/projection. The optional location is now retained without replacing explicit canonical_slug. Query/projection/editorial compatibility tests passed; normal canonical and RSS identity rules are unchanged.
- An earlier full suite run overlapped heavy builds and hit a readiness-panel test timeout. Its isolated rerun passed, followed by the bounded final full suite passing all 2,479 tests.
- The HTTP privacy harness initially called a login-required route anonymously. It was corrected to test the real public routes and another signed-in account; all checks then passed.
- Real HTTP testing distinguished HTML normalization from genuine Flight prefetch. No user-agent-only or forwarded-header-only authorization was introduced.
- A pre-existing invalid Testing Library option surfaced in full type checking and was removed from one test; application registration behavior was not changed.

## Preservation and runtime

Protected backend unrelated patch SHA-256:
`dfbdfad462e39c44caa85176bb9fe5a4ec51c99428f82ebb828e3e8a349ba2e6`.

Protected staged mobile patch SHA-256:
`3adf9af88183cce349877ad19cfa2b87088544a5e5224bf4ad60201a6147666d`.

Both matched the pre-work snapshots. Generated frontend tsconfig/build directories are excluded from commits. Local data and original containers were retained.

Automatic approval review rejected replacing the original running Gateway because services were to remain running. Separate local test copies of the existing Gateway/Blog services and a test-only proxy were used instead; this adds no production service. Only the QA UI process started during this task was switched to the verified build. UI and local services remain running.

## Still required after user review/deployment

- Verify the actual production proxy overwrites private ingress headers and supplies an independently established client IP. Keep rollout off until this is proven.
- Configure separate private ingress/signing settings, then enable backend before frontend.
- Perform live Search Console/provider crawl checks and confirm deployed cache isolation.
- Compare normal-page controls and NSFW cohorts over matched 7/28-day periods. The private Search Console baseline export is preserved locally and is not committed.
- Actual search indexing, traffic growth, AI citations, provider-specific preview decisions, other browser engines and public image indexing are untested/outside this local sign-off.
