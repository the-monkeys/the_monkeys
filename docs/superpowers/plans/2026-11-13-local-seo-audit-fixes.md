# Local Monkeys SEO audit and repairs

> For agentic workers: execute each verified repair with a failing regression test first, then run the relevant checks and one independent final review.

**Goal:** Make public Monkeys discovery more consistent without changing published URLs, editor behavior, mobile design or private access.

**Architecture:** Reuse the existing server metadata, schemas, feeds and catalog boundaries. Repair observed defects at their shared source. Use saved local evidence and synthetic public records; production is outside this task.

**Tech stack:** Next.js 14, TypeScript, Vitest, local Codex SEO toolkit; Go backend only if a verified defect requires it.

**Spec:** The user's November 13 request: audit and fix locally, mobile first, backward compatible, preserve staged changes, no production access, no BusinessNetworkIndia coordination.

## Constraints and preservation

- Stay in the existing isolated `codex/free-creator-event-seo` checkout. Do not switch or alter the original mobile branch.
- Preserve the original checkout's 18 staged files and its index fingerprint.
- Preserve the existing content-readiness implementation and its unsaved form behavior.
- No deployment, publishing, database writes, external indexing calls, commits or pushes.
- Keep existing canonical URLs and ID-based legacy links working. Keep full visible headlines; URL normalization must not truncate visible copy.
- Keep post terminology and existing Monkeys colors and layout. No em dashes in new controlled copy.

## Review focus

1. Very long, HTML-formatted and legacy post titles must resolve to the same canonical destination from metadata, sitemap, RSS and discovery links.
2. Private content and protected meeting links must remain excluded from public discovery.
3. Temporary catalog failures must not be confused with permanent absence or reported as successful indexing.
4. Fixes must preserve the existing mobile layout and content parity.
5. Local test and lab results must stay separate from indexing, search traffic and AI citation outcomes.

## Task 1: Audit and establish evidence

- [x] Read the installed audit/technical methods and native execution guide.
- [x] Record the current feature branch, staged mobile fingerprint and feature file hashes outside the application.
- [x] Inspect representative public route templates, crawler rules, metadata, schemas, feeds and backend notification-to-indexing paths.
- [x] Save local before evidence and list only reproduced defects as repair work.

## Task 2: Align post discovery with existing canonical URLs

Files: focused post URL helper; sitemap; post RSS; topic ItemList; public card adapters and landing discovery links; regression tests.

- [x] Add a cross-surface test using long, formatted, short and legacy post titles. Assert that sitemap/RSS/topic/card links match the page canonical and old aliases still extract the same ID.
- [x] Run it and confirm the current mismatch fails.
- [x] Introduce one canonical title-to-slug helper using the existing metadata normalization contract. Reuse it for discovery; do not change page title preference or published canonical semantics.
- [x] Run focused tests, type checks and public rendering checks.

## Task 3: Repair other verified audit defects

- [x] For each independently reproduced schema, policy or backend issue, record its cause and regression test before editing.
- [x] Make the smallest compatible repair. Preserve ordinary publication and keep optional SEO failures nonblocking.
- [x] If backend changes are required, isolate them from its unrelated local changes and test without network or production credentials.

## Task 4: Verify and report

- [x] Run the application test suite, lint/type checks and an isolated local build with outbound production traffic blocked.
- [x] Use installed SEO tools against saved local HTML/XML and compare before/after evidence. Check mobile/tablet/desktop if rendered code changes.
- [x] Obtain one independent review of the final repair diff and address concrete findings.
- [x] Recheck the original staged fingerprint and content-readiness preservation.
- [x] Save the findings, tests and a November 27 comparison checklist. The measurement window starts after the user deploys; local tests do not establish traffic growth.

## Execution notes

- The initial source trace reproduced a long-headline mismatch: page metadata uses a normalized 100-character title while sitemap, RSS and several cards use the whole raw title. The full visible headline will be retained.
- No Search Console or analytics exports were supplied for Monkeys. Indexing, clicks, sessions and AI citations will be marked unmeasured rather than inferred from local scores.
- Backend changes are isolated at `C:/Users/Dave/.codex/worktrees/monkeys-seo-indexing-fix/the_monkeys_engine`, branch `codex/seo-post-discovery`. Only the SEO implementation and its new regression test are changed there.
- Review corrected raw-title versus display-title handling, replaced a mocked group-rendering assertion with real header rendering, and added direct serialized-state privacy assertions.
- The public hydration work also needed reaction-state reconciliation. A second review reproduced an old-request race after logout/sign-in to the same account. A generation and per-type request token now protect rollback and pending-state cleanup; its regression was observed failing and then passing.
- The final group summary was visually checked at 390 pixels. The prior group header and other public pages passed 320/768/1440 width checks. A repeated multi-width browser check timed out under test/build load; the temporary viewport was reset successfully. These facts are kept separate in the verification report.
- Ruling: retain the installed Tailwind 3 configuration and utilities. A Tailwind 4 migration would exceed the SEO repair scope and violate the requested backward compatibility; only the source scan path changes.
