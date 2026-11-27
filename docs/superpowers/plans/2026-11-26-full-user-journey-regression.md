# Full UI user-journey regression plan

## Scope
Execute the user's UI-first test instructions on the existing NSFW branch, using the local production-mode frontend and local services. SEO/GEO work remains paused. Create the first account through the actual registration UI; do not substitute direct service account creation. Then repeat the journeys with an existing local account that already owns content. Use clearly marked synthetic test content and documents, keep credentials private, and preserve real account identities and existing data.

All cases began pending; partial execution evidence is recorded below. Record PASS, FAIL, BLOCKED or NOT RUN with the exact build, account class, viewport, steps, persistence result and relevant evidence. A response or a button click alone is not a pass. Track defects separately, reproduce and regression-test fixes, then rerun the failing journey and its dependent journeys on the same branch. Do not touch production, staged mobile fixes, unrelated services, or create a PR.

## Common checks for every journey
- [ ] Inventory each visible page, control, menu and dialog; exercise supported primary/secondary actions, cancellation, validation and disabled/busy states.
- [ ] Verify visible results immediately, after navigation, after refresh and after signing out/in where relevant.
- [ ] Exercise mobile 320/390px, tablet 820px and desktop 1440px, recording actual content width. Check horizontal overflow, wrapping, readable fonts, spacing, touch targets, scrolling, dialogs, menus, image geometry and keyboard focus.
- [ ] Verify account/session isolation and no public exposure of email, DOB, private drafts, restricted content or protected media.
- [ ] Preserve resource IDs/ownership and existing publishing/URL behavior; inspect console and failed requests without logging credentials or private values.

## Pass 1 - a new account through the UI
- [ ] Register through the form and email-code screens, including required fields, validation, resend/cooldown and success. Check local code delivery before submission; do not silently bypass OTP or send test traffic to production infrastructure.
- [ ] Sign in/out and revisit the homepage, navigation and profile, including empty states for the new account.
- [ ] Create an article using the editor; upload local test media; save/reopen a draft, publish, edit and schedule separate clearly marked fixtures. Check tags/topics, content blocks and responsive rendering.
- [ ] Create/edit a discussion and exercise its supported interactions, menus, replies, sharing and snapshot/Studio handoff.
- [ ] Create/edit a group with logo/banner and supported membership/menu actions.
- [ ] Create/edit a free local event, media, time/timezone, group association where supported and RSVP/cancel flows. Check duplicate-submission prevention.
- [ ] Update profile fields individually and in meaningful combinations; save/reload between cases. Include first/last name, bio, location, contact, birthday and social fields. Test image upload, replacement and removal, confirming header/profile/byline updates immediately.
- [ ] Change the disposable account's username and email through supported screens, including validation/code/resend/confirmation. Recheck login, profile links and ownership of created resources. Preserve an existing real account's identifiers.
- [ ] Inspect supported security settings and validation/cancel paths; handle any required action-time confirmation or manual credential step explicitly.
- [ ] Apply for verification through the government-ID workflow with clearly watermarked non-identity local test files. Check country/document selection, uploads, optional notes, validation, submit/idempotency and displayed status. Do not represent a synthetic upload as real identity verification.
- [ ] Exercise Studio's available formats, templates, editing, save/open, download/copy and supported exports. Check short/max-length multilingual content, long words, images and gated-content restrictions; do not publish externally.
- [ ] Exercise Library bookmarks, drafts and scheduled tabs, including empty/populated states, add/remove, reopen/edit, scheduling/cancellation, persistence and corresponding counts/status.
- [ ] Recheck content options/reporting and NSFW gates in each resource placement; verify anonymous/underage/missing-DOB restrictions and adult consent with no public email/DOB leakage.

## Pass 2 - an existing local account
- [ ] Record a private baseline of existing profile, identifiers, media, roles and owned resources before changes.
- [ ] Repeat resource creation/editing, profile individual/combined saves and supported account/verification journeys using disposable local fixtures.
- [ ] Verify previously saved articles, groups, events, discussions, bookmarks, drafts, schedules and Studio work still load and remain associated with the same account.
- [ ] Repeat immediate-update, refresh, session-switch, privacy and responsive checks; restore any existing fixture fields intentionally changed.

## Completion gate
- [ ] Every inventoried control has a result or an explicit reason it is blocked/not applicable; no untested flow is described as working.
- [ ] Defects have reproducible evidence, fixes and regression results; rerun affected full journeys.
- [ ] Summarize unresolved environment, approval or browser limitations separately from application failures.
- [ ] Verify unrelated/staged patches unchanged, then commit/push only authorized relevant fixes and evidence. No PR. Plan NSFW SEO/GEO only after this testing phase is complete.

## Initial preflight
- Local registration route returns HTTP 200.
- Source confirms registration and email-change flows use OTP; code delivery and local outbound routing still need inspection.
- Existing generated build artifacts/config changes are present and are outside this test plan's source edits.

