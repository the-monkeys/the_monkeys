# NSFW controls and reporting

## Behavior

Posts, events, groups and discussions share the existing menu/dialog style for reports and owner ratings. Existing safe content keeps its normal rendering and URLs. Optional `is_nsfw`, `content_rating` and `content_unavailable` fields are additive; older safe DTOs remain supported.

Signed-out and underage viewers cannot reveal NSFW content. Missing profile birthday links to Settings and returns to the original local content URL after saving. Birthday is self-declared, not independent age verification. Adults explicitly reveal each item; backend consent is scoped to the account and current rating revision. Account changes and backend errors fail closed. Real restricted body/media are not mounted under a cosmetic blur.

Member reports persist pending review. Authorized staff NSFW reports take action immediately; unrelated report reasons do not rate content automatically. Authors can label their content but cannot remove staff/scanner restrictions. The staff desk repository provides the review queue.

Public metadata, schema, feeds, sitemaps and Studio/snapshot exports exclude restricted content. Policy-sensitive reads and export image responses are uncached.

## Image cache compatibility

Next.js 14 handles `/_next/image` before application middleware/rewrites and its optimizer overwrites response cache headers. This release therefore sets `images.unoptimized: true`. Historical optimizer URLs return 404 before cache lookup, including previously warmed URLs. `next/image` keeps existing dimensions/styles and uses original image URLs. First-party content media uses the existing authenticated same-origin storage proxy; old storage aliases map to v2. Third-party images remain external.

Tradeoff: public images use original bytes, with no framework resizing, format conversion or generated srcSet, which can increase bandwidth. Re-enable shared optimization only after adding a policy-aware image service that checks access before every cache read. Deployment must also purge pre-existing CDN/image caches; already downloaded copies cannot be revoked. Storage origins must enforce the backend policy rather than exposing unrestricted object storage.

## Deployment and tests

Deploy the additive backend migration 000025 and moderation RPC/API before this UI. No existing URLs, publishing API, identity keys, or content IDs change. Missing moderation service/configuration cannot reveal restricted content. The backend's opt-in loopback browser fixture uses disposable PostgreSQL and safe generated PNGs; only authentication is stubbed. It is not a production sign-in test.

Local validation includes age boundaries and current DOB, per-account consent, report deduplication, staff permissions, review/reversal and scanner revision invalidation, media ownership/aliases, account switching, public metadata/export safety, mobile menus, desktop/tablet layouts and birthday return navigation. The browser harness is temporary and is not part of this branch.

No automated NSFW model has been introduced. Existing labels, staff decisions and existing scanner flag hooks feed policy; unknown/unscanned stays distinct. Production was not modified.
