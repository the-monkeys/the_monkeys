# Local user-journey regression - 27 November 2026

Status: core new-account and existing-account journeys passed the checks below. This is not an exhaustive all-controls or all-browsers sign-off. The unrun cases are listed explicitly. SEO/GEO remains paused.

## Fixes verified and pushed

- Frontend `05eeb9be`: protect profile edits from loading/reset races, accept an optional leading plus in phone numbers, and show useful signup-code errors.
- Frontend `1578b219`: fit sensitive-content notices without inner scrolling, remove duplicate nested borders, and label sensitive Trending items while retaining the approved blur treatment.
- Frontend `8c2571bd`: invalidate cached author/draft/scheduled article lists after writes and wrap group owner controls on narrow screens.
- Backend `11d46d4d`: make publish/schedule/move-to-draft status searchable before success. Existing scripts, conflict retries, API/protobuf/schema and autosave refresh behavior are unchanged. Explicit refresh adds indexing work on those three user actions; its production-load cost has not been measured.

Both repositories use `codex/nsfw-reporting-age-gate`. No PR or deployment was created.

## Browser results

The new account registered through the form and Mailpit OTP screen. It saved profile text, a leading-plus phone number, birthday and fake socials; changed its username; verified its email; replaced its profile photo; and submitted clearly watermarked non-identity test images for verification. Its verification request remains Pending review.

The new account created an article, discussion, group and free online event. Core edit/save/reopen/publish paths were exercised. Discussion edit/reply/like persisted. Group description/logo/cover persisted. The event kept its timezone and group association; its gallery image loaded after refresh. The article editor retained an uploaded image and code component through preview and draft reopen. The published image rendered visibly and the code copied exactly.

Scheduling showed the article in Scheduled without reload. Moving it to Drafts removed it from Scheduled and showed it in Drafts without reload. Publishing showed it on an author profile visited immediately beforehand, without reload. The same article ID/URL was retained throughout.

An existing synthetic account signed in through the UI and created its own article, discussion, group and event. Its discussion edit/reply, group publication and event publication persisted after refresh. Its article appeared on its profile and its bookmark remained in Library after refresh. Profile name/location/bio and four fake social handles persisted, then the original text fields were restored. Its avatar now intentionally retains a public synthetic QA image. Its synthetic verification request also remains Pending review. No real Dave profile fields were changed.

Studio: all eight template selectors and thirteen theme selectors were exercised as preview smoke checks. Edited preview text did not rename the source article. PNG (2400 x 1254), JPEG and asynchronous image/png clipboard copy worked. The earlier new-account discussion Story/Reel PNG export measured 2160 x 3840. This does not cover every template/theme/content combination or all external X imports.

## Responsive and privacy results

- Settings, Library, discussion, group, event, article, Studio, topics, feed and homepage checked at 320, 390, 820 and 1440 pixels: 40 stable-layout cases with no page-wide horizontal overflow. Studio had one intermediate resize reading above the viewport; four fresh loads and settled screenshots fit, so no Studio CSS was changed. These are Chromium viewport tests, not physical-device or Safari/Firefox certification.
- The earlier sensitive-warning matrix covered 48 account/theme/width combinations across the four sensitive homepage placements present in that dataset. See the separate warning-layout evidence for its exact scope.
- Fresh API privacy run: 98 checks passed across public and legacy profiles, including the new account with a nonempty phone number. Email, phone and birthday were absent for other viewers; private-profile responses kept no-store protection.
- Fresh restricted-body/media/HTML and public-content control run: 22 checks passed. The final adult sign-out to anonymous to minor browser sequence exposed no restricted-body marker; the minor received the under-18 restriction and no Show content button.

Two test-harness observations were resolved without application changes: the new account's original username was incorrectly used as its account ID in four lookups; a read-only ID lookup corrected all four. Social-value DOM reads were redacted by the browser inspection tool, so persistence was checked visually rather than treating the comparison as a save failure.

## Automated verification

- Optimized frontend build passed and serves the local UI on port 3000.
- Full frontend suite: 274 files and 2,423 tests passed.
- Scoped lint: no errors; two existing img-element warnings in GroupDetailClient.
- `go test ./microservices/the_monkeys_blog/...` passed.
- gopls checks on the two changed backend files exited 0 with no diagnostics.
- Cache and publication-request regressions were observed failing before their fixes and passing afterward. Static reviews found no further actionable issue in the reviewed changes.

## Not run / limits

- Password and final email credential changes require manual user participation under the browser policy.
- The corrected signup-code message is component-tested; it was not rerun on another fresh live signup after the fix while the user was absent. The original UI signup rejected a wrong code before that correction.
- Destructive deletion and profile-image removal were not run because local data must be retained.
- Paid checkout/refunds, external X imports and external notification delivery were not run. Local notifications are disabled.
- Every co-host, invite, ticket/coupon and administrator control, every editor tool, and all Studio export combinations/max-length/multilingual cases have not been exhaustively tested.
- Production-load impact and browser engines beyond in-app Chromium have not been tested.

## Retained environment and evidence

UI, local backend containers and Mailpit remain running. Homepage and gateway health returned HTTP 200. The blog service is healthy. Auth answers gRPC SERVING, although its temporary local Docker health command reports unhealthy because its environment variable is not expanded. Production Compose files were not changed for this setup.

No local data, test accounts, uploads or resources were deleted. Staged mobile and the five unrelated backend dirty paths match their recorded raw patch hashes.

Machine-readable results: [user-journey verification](2026-11-27-user-journey-regression.json), [publication fix verification](2026-11-27-publication-journey-verification.json), [profile fixes](2026-11-27-profile-form-verification.json), and [warning layout](2026-11-26-sensitive-warning-layout.json).

Browser screenshots, exports and sanitized API checks are retained outside Git in:
`C:/Users/Dave/.codex/visualizations/2026/09/04/01a06aa7-b38e-78b1-82f5-92858092da97/monkeys-user-journeys-20261126/`.

Useful evidence: `published-immediate-cached-profile.jpg`, `draft-immediate-after-transition.jpg`, `group-owner-320-after.jpg`, `published-article-image-loaded.jpg`, `existing-user-published-article.jpg`, `existing-social-handles-after-reload.jpg`, `existing-studio-linkedin.png`, `existing-verification-pending.jpg`, `final-new-user-minor-home.jpg`, `final-user-journey-privacy.json`, and `final-user-journey-nsfw.json`.
