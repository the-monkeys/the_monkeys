# Query cache, refresh and account isolation implementation plan

**Goal:** Resolve the existing TanStack Query tracking issue and homepage focus flash without changing design, URLs, publishing policy, authorization, or existing API contracts.

**Architecture:** Keep TanStack Query. Distinguish routine stale revalidation from explicit mutation invalidation: validated public content remains visible during ordinary background refresh; withdrawn/restricted or invalid-policy content is suppressed. Centralize resource keys and scope personalized data to the current account. Bound transient retries and cache missing public avatars as empty results. Preserve authenticated detail reconciliation after anonymous SSR.

**Spec:** User request on November 21, 2026; frontend tracking issue TanStack Query: retry, cache and key hygiene, including bookmark-empty retries, avatar caching, public-page waterfalls, query-key/account isolation and bookmark invalidation. User explicitly authorized implementation from latest main and requested backward compatibility. No new GitHub issue or PR.

**Bases:** Frontend main 77cd3ab8; backend main cb7fdf9. Existing isolated worktrees, new codex/query-cache-refresh-fixes branches. Preserve the original checkout's 18 staged mobile fixes and its recorded SHA256. Production and other projects/containers remain untouched.

## Work and ownership

1. Parent: reproduce focus revalidation with deferred local API responses and Query focusManager; enumerate requested paths from actual HTTP traffic where available. Record code-only, automated and browser evidence distinctly. Browser evaluate remains read-only.
2. Parent: add failing tests for stable ordinary refresh versus explicit eligibility invalidation and unavailable/legacy payloads; implement the smallest homepage change. Add bounded global retry rules that skip authorization/not-found client errors and retain transient retries.
3. Avatar worker: existing profile image hook/component and public storage handler only. Cache missing avatars as null, remove timestamp cache-busting, preserve immediate upload propagation, and implement validators/cache-friendly public image reads without caching private storage or broad middleware changes. Test absent images, changed images, conditional GET and public/private separation.
4. Interaction worker: like/bookmark status/count hooks, bookmark listing and buttons only. Scope personal statuses/list to the current account, treat empty-bookmark 404 as empty, ensure add/remove list coherence, optimistic counts/status with rollback and race protection. Preserve sign-in gates, disabled behavior and existing return contracts. Avoid redundant GETs when successful mutation responses already establish state.
5. Key/isolation worker: own queryKeys.ts and other query/invalidation call sites, auth/login/logout, notifications/topics/follow state. Centralize keys with compatible public key shapes; scope private queries and invalidate on identity changes. Cancel in-flight work and clear prior-account cache on logout/account switch while actually updating mounted UI. Avoid private data in hydration and never weaken API authentication.
6. Parent: public SSR prefetch and request-waterfall reduction. Inspect current API counts first. Reuse request-local public author/data loaders and safe hydration; avoid redundant per-card metadata and session-gated public reads. Preserve authorized like/bookmark state. Add a narrow additive aggregation only if existing contracts cannot meet the measured bottleneck.
7. Parent: integrate with disjoint workers, regression tests and independent review; run lint, typecheck and isolated production build. Local desktop/tablet/mobile checks and repeat tab-return tests, including cold/warm cache, transient errors, deleted/private posts and account switching. Commit/push only verified relevant changes; no PR or issue closure claiming production verification.

## Shared interfaces for workers

Key worker supplies queryKeys.auth.session(), profile.image(username), profile.byUsername(username), profile.byAccount(accountId), blog.bookmarks.list(viewer,limit,offset), blog.bookmarks.lists(), and existing likes/bookmarks status(blogId,viewer?) plus counts. Keep public profile/image key shapes compatible with existing hydration. Status keys with a supplied viewer must be isolated; retain existing exported string constants as compatibility aliases where imported elsewhere. Parent owns homepage query options/loading and get-query-client default retry configuration.

## Verification and review focus

- No cached personalized data crosses user A/logout/user B, including in-flight callbacks.
- Routine focus refresh retains validated public cards; explicit withdrawal/restriction invalidation hides them immediately and rechecks policy.
- 401/403/404 do not undergo repeated query retries; only the actual empty-bookmark endpoint translates 404 into a valid empty list.
- Missing avatars are cached without duplicate requests; uploads propagate to all mounted instances and stale HTTP caches cannot mask changed images.
- Existing URLs, responsive classes, editor/publishing, event/verification idempotency, private meeting access and staged changes stay intact.
- Old issue request counts/timings are historical; report measured current local counts and distinguish local checks from production observations.