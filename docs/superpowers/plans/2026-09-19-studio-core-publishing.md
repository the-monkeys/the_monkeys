# Studio Phase 1: Core Social Publishing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Studio Phase 1 by harmonizing gateway REST serialization, fixing the frontend API client and types, repairing the Composer platform rendition creation bug, and delivering the complete all-in-one publishing action bar (Schedule, Reschedule, Cancel Schedule, Publish Now, Delete Draft) with real-time character limit validation.

**Architecture:** Add a DTO transformation layer in `the_monkeys_gateway/internal/social_post/routes.go` to output clean REST JSON with lowercase platform strings (`"x"`, `"linkedin"`). Update frontend `socialPostsApi.ts` and `types.ts` to unwrap payloads safely. Update `ComposerPage.tsx` to match platform accounts from `useSocialAccounts()` for rendition creation, integrate an inline date/time/timezone schedule drawer, and provide complete publishing lifecycle actions.

**Tech Stack:** Go (Gin, gRPC, Protobuf), TypeScript, Next.js 14 (App Router), React 18, React Query (TanStack Query v5), Tailwind CSS, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-19-studio-core-publishing-design.md`

## Global Constraints

- Gateway must map `pb.Platform` enums to lowercase strings: `"x"`, `"linkedin"`, `"instagram"`, `"facebook"`, `"youtube"`, `"tiktok"`.
- Gateway post responses must provide `status` equal to `state` for dual compatibility.
- Gateway list responses must provide both `items` and `posts` keys.
- Do not alter existing PostgreSQL migration scripts or core microservice business logic.
- Schedule dates must be RFC3339 timestamps and must be in the future.
- All existing tests in `the_monkeys` (187 tests) and `monkeys_brain` must continue to pass.

---

### Task 1: Gateway REST Normalization & DTOs (`monkeys_brain`)

**Files:**
- Modify: `microservices/the_monkeys_gateway/internal/social_post/routes.go`
- Test: `microservices/the_monkeys_gateway/internal/social_post/routes_test.go`

**Interfaces:**
- Consumes: `pb.SocialPostServiceClient` gRPC responses (`*pb.PostResponse`, `*pb.ListPostsResponse`, `*pb.ListAccountsResponse`, `*pb.ListMediaAssetsResponse`, `*pb.ListValidationMetadataResponse`).
- Produces: Normalized JSON payloads:
  - Post endpoints: `{"post": SocialPostDTO, "violations": []FieldViolationDTO}`
  - List endpoints: `{"items": []SocialPostDTO, "posts": []SocialPostDTO, "next_page_token": string}`
  - Accounts endpoint: `{"accounts": []SocialAccountDTO}`
  - Media endpoint: `{"assets": []MediaAssetDTO, "items": []MediaAssetDTO, "next_page_token": string}`
  - Validation metadata: `{"platforms": []ValidationMetadataDTO}`

- [ ] **Step 1: Write the failing test for JSON serialization and platform string mapping**

Add a test in `microservices/the_monkeys_gateway/internal/social_post/routes_test.go`:

```go
func TestPlatformToStringMapping(t *testing.T) {
	if platformToString[pb.Platform_PLATFORM_X] != "x" {
		t.Fatalf("expected 'x', got %q", platformToString[pb.Platform_PLATFORM_X])
	}
	if platformToString[pb.Platform_PLATFORM_LINKEDIN] != "linkedin" {
		t.Fatalf("expected 'linkedin', got %q", platformToString[pb.Platform_PLATFORM_LINKEDIN])
	}
}