## Live execution notes (partial; remaining cases still pending)
- PASS: blank registration form rejects missing required fields and agreement.
- PASS: reserved invalid-mail domain rejected before account creation; this is expected domain validation, not a product defect.
- Local environment: outbound mail deliberately disabled and external DNS unavailable on the internal network. Temporary, local-only Mailpit, a loopback SMTP relay and a test-domain DNS entry are in use. No deployment/Compose/source-mail configuration changed; original auth container retained stopped for restoration. Latest user instruction: leave the local UI, all services and Mailpit running, and retain all local data and fixtures. Do not remove or restore this runtime at the end of testing. No secrets were exported.
- PASS: account created through the actual signup and six-digit OTP UI, with the code captured in local Mailpit. Resend cooldown observed; wrong code rejected.
- DEFECT: wrong-code UI message is a generic HTTP 400 rather than a useful invalid-code explanation.
- PASS: individual first name, last name, location and bio saves survive UI reload.
- DEFECT: contact number save displays success but the field is empty after UI reload. Cause under investigation.
- PASS: combined bio, synthetic under-18 birthday and four fake social handles survive reload. Birthday format hint left unchanged at the user's request.
- PASS: new 16-year-old account cannot reveal the sensitive homepage cards or direct article; no reveal button.
- DEFECT: compact sensitive discussion and event-row notices scroll inside 75px/84px reserved slots. Browser measured 96px/116px content inside 74px/83px inner heights. Shared compact notice layout change under test; not visually verified yet.
- Automated regression: six compact-notice cases failed before source changes, then all 62 gate/landing-slot tests passed after the change. Full browser/responsive verification and full suite remain pending.

## Landing warning correction verified
- Preserved the approved full lead-post and feed-event blur treatments. Removed nested warning borders only where the surrounding discussion/event/group panel already supplies an outline.
- Compact warnings use concise policy messages without nested scroll regions; full-event action states tighten vertical gaps without changing the reserved card height.
- Trending sensitive items show the existing NSFW / 18+ label in the existing metadata row. URLs, IDs, safe cards and access decisions are unchanged.
- Verified optimized build, scoped lint, 65 focused tests and the complete frontend suite (272 files / 2,396 tests). All 48 browser cases across three account states, two themes and eight requested widths had no nested warning overflow or clipped child content. These measurements cover the four sensitive placements currently present on the homepage, not every resource/page/browser.
- Re-ran 39 protected media/body/HTML checks and 108 profile privacy checks. Targeted checks with a nonempty synthetic phone also confirmed it is absent for anonymous and other-member requests.
- Phone finding clarified: stable loaded-form digits-only saves persist. An early field edit can be overwritten when the initial private profile fetch resets the form. Leading plus is currently rejected by the schema. Both are queued for fixes and fresh UI checks; do not label either fixed yet.
- User approved safe public context in principle, but the actual sensitive body/media remain protected; public metadata rules must be designed before any expansion. Phone, email and DOB remain private.


## Profile and code-feedback correction verified (2026-11-27)
- A loaded-form phone with an optional leading plus saves and remains visible after a full browser refresh. The owner API returned the exact same synthetic value. Anonymous and other-member legacy/public profile requests contained none of phone/email/DOB. Evidence: profile-plus-after-reload.jpg and sanitized profile-form verification JSON.
- Initial private-profile loading disables edits. Background data refresh preserves dirty fields; account changes reset the keyed form. Failed loads expose retry; failed saves preserve edits. Delayed birthday focus remains supported. These races/error states are covered by focused React integration tests; not all were fault-injected in the browser.
- Signup OTP errors now display the useful backend message and use a readable fallback for network/malformed errors. Controlled text/password inputs avoid undefined-to-string warnings. This correction is component-tested, not yet rerun against a fresh live signup OTP screen after this change.
- Validation: optimized build passed; scoped lint passed; complete frontend suite passed (274 files / 2,422 tests). 41 focused profile/birthday/code-feedback tests passed. Source review found no further actionable issues after retry/focus corrections.
- Additional actual new-user browser journeys: discussion empty validation, creation, detail edit, reply, like and persistence after refresh; copied local share link; Studio handoff and Story/Reel dark PNG export (2160x3840). Group draft/rule creation and publish status survived refresh. Linked free online event created and published with Dec 15 2026 18:30-19:30 Asia/Calcutta preserved. Native date control required accessibility key input; DOM fill alone did not update React state, so this was not classified as a product date defect.
- Disposable username updated through the UI. Verification missing-field validation passed; labelled synthetic non-ID images uploaded and request reached Pending review, retained after refresh. No real identity data or camera access used. Profile image updated immediately and loaded after refresh. Remaining resource edits, media replacement, account/security flows, responsive coverage and existing-account journeys are still pending.
- Editor test initially blocked by missing local signing key/WebSocket configuration. Local build/runtime only was adjusted to loopback WebSocket endpoints and the existing local auth key (in memory, never logged). No deployment config/source changes. Auth answers gRPC SERVING; temporary container health command mistakenly contains an unexpanded variable, so Docker reports unhealthy despite readiness.
- The full requested regression is not complete. SEO/GEO and safe-context expansion remain paused. No production writes, PR or local data deletion.
