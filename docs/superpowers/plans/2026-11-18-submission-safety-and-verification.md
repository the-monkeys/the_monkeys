# Submission safety and verification settings

> **For agentic workers:** Use the existing isolated front/backend checkouts. Implement the two tasks separately and keep their commits separate.

**Goal:** Repeated clicks and retries must not create duplicate events, groups or active verification requests; verification settings must be clear and responsive in the existing Monkeys design.

**Architecture:** UI guards synchronously admit one submission at a time. Each logical creation intent carries an optional `Idempotency-Key`; the authenticated gateway reserves and replays it across instances using Redis. Existing header-free clients and protobuf messages remain compatible. Verification continues to use the existing private document pipeline and database uniqueness rule.

**Tech stack:** Existing React/Next.js/TanStack Query/Tailwind components; Gin/Go gateway and existing Redis. No new dependencies or protobuf generation.

**Spec:** User's request; the design and requirements below.

## Constraints

- Same `codex/landing-community-previews` branch; no PR. Original staged mobile checkout and original backend's unrelated changes are excluded.
- Local services and data only; Monkeys AI stays off. Build only the gateway for server-side protection and the users service for the explicitly requested government-ID policy. Other projects' containers are excluded.
- Existing identity, permissions, authentication, document ownership and private storage rules remain authoritative.
- Existing fonts, coral brand color, neutral surfaces, shared controls and dark styles remain. No new color palette or unrelated settings behavior changes.
- Two separate frontend commits: submission safety first, verification redesign second. Backend protection is committed separately in its matching branch.

## Task 1: Submission safety

- [ ] Reproduce same-turn duplicate submissions and write failing regressions before implementation.
- [ ] Add synchronous UI single-flight protection and logical request keys to ordinary/recurring/group events, groups and verification submission. Keep keys through uncertain retries, but allow deliberate new creations.
- [ ] Add atomic, authenticated gateway reservations for supported creation routes; reject changed payloads under one key, isolate accounts/routes, and replay a completed operation without executing it again.
- [ ] Bound key/body sizes and retention. Handle concurrent requests, Redis failures and uncertain downstream outcomes without opening duplicate writes. Never use request-body equality as a global ban on legitimate identical creations.
- [ ] Preserve legacy no-key requests and existing response contracts; keep raw documents, credentials and private form contents out of logs and shared caches.
- [ ] Run focused concurrency, retry, isolation and compatibility tests; build only the local gateway; test rapid local UI submissions and resulting record counts.
- [ ] Commit only task 1 files, excluding the disjoint verification presentation and policy changes developed in parallel.

## Task 2: Verification settings

Design: Keep the existing settings navigation and permissions. Use a clear page heading, a neutral status card, concise next steps and privacy guidance. New applications require government ID, with every country/territory named rather than an Other nationality. Offer all supported government document categories regardless of nationality, including other government-issued ID; keep selfie and front uploads required. Preserve existing historical verification records and their statuses. Use readable country/document controls, document tiles with explicit loading/success/error states, and one clear submit action. Pending/review/approved/rejected/error states receive meaningful copy and appropriate existing actions instead of a nearly empty panel. Stack on phones, use balanced columns only where space permits, and avoid large decorative gaps.

- [ ] Create a local test account through the existing auth gRPC service; use a separate localhost browser session so the user's 127.0.0.1 session remains intact.
- [ ] Cover unverified, pending, under-review, approved, rejected, failed-load and upload validation states in focused tests. Preserve task 1 submission safety.
- [ ] Refine verification presentation and document upload feedback using existing controls and theme. Display plain-language status rather than technical checksums. Preserve camera/file/preview functionality and private ownership checks.
- [ ] Exercise submission and status through the local UI, and verify phone, tablet and desktop layouts, keyboard labels, wrapping and dark styles where available.
- [ ] Commit task 2 separately. Report exact verification evidence and any local data limitations; create no PR.

## Review focus

- A timeout after a committed create must not turn a retry into a second record.
- A second user must never receive the first user's cached result or use their verification documents.
- Client validation errors, upload failure and rejected verification must leave a usable retry/resubmission path.
- Header-free older clients, unchanged creation payloads and recurring timezones remain supported.
- A failed status fetch must not masquerade as a known unverified account; loading, pending and final states must stay distinct.