func TestPostDTOIncludesStatusAndState(t *testing.T) {
	p := &pb.SocialPost{
		Id:       "post-123",
		BaseText: "hello monkeys",
		State:    "draft",
		Renditions: []*pb.Rendition{
			{
				Id:              "rend-1",
				SocialAccountId: "acc-1",
				Platform:        pb.Platform_PLATFORM_X,
				TextOverride:    "custom x text",
			},
		},
	}
	dto := toPostDTO(p)
	if dto.State != "draft" || dto.Status != "draft" {
		t.Fatalf("expected state and status to be 'draft', got state=%q, status=%q", dto.State, dto.Status)
	}
	if len(dto.Renditions) != 1 || dto.Renditions[0].Platform != "x" {
		t.Fatalf("expected rendition platform to be 'x', got %v", dto.Renditions)
	}
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `go test -v ./microservices/the_monkeys_gateway/internal/social_post/...`
Expected: FAIL with undefined `platformToString` or `toPostDTO`.

- [ ] **Step 3: Implement DTOs and transformation helpers in `routes.go`**

In `microservices/the_monkeys_gateway/internal/social_post/routes.go`:
Define `platformToString`, `SocialPostDTO`, `RenditionDTO`, `SocialAccountDTO`, `ValidationMetadataDTO`, `MediaAssetDTO`, and serialization helper functions `toPostDTO`, `toPostResponseDTO`, `toListPostsResponseDTO`, `toListAccountsResponseDTO`, `toListMediaResponseDTO`, `toValidationMetadataResponseDTO`.
Update route handlers in `RegisterRoutes` to use the DTO helpers when returning JSON.

- [ ] **Step 4: Run tests to verify they pass**

Run: `go test -v ./microservices/the_monkeys_gateway/internal/social_post/...`
Expected: PASS.

- [ ] **Step 5: Commit backend gateway normalization**

Run:
```bash
git -C /home/gautam/Desktop/Monkeys/monkeys_brain add microservices/the_monkeys_gateway/internal/social_post/routes.go microservices/the_monkeys_gateway/internal/social_post/routes_test.go
git -C /home/gautam/Desktop/Monkeys/monkeys_brain commit -m "feat(gateway): normalize social post REST responses and platform string mapping"
```

---

### Task 2: Frontend Types & API Client Normalization (`the_monkeys`)

**Files:**
- Modify: `apps/the_monkeys/src/features/studio/types.ts`
- Modify: `apps/the_monkeys/src/services/socialPosts/socialPostsApi.ts`
- Modify: `apps/the_monkeys/src/hooks/studio/useSocialPosts.ts`
- Create: `apps/the_monkeys/src/services/socialPosts/socialPostsApi.test.ts`

**Interfaces:**
- Consumes: Normalized REST endpoints from `the_monkeys_gateway`.
- Produces:
  - `socialPostsApi.create`, `update`, `get`, `schedule`, `publishNow`, `upsertRendition` -> return `SocialPost` directly.
  - `socialPostsApi.accounts()` -> returns `SocialAccount[]`.
  - `socialPostsApi.media()` -> returns `SocialMediaAsset[]`.
  - `socialPostsApi.delete(id, expectedVersion)` -> calls DELETE `/social-posts/:id`.
  - `useSocialPostMutations().deleteDraft` -> mutation calling `socialPostsApi.delete`.
  - `useValidationMetadata()` -> query hook for platform validation metadata.

- [ ] **Step 1: Write failing tests for `socialPostsApi` normalization**

Create `apps/the_monkeys/src/services/socialPosts/socialPostsApi.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import axiosInstance from '@/services/api/axiosInstance';
import { socialPostsApi } from './socialPostsApi';

vi.mock('@/services/api/axiosInstance');

describe('socialPostsApi normalization', () => {
  it('unwraps post from { post: {...} } response on get', async () => {
    (axiosInstance.get as any).mockResolvedValueOnce({
      data: {
        post: { id: 'p1', base_text: 'hello', state: 'draft', status: 'draft', version: 1, renditions: [] },
        violations: [],
      },
    });
    const result = await socialPostsApi.get('p1');
    expect(result.id).toBe('p1');
    expect(result.status).toBe('draft');
  });

  it('unwraps accounts array from { accounts: [...] }', async () => {
    (axiosInstance.get as any).mockResolvedValueOnce({
      data: {
        accounts: [{ id: 'a1', platform: 'x', handle: 'monkey', display_name: 'Monkey', status: 'active' }],
      },
    });
    const result = await socialPostsApi.accounts();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].platform).toBe('x');
  });

  it('unwraps media array from { assets: [...] }', async () => {
    (axiosInstance.get as any).mockResolvedValueOnce({
      data: {
        assets: [{ id: 'm1', object_key: 'key', content_type: 'image/png', byte_size: 100 }],
      },
    });
    const result = await socialPostsApi.media();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].id).toBe('m1');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/services/socialPosts/socialPostsApi.test.ts` in `apps/the_monkeys`
Expected: FAIL (types/functions not returning unwrapped data).

- [ ] **Step 3: Update `types.ts`, `socialPostsApi.ts`, and `useSocialPosts.ts`**

1. In `apps/the_monkeys/src/features/studio/types.ts`:
   - Add `state: SocialPostStatus` and `status: SocialPostStatus` on `SocialPost`.
   - Add `FieldViolation` and `ValidationMetadata` types.
   - Add `validation?: ValidationMetadata` on `SocialAccount`.
2. In `apps/the_monkeys/src/services/socialPosts/socialPostsApi.ts`:
   - Unwrap `(data as any).post ?? data` on post mutating and retrieval methods.
   - Unwrap `(data as any).accounts ?? data` on `accounts()`.
   - Unwrap `(data as any).assets ?? (data as any).items ?? data` on `media()`.
   - Ensure `delete(id, expected_version)` sends `expected_version`.
3. In `apps/the_monkeys/src/hooks/studio/useSocialPosts.ts`:
   - Add `deleteDraft` mutation.
   - Add `useValidationMetadata()` hook.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/services/socialPosts/socialPostsApi.test.ts` in `apps/the_monkeys`
Expected: PASS.

- [ ] **Step 5: Commit frontend contract changes**

Run:
```bash
git -C /home/gautam/Desktop/Monkeys/the_monkeys add src/features/studio/types.ts src/services/socialPosts/socialPostsApi.ts src/hooks/studio/useSocialPosts.ts src/services/socialPosts/socialPostsApi.test.ts
git -C /home/gautam/Desktop/Monkeys/the_monkeys commit -m "feat(studio): normalize social post API client, hooks, and types"
```

---

### Task 3: Composer Account Lookup & Rendition Creation Fix (`the_monkeys`)

**Files:**
- Modify: `apps/the_monkeys/src/features/studio/composer/ComposerPage.tsx`
- Create: `apps/the_monkeys/src/features/studio/composer/ComposerPage.test.tsx`

**Interfaces:**
- Consumes: `useSocialAccounts()`, `useSocialPostMutations()`.
- Produces: Correct `social_account_id` sent to `upsertRendition` for every selected platform on new post drafts.

- [ ] **Step 1: Write test verifying rendition upsert calls account ID for selected platforms**

Create `apps/the_monkeys/src/features/studio/composer/ComposerPage.test.tsx`:
Test that when platforms 'x' and 'linkedin' are selected and "Save draft" is clicked:
1. `create.mutateAsync({ base_text })` is called.
2. `upsertRendition.mutateAsync` is called for 'x' with `social_account_id = accounts.find(a => a.platform === 'x').id`.
3. `upsertRendition.mutateAsync` is called for 'linkedin' with `social_account_id = accounts.find(a => a.platform === 'linkedin').id`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/features/studio/composer/ComposerPage.test.tsx` in `apps/the_monkeys`
Expected: FAIL.

- [ ] **Step 3: Update `ComposerPage.tsx` rendition saving logic**

In `apps/the_monkeys/src/features/studio/composer/ComposerPage.tsx`:
Query `useSocialAccounts()`:
```tsx
const { data: accounts } = useSocialAccounts();
```
In `save()`:
```tsx
for (const platform of selected) {
  const targetAccount = accounts?.find((acc) => acc.platform === platform);
  if (!targetAccount?.id) continue;
  result = await upsertRendition.mutateAsync({
    id: result.id,
    expectedVersion: result.version,
    rendition: {
      social_account_id: targetAccount.id,
      text_override: overrides[platform] || undefined,
    },
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/features/studio/composer/ComposerPage.test.tsx` in `apps/the_monkeys`
Expected: PASS.

- [ ] **Step 5: Commit rendition fix**

Run:
```bash
git -C /home/gautam/Desktop/Monkeys/the_monkeys add src/features/studio/composer/ComposerPage.tsx src/features/studio/composer/ComposerPage.test.tsx
git -C /home/gautam/Desktop/Monkeys/the_monkeys commit -m "fix(studio): lookup account id from useSocialAccounts on rendition creation"
```

---

### Task 4: Composer Action Bar, Scheduling Drawer & Post Actions (`the_monkeys`)

**Files:**
- Create: `apps/the_monkeys/src/features/studio/composer/ScheduleDrawer.tsx`
- Modify: `apps/the_monkeys/src/features/studio/composer/ComposerPage.tsx`
- Create: `apps/the_monkeys/src/features/studio/composer/ComposerActions.test.tsx`

**Interfaces:**
- Consumes: `useSocialPostMutations().schedule`, `cancelSchedule`, `publishNow`, `deleteDraft`.
- Produces:
  - Inline schedule drawer with Date, Time, Timezone selector, and future validation.
  - Action bar with dynamic buttons based on post state (`draft` vs `scheduled` vs `publishing`).
  - Character counters with alert states.

- [ ] **Step 1: Write test for schedule drawer and publishing actions**

Create `apps/the_monkeys/src/features/studio/composer/ComposerActions.test.tsx`:
- Tests ScheduleDrawer: renders date, time, timezone inputs, rejects past dates, triggers onSchedule with RFC3339 string.
- Tests Action Bar: renders "Publish Now", "Schedule", "Save Draft" in draft mode; renders "Reschedule", "Cancel Schedule" when post is already scheduled.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/features/studio/composer/ComposerActions.test.tsx` in `apps/the_monkeys`
Expected: FAIL (components/props not implemented).

- [ ] **Step 3: Implement `ScheduleDrawer.tsx` and integrate into `ComposerPage.tsx`**

1. Create `ScheduleDrawer.tsx` with:
   - Date input (`min = today`).
   - Time input (`HH:MM`).
   - Timezone dropdown with common timezones and browser local default (`Intl.DateTimeFormat().resolvedOptions().timeZone`).
   - Validation ensuring selected timestamp is > current time.
   - `onConfirm({ scheduledAt: string, timezone: string })` and `onCancel()`.
2. Update `ComposerPage.tsx`:
   - Render `ScheduleDrawer` when schedule button is active.
   - Wire `schedule`, `publishNow`, `cancelSchedule`, and `deleteDraft` mutations.
   - Add state-dependent action bar UI (Option A).
   - Display real-time character limits (`{current}/{limit}`) with warning styling when exceeded.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/features/studio/composer/ComposerActions.test.tsx` in `apps/the_monkeys`
Expected: PASS.

- [ ] **Step 5: Commit Composer action bar and scheduling controls**

Run:
```bash
git -C /home/gautam/Desktop/Monkeys/the_monkeys add src/features/studio/composer/ScheduleDrawer.tsx src/features/studio/composer/ComposerPage.tsx src/features/studio/composer/ComposerActions.test.tsx
git -C /home/gautam/Desktop/Monkeys/the_monkeys commit -m "feat(studio): add schedule drawer, publish now, and cancel actions to composer"
```

---

### Task 5: Studio Desk Metrics & Account/Media Page Fixes (`the_monkeys`)

**Files:**
- Modify: `apps/the_monkeys/src/app/studio/page.tsx`
- Modify: `apps/the_monkeys/src/app/studio/accounts/page.tsx`
- Modify: `apps/the_monkeys/src/app/studio/media/page.tsx`
- Create: `apps/the_monkeys/src/app/studio/StudioPages.test.tsx`

**Interfaces:**
- Consumes: Normalized `useSocialPosts`, `useSocialAccounts`, `useSocialMedia` hooks.
- Produces: Bug-free rendering of Studio Desk metrics, Accounts list, and Media gallery.

- [ ] **Step 1: Write tests for Studio page rendering**

Create `apps/the_monkeys/src/app/studio/StudioPages.test.tsx`:
- Tests `StudioPage` counts drafts, scheduled, and published correctly using `state || status`.
- Tests `AccountsPage` renders accounts list without TypeError.
- Tests `MediaPage` renders media grid without TypeError.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test src/app/studio/StudioPages.test.tsx` in `apps/the_monkeys`
Expected: FAIL.

- [ ] **Step 3: Update `page.tsx`, `accounts/page.tsx`, and `media/page.tsx`**

1. In `apps/the_monkeys/src/app/studio/page.tsx`:
   - Update filtering: `(post.state ?? post.status) === 'draft'`, `'scheduled'`, `'published'`.
2. In `apps/the_monkeys/src/app/studio/accounts/page.tsx`:
   - Safeguard accounts access (`Array.isArray(accounts) ? accounts : []`).
3. In `apps/the_monkeys/src/app/studio/media/page.tsx`:
   - Safeguard media access (`Array.isArray(data) ? data : []`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test src/app/studio/StudioPages.test.tsx` in `apps/the_monkeys`
Expected: PASS.

- [ ] **Step 5: Commit Studio Desk and page fixes**

Run:
```bash
git -C /home/gautam/Desktop/Monkeys/the_monkeys add src/app/studio/page.tsx src/app/studio/accounts/page.tsx src/app/studio/media/page.tsx src/app/studio/StudioPages.test.tsx
git -C /home/gautam/Desktop/Monkeys/the_monkeys commit -m "fix(studio): fix metric counters on studio desk and ensure accounts/media array safety"
```

---

### Task 6: Full Verification & Integration Gate

**Files:**
- Both repos: `monkeys_brain` and `the_monkeys`

- [ ] **Step 1: Run backend tests**
Run: `go test -v ./microservices/the_monkeys_gateway/internal/social_post/... ./microservices/the_monkeys_social_post/...` in `monkeys_brain`.
Expected: PASS.

- [ ] **Step 2: Run frontend test suite**
Run: `npm test` in `apps/the_monkeys`.
Expected: PASS (all tests pass).

- [ ] **Step 3: Run frontend lint and build check**
Run: `npm run lint` in `apps/the_monkeys`.
Expected: PASS with 0 errors.
