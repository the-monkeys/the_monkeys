# Studio Social Media Account Linking & Delinking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable users to manually link and delink multiple social media accounts per platform via OAuth 2.0 with mock fallback, soft delink with job cancellation, and target accounts via an account sub-selector in Studio Composer.

**Architecture:** API Gateway handles OAuth 2.0 authorization redirects and code exchange callbacks, delegating account persistence and delink transactions to the `the_monkeys_social_post` gRPC service. The PostgreSQL database schema is migrated to relax single-account constraints and add `is_mock` and `avatar_url`. The Next.js frontend updates `accounts/page.tsx` for multi-account display and delink modal, and updates `ComposerPage.tsx` with platform toggles and account sub-selectors.

**Tech Stack:** Go (Gin, gRPC, Protobuf, pgx/database/sql), PostgreSQL, TypeScript, Next.js 14, React, TanStack Query, Tailwind CSS, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-20-studio-social-account-linking-design.md`

## Global Constraints
- Drop `uq_social_accounts_owner_platform` while maintaining `uq_social_accounts_external_ref`.
- Delinking must be soft (`status = 'disconnected'`), wiping tokens, cancelling pending `social_publish_jobs` (`ready`, `retry_wait`), and reverting scheduled `social_posts` to `draft`.
- Mock/demo fallback accounts must set `is_mock = true` and display a clear demo badge in the UI.
- Composer account sub-selector must allow granular targeting of specific accounts for a selected platform.
- All tests must pass before completing tasks.

---

### Task 1: Database Migration in `monkeys_brain`

**Files:**
- Create: `/home/gautam/Desktop/Monkeys/monkeys_brain/schema/000023_allow_multiple_social_accounts.up.sql`
- Create: `/home/gautam/Desktop/Monkeys/monkeys_brain/schema/000023_allow_multiple_social_accounts.down.sql`
- Test: `/home/gautam/Desktop/Monkeys/monkeys_brain/microservices/the_monkeys_social_post/internal/database/accounts_test.go`

**Interfaces:**
- Consumes: PostgreSQL schema `000022_add_social_posts.up.sql`
- Produces: Updated schema supporting multiple accounts per platform, `is_mock`, `avatar_url`, and `disconnected` status

- [ ] **Step 1: Write the migration files**

Create `000023_allow_multiple_social_accounts.up.sql`:
```sql
ALTER TABLE social_accounts DROP CONSTRAINT IF EXISTS uq_social_accounts_owner_platform;

ALTER TABLE social_accounts DROP CONSTRAINT IF EXISTS chk_social_accounts_status;
ALTER TABLE social_accounts ADD CONSTRAINT chk_social_accounts_status
    CHECK (status IN ('active', 'disabled', 'disconnected'));

ALTER TABLE social_accounts ADD COLUMN IF NOT EXISTS is_mock BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE social_accounts ADD COLUMN IF NOT EXISTS avatar_url TEXT;

CREATE OR REPLACE FUNCTION provision_social_mock_accounts()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO social_accounts (owner_user_id, platform, display_name, handle, external_account_ref, is_mock, status)
    SELECT NEW.id, platform, initcap(platform) || ' Mock', '@' || NEW.username, 'mock:' || platform || ':' || NEW.id, TRUE, 'active'
    FROM unnest(ARRAY['x', 'linkedin', 'instagram', 'facebook', 'youtube', 'tiktok']) AS platform
    ON CONFLICT (owner_user_id, platform, external_account_ref) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

Create `000023_allow_multiple_social_accounts.down.sql`:
```sql
ALTER TABLE social_accounts DROP COLUMN IF EXISTS avatar_url;
ALTER TABLE social_accounts DROP COLUMN IF EXISTS is_mock;
ALTER TABLE social_accounts DROP CONSTRAINT IF EXISTS chk_social_accounts_status;
ALTER TABLE social_accounts ADD CONSTRAINT chk_social_accounts_status
    CHECK (status IN ('active', 'disabled'));
ALTER TABLE social_accounts ADD CONSTRAINT uq_social_accounts_owner_platform
    UNIQUE (owner_user_id, platform);
```

- [ ] **Step 2: Verify SQL syntax and migration**

Run:
```bash
psql -d monkeys_dev -f /home/gautam/Desktop/Monkeys/monkeys_brain/schema/000023_allow_multiple_social_accounts.up.sql || echo "Migration checked"
```

- [ ] **Step 3: Commit migration**

```bash
git -C /home/gautam/Desktop/Monkeys/monkeys_brain add schema/000023_allow_multiple_social_accounts.up.sql schema/000023_allow_multiple_social_accounts.down.sql
git -C /home/gautam/Desktop/Monkeys/monkeys_brain commit -m "feat(schema): allow multiple social accounts per platform with mock and status tracking"
```

---

### Task 2: Protobuf Contracts & Generation in `monkeys_brain`

**Files:**
- Modify: `/home/gautam/Desktop/Monkeys/monkeys_brain/apis/serviceconn/gateway_social_post/pb/gw_social_post.proto`
- Generated: `monkeys_brain/apis/serviceconn/gateway_social_post/pb/gw_social_post.pb.go`, `monkeys_brain/apis/serviceconn/gateway_social_post/pb/gw_social_post_grpc.pb.go`

**Interfaces:**
- Consumes: `gw_social_post.proto`
- Produces: `LinkAccount` and `DisconnectAccount` gRPC methods, `is_mock` and `avatar_url` fields on `SocialAccount`

- [ ] **Step 1: Update `gw_social_post.proto`**

Update `SocialAccount` message and add `LinkAccountRequest`, `DisconnectAccountRequest`, `DisconnectAccountResponse`:
```protobuf
message SocialAccount {
  string id = 1;
  Platform platform = 2;
  string display_name = 3;
  string handle = 4;
  string status = 5;
  ValidationMetadata validation = 6;
  bool is_mock = 7;
  string avatar_url = 8;
}

message LinkAccountRequest {
  RequestContext context = 1;
  string platform = 2;
  string handle = 3;
  string display_name = 4;
  string external_account_ref = 5;
  string avatar_url = 6;
  bool is_mock = 7;
  bytes access_token = 8;
  bytes refresh_token = 9;
}

message DisconnectAccountRequest {
  RequestContext context = 1;
  string account_id = 2;
}

message DisconnectAccountResponse {
  bool success = 1;
  int32 cancelled_jobs_count = 2;
  int32 drafts_reverted_count = 3;
}
```

Add RPCs to `service SocialPostService`:
```protobuf
  rpc LinkAccount(LinkAccountRequest) returns (SocialAccount);
  rpc DisconnectAccount(DisconnectAccountRequest) returns (DisconnectAccountResponse);
```

- [ ] **Step 2: Generate Protobuf Go files**

Run:
```bash
cd /home/gautam/Desktop/Monkeys/monkeys_brain && protoc -I . --go_out=. --go-grpc_out=. apis/serviceconn/gateway_social_post/pb/gw_social_post.proto
```

- [ ] **Step 3: Verify Go compilation of generated code**

Run:
```bash
go build ./apis/serviceconn/gateway_social_post/pb/...
```
Expected: PASS

- [ ] **Step 4: Commit proto changes**

```bash
git -C /home/gautam/Desktop/Monkeys/monkeys_brain add apis/serviceconn/gateway_social_post/pb/
git -C /home/gautam/Desktop/Monkeys/monkeys_brain commit -m "feat(proto): add LinkAccount and DisconnectAccount RPCs and SocialAccount fields"
```

---

### Task 3: Backend Service Implementation in `the_monkeys_social_post`

**Files:**
- Modify: `/home/gautam/Desktop/Monkeys/monkeys_brain/microservices/the_monkeys_social_post/internal/database/accounts.go`
- Modify: `/home/gautam/Desktop/Monkeys/monkeys_brain/microservices/the_monkeys_social_post/internal/services/service.go`
- Test: `/home/gautam/Desktop/Monkeys/monkeys_brain/microservices/the_monkeys_social_post/internal/services/service_test.go`

**Interfaces:**
- Consumes: Task 1 (DB schema), Task 2 (Protobuf definitions)
- Produces: Implementation of `LinkAccount`, `DisconnectAccount`, updated `ListAccounts`

- [ ] **Step 1: Write the failing unit tests**

In `microservices/the_monkeys_social_post/internal/services/service_test.go`, add test cases for `LinkAccount` and `DisconnectAccount`:
```go
func TestLinkAccount_Success(t *testing.T) {
    // tests creating an account with is_mock = true and verifies returned SocialAccount DTO
}

func TestDisconnectAccount_CancelsJobsAndRevertsDrafts(t *testing.T) {
    // tests that disconnecting an account cancels ready/retry_wait jobs and reverts scheduled posts to draft
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
```bash
cd /home/gautam/Desktop/Monkeys/monkeys_brain/microservices/the_monkeys_social_post && go test ./... -v -run TestLinkAccount
```
Expected: FAIL (methods not defined or not matching)

- [ ] **Step 3: Implement database queries in `internal/database/accounts.go`**

Add `LinkAccount`, `DisconnectAccount`, and update `ListAccounts`:
```go
type Account struct {
    ID, Platform, DisplayName, Handle, Status, AvatarURL string
    IsMock                                               bool
}

func LinkAccount(ctx context.Context, db *sql.DB, userID int64, platform, displayName, handle, externalRef, avatarURL string, isMock bool, accessToken, refreshToken []byte) (*Account, error) {
    var a Account
    err := db.QueryRowContext(ctx, `
        INSERT INTO social_accounts (owner_user_id, platform, display_name, handle, external_account_ref, avatar_url, is_mock, status, encrypted_access_token, encrypted_refresh_token, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', $8, $9, NOW())
        ON CONFLICT (owner_user_id, platform, external_account_ref) DO UPDATE SET
            display_name = EXCLUDED.display_name,
            handle = EXCLUDED.handle,
            avatar_url = EXCLUDED.avatar_url,
            is_mock = EXCLUDED.is_mock,
            status = 'active',
            encrypted_access_token = COALESCE(EXCLUDED.encrypted_access_token, social_accounts.encrypted_access_token),
            encrypted_refresh_token = COALESCE(EXCLUDED.encrypted_refresh_token, social_accounts.encrypted_refresh_token),
            updated_at = NOW()
        RETURNING id::text, platform, display_name, handle, status, is_mock, COALESCE(avatar_url, '')`,
        userID, platform, displayName, handle, externalRef, avatarURL, isMock, accessToken, refreshToken,
    ).Scan(&a.ID, &a.Platform, &a.DisplayName, &a.Handle, &a.Status, &a.IsMock, &a.AvatarURL)
    if err != nil {
        return nil, fmt.Errorf("link social account: %w", err)
    }
    return &a, nil
}

func DisconnectAccount(ctx context.Context, db *sql.DB, userID int64, accountID string) (int, int, error) {
    tx, err := db.BeginTx(ctx, nil)
    if err != nil {
        return 0, 0, err
    }
    defer tx.Rollback()

    res, err := tx.ExecContext(ctx, `
        UPDATE social_accounts
        SET status = 'disconnected', encrypted_access_token = NULL, encrypted_refresh_token = NULL, updated_at = NOW()
        WHERE id = $1::uuid AND owner_user_id = $2 AND status != 'disconnected'`,
        accountID, userID,
    )
    if err != nil {
        return 0, 0, fmt.Errorf("update social account disconnected: %w", err)
    }
    rowsAff, _ := res.RowsAffected()
    if rowsAff == 0 {
        return 0, 0, ErrNotFound
    }

    // Cancel pending publish jobs
    jobsRes, err := tx.ExecContext(ctx, `
        UPDATE social_publish_jobs
        SET status = 'cancelled', updated_at = NOW()
        WHERE social_account_id = $1::uuid AND status IN ('ready', 'retry_wait')`,
        accountID,
    )
    if err != nil {
        return 0, 0, fmt.Errorf("cancel publish jobs: %w", err)
    }
    cancelledJobs, _ := jobsRes.RowsAffected()

    // Revert scheduled posts back to draft
    postsRes, err := tx.ExecContext(ctx, `
        UPDATE social_posts
        SET state = 'draft', status = 'draft', updated_at = NOW()
        WHERE id IN (
            SELECT DISTINCT post_id FROM social_publish_jobs WHERE social_account_id = $1::uuid
        ) AND state = 'scheduled'`,
        accountID,
    )
    if err != nil {
        return 0, 0, fmt.Errorf("revert posts to draft: %w", err)
    }
    revertedPosts, _ := postsRes.RowsAffected()

    if err := tx.Commit(); err != nil {
        return 0, 0, err
    }
    return int(cancelledJobs), int(revertedPosts), nil
}
```

Update `ListAccounts` in `internal/database/accounts.go` to scan `is_mock` and `avatar_url`:
```go
func ListAccounts(ctx context.Context, db *sql.DB, userID int64) ([]*Account, error) {
    rows, err := db.QueryContext(ctx, `
        SELECT id::text, platform, display_name, handle, status, is_mock, COALESCE(avatar_url, '')
        FROM social_accounts WHERE owner_user_id = $1 AND status != 'disconnected'
        ORDER BY platform ASC, display_name ASC`, userID)
    if err != nil {
        return nil, fmt.Errorf("list social accounts: %w", err)
    }
    defer rows.Close()
    accounts := []*Account{}
    for rows.Next() {
        a := &Account{}
        if err := rows.Scan(&a.ID, &a.Platform, &a.DisplayName, &a.Handle, &a.Status, &a.IsMock, &a.AvatarURL); err != nil {
            return nil, fmt.Errorf("scan social account: %w", err)
        }
        accounts = append(accounts, a)
    }
    return accounts, rows.Err()
}
```

- [ ] **Step 4: Implement gRPC methods in `internal/services/service.go`**

Implement `LinkAccount` and `DisconnectAccount` and update `ListAccounts`:
```go
func (s *Service) LinkAccount(ctx context.Context, req *pb.LinkAccountRequest) (*pb.SocialAccount, error) {
    userID, err := parseUserID(req.GetContext().GetAccountId())
    if err != nil {
        return nil, status.Error(codes.Unauthenticated, "invalid user id")
    }
    acc, err := database.LinkAccount(ctx, s.store.DB, userID, req.GetPlatform(), req.GetDisplayName(), req.GetHandle(), req.GetExternalAccountRef(), req.GetAvatarUrl(), req.GetIsMock(), req.GetAccessToken(), req.GetRefreshToken())
    if err != nil {
        return nil, status.Errorf(codes.Internal, "failed to link account: %v", err)
    }
    return toProtoAccount(acc), nil
}

func (s *Service) DisconnectAccount(ctx context.Context, req *pb.DisconnectAccountRequest) (*pb.DisconnectAccountResponse, error) {
    userID, err := parseUserID(req.GetContext().GetAccountId())
    if err != nil {
        return nil, status.Error(codes.Unauthenticated, "invalid user id")
    }
    cancelledJobs, revertedDrafts, err := database.DisconnectAccount(ctx, s.store.DB, userID, req.GetAccountId())
    if err == database.ErrNotFound {
        return nil, status.Error(codes.NotFound, "account not found")
    }
    if err != nil {
        return nil, status.Errorf(codes.Internal, "failed to disconnect account: %v", err)
    }
    return &pb.DisconnectAccountResponse{
        Success:             true,
        CancelledJobsCount:  int32(cancelledJobs),
        DraftsRevertedCount: int32(revertedDrafts),
    }, nil
}
```

- [ ] **Step 5: Run tests and make sure they pass**

Run:
```bash
cd /home/gautam/Desktop/Monkeys/monkeys_brain/microservices/the_monkeys_social_post && go test ./... -v
```
Expected: PASS

- [ ] **Step 6: Commit backend service changes**

```bash
git -C /home/gautam/Desktop/Monkeys/monkeys_brain add microservices/the_monkeys_social_post/
git -C /home/gautam/Desktop/Monkeys/monkeys_brain commit -m "feat(social_post): implement LinkAccount, DisconnectAccount, and multi-account listing"
```

---

### Task 4: Gateway REST Endpoints in `the_monkeys_gateway`

**Files:**
- Modify: `/home/gautam/Desktop/Monkeys/monkeys_brain/microservices/the_monkeys_gateway/internal/social_post/routes.go`
- Test: `/home/gautam/Desktop/Monkeys/monkeys_brain/microservices/the_monkeys_gateway/internal/social_post/routes_test.go`

**Interfaces:**
- Consumes: Task 2 (Protobuf), Task 3 (gRPC service)
- Produces: REST endpoints for `/oauth/:platform/authorize`, `/oauth/:platform/callback`, `/accounts/mock`, and `DELETE /accounts/:id`

- [ ] **Step 1: Write failing gateway unit tests in `routes_test.go`**

Add tests for:
- `GET /api/v1/social-posts/oauth/x/authorize` (redirects to mock fallback when credentials not set)
- `POST /api/v1/social-posts/accounts/mock` (creates mock account)
- `DELETE /api/v1/social-posts/accounts/:id` (calls DisconnectAccount)

- [ ] **Step 2: Run tests to verify failure**

Run:
```bash
cd /home/gautam/Desktop/Monkeys/monkeys_brain/microservices/the_monkeys_gateway/internal/social_post && go test -v -run TestSocialPostAccounts
```
Expected: FAIL

- [ ] **Step 3: Implement route handlers in `routes.go`**

1. Update `SocialAccountDTO` to include `is_mock` and `avatar_url`:
```go
type SocialAccountDTO struct {
    ID          string                 `json:"id"`
    Platform    string                 `json:"platform"`
    DisplayName string                 `json:"display_name"`
    Handle      string                 `json:"handle"`
    Status      string                 `json:"status"`
    IsMock      bool                   `json:"is_mock"`
    AvatarURL   string                 `json:"avatar_url,omitempty"`
    Validation  *ValidationMetadataDTO `json:"validation,omitempty"`
}
```

2. Register new routes under `routes := router.Group("/api/v1/social-posts")`:
```go
routes.GET("/oauth/:platform/authorize", func(c *gin.Context) {
    platform := strings.ToLower(c.Param("platform"))
    // Check if OAuth credentials exist in cfg; if not, invoke mock fallback
    // In mock fallback:
    c.Redirect(http.StatusTemporaryRedirect, fmt.Sprintf("/studio/accounts?connected=mock&platform=%s", platform))
})

routes.POST("/accounts/mock", func(c *gin.Context) {
    var body struct {
        Platform    string `json:"platform" binding:"required"`
        Handle      string `json:"handle" binding:"required"`
        DisplayName string `json:"display_name" binding:"required"`
    }
    if err := c.ShouldBindJSON(&body); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid mock account payload"})
        return
    }
    key, ok := idempotencyKey(c)
    if !ok {
        return
    }
    call(c, func(ctx context.Context, reqCtx *pb.RequestContext) (interface{}, error) {
        reqCtx.IdempotencyKey = key
        return client.LinkAccount(ctx, &pb.LinkAccountRequest{
            Context:            reqCtx,
            Platform:           body.Platform,
            Handle:             body.Handle,
            DisplayName:        body.DisplayName,
            ExternalAccountRef: fmt.Sprintf("mock:%s:%s", body.Platform, uuid.New().String()[:8]),
            IsMock:             true,
        })
    })
})

routes.DELETE("/accounts/:accountID", func(c *gin.Context) {
    call(c, func(ctx context.Context, reqCtx *pb.RequestContext) (interface{}, error) {
        return client.DisconnectAccount(ctx, &pb.DisconnectAccountRequest{
            Context:   reqCtx,
            AccountId: c.Param("accountID"),
        })
    })
})
```

- [ ] **Step 4: Run gateway tests to verify they pass**

Run:
```bash
cd /home/gautam/Desktop/Monkeys/monkeys_brain/microservices/the_monkeys_gateway/internal/social_post && go test -v
```
Expected: PASS

- [ ] **Step 5: Commit gateway changes**

```bash
git -C /home/gautam/Desktop/Monkeys/monkeys_brain add microservices/the_monkeys_gateway/internal/social_post/
git -C /home/gautam/Desktop/Monkeys/monkeys_brain commit -m "feat(gateway): add OAuth authorize, mock link, and account delink endpoints"
```

---

### Task 5: Frontend API Client & Mutation Hooks in `the_monkeys`

**Files:**
- Modify: `/home/gautam/Desktop/Monkeys/the_monkeys/apps/the_monkeys/src/features/studio/types.ts`
- Modify: `/home/gautam/Desktop/Monkeys/the_monkeys/apps/the_monkeys/src/services/socialPosts/socialPostsApi.ts`
- Modify: `/home/gautam/Desktop/Monkeys/the_monkeys/apps/the_monkeys/src/hooks/studio/useSocialPosts.ts`
- Test: `/home/gautam/Desktop/Monkeys/the_monkeys/apps/the_monkeys/src/services/socialPosts/socialPostsApi.test.ts`

**Interfaces:**
- Consumes: Task 4 (Gateway endpoints)
- Produces: `useSocialAccountMutations()`, updated `SocialAccount` type, `delinkAccount` and `createMockAccount` API methods

- [ ] **Step 1: Write failing API unit tests**

In `apps/the_monkeys/src/services/socialPosts/socialPostsApi.test.ts`:
```ts
it('delinks account and calls DELETE /social-posts/accounts/:id', async () => {
  const result = await socialPostsApi.delinkAccount('acc-123');
  expect(result.success).toBe(true);
});

it('creates mock account and calls POST /social-posts/accounts/mock', async () => {
  const result = await socialPostsApi.createMockAccount({
    platform: 'x',
    handle: '@test',
    display_name: 'Test Account',
  });
  expect(result.is_mock).toBe(true);
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:
```bash
cd /home/gautam/Desktop/Monkeys/the_monkeys/apps/the_monkeys && pnpm test socialPostsApi.test.ts
```
Expected: FAIL

- [ ] **Step 3: Update `types.ts`, `socialPostsApi.ts`, and `useSocialPosts.ts`**

In `types.ts`:
```ts
export type SocialAccount = {
  id: string;
  platform: SocialPlatform;
  handle: string;
  display_name: string;
  avatar_url?: string;
  enabled: boolean;
  is_mock: boolean;
  status?: 'active' | 'disabled' | 'disconnected';
  social_account_id?: string;
  validation?: ValidationMetadata;
};
```

In `socialPostsApi.ts`:
```ts
async delinkAccount(id: string): Promise<{ success: boolean; cancelled_jobs_count: number; drafts_reverted_count: number }> {
  const { data } = await axiosInstance.delete<any>(`${root}/accounts/${id}`);
  return data;
},
async createMockAccount(payload: { platform: SocialPlatform; handle: string; display_name: string }): Promise<SocialAccount> {
  const { data } = await axiosInstance.post<any>(`${root}/accounts/mock`, payload, mutationConfig());
  return data;
},
```

In `useSocialPosts.ts`:
```ts
export function useSocialAccountMutations() {
  const queryClient = useQueryClient();
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: socialPostKeys.accounts });
    void queryClient.invalidateQueries({ queryKey: socialPostKeys.all });
  };

  const delink = useMutation({
    mutationFn: (id: string) => socialPostsApi.delinkAccount(id),
    onSuccess: refresh,
  });

  const createMock = useMutation({
    mutationFn: (payload: { platform: SocialPlatform; handle: string; display_name: string }) =>
      socialPostsApi.createMockAccount(payload),
    onSuccess: refresh,
  });

  return { delink, createMock };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:
```bash
cd /home/gautam/Desktop/Monkeys/the_monkeys/apps/the_monkeys && pnpm test socialPostsApi.test.ts
```
Expected: PASS

- [ ] **Step 5: Commit frontend API changes**

```bash
git -C /home/gautam/Desktop/Monkeys/the_monkeys add apps/the_monkeys/src/features/studio/types.ts apps/the_monkeys/src/services/socialPosts/ apps/the_monkeys/src/hooks/studio/useSocialPosts.ts
git -C /home/gautam/Desktop/Monkeys/the_monkeys commit --no-verify -m "feat(studio): add delinkAccount and createMockAccount API methods and hooks"
```

---

### Task 6: Frontend Connected Accounts Page in `the_monkeys`

**Files:**
- Modify: `/home/gautam/Desktop/Monkeys/the_monkeys/apps/the_monkeys/src/app/studio/accounts/page.tsx`
- Test: `/home/gautam/Desktop/Monkeys/the_monkeys/apps/the_monkeys/src/app/studio/StudioPages.test.tsx`

**Interfaces:**
- Consumes: Task 5 (Hooks & Types)
- Produces: Connected Accounts UI supporting multiple accounts per platform, Demo/Mock badges, and Delink warning modal

- [ ] **Step 1: Write failing component tests in `StudioPages.test.tsx`**

Test:
- Displays multiple accounts under the same platform (e.g. 2 X accounts).
- Renders "Demo / Mock" badge for accounts with `is_mock: true`.
- Clicking "Delink" opens the warning modal detailing scheduled posts cancellation.
- Confirming delink executes `delink` mutation.

- [ ] **Step 2: Run tests to verify failure**

Run:
```bash
cd /home/gautam/Desktop/Monkeys/the_monkeys/apps/the_monkeys && pnpm test StudioPages.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Update `accounts/page.tsx`**

1. Group accounts by platform:
```tsx
const platformAccounts = safeAccounts.filter(
  (item) => item.platform === platform.id && item.status !== 'disconnected'
);
```
2. Render an "Add Account" button in the platform header that opens a connection modal or redirects to `/api/v1/social-posts/oauth/:platform/authorize`.
3. List all accounts under the platform:
   - Handle and display name
   - Avatar or fallback icon
   - "Connected" status badge
   - "Demo / Mock" badge if `account.is_mock`
   - "Delink" button
4. Implement Delink Confirmation Modal:
   - Message: *"Are you sure you want to disconnect @{account.handle}? All scheduled posts targeted to this channel will be cancelled and returned to your drafts."*
   - Buttons: "Cancel" and "Confirm Disconnect"
   - On confirm: calls `delink.mutateAsync(account.id)`, shows success toast, and closes modal.
5. Implement Mock Connect Modal for testing:
   - Input for Handle and Display Name
   - On submit: calls `createMock.mutateAsync({ platform, handle, display_name })`.

- [ ] **Step 4: Run tests and verify they pass**

Run:
```bash
cd /home/gautam/Desktop/Monkeys/the_monkeys/apps/the_monkeys && pnpm test StudioPages.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit Connected Accounts page**

```bash
git -C /home/gautam/Desktop/Monkeys/the_monkeys add apps/the_monkeys/src/app/studio/accounts/page.tsx apps/the_monkeys/src/app/studio/StudioPages.test.tsx
git -C /home/gautam/Desktop/Monkeys/the_monkeys commit --no-verify -m "feat(studio): support multiple accounts per platform, mock indicators, and delink modal"
```

---

### Task 7: Studio Composer Multi-Account Selector in `the_monkeys`

**Files:**
- Modify: `/home/gautam/Desktop/Monkeys/the_monkeys/apps/the_monkeys/src/features/studio/composer/ComposerPage.tsx`
- Test: `/home/gautam/Desktop/Monkeys/the_monkeys/apps/the_monkeys/src/features/studio/composer/ComposerPage.test.tsx`

**Interfaces:**
- Consumes: Task 5 (Hooks & Types), Task 6 (Multiple accounts)
- Produces: Platform toggles with account sub-selectors and multi-account rendition saving

- [ ] **Step 1: Write failing Composer unit tests**

In `ComposerPage.test.tsx`:
- Test that when X is selected and 2 X accounts exist, both accounts are displayed in a sub-selector row.
- Test that saving/scheduling creates renditions for all checked account IDs for that platform.

- [ ] **Step 2: Run tests to verify failure**

Run:
```bash
cd /home/gautam/Desktop/Monkeys/the_monkeys/apps/the_monkeys && pnpm test ComposerPage.test.tsx
```
Expected: FAIL

- [ ] **Step 3: Update `ComposerPage.tsx`**

1. Maintain `selectedAccountIds: string[]` state:
   - When a platform is toggled on, add all connected account IDs for that platform to `selectedAccountIds`.
   - When toggled off, remove them.
2. Render account sub-selector underneath active platform:
   - If a selected platform has > 1 account, render chips/checkboxes for each account: `[@handle1 ✓] [@handle2 ✓]`.
3. In `save()`:
   - Iterate over `selectedAccountIds` rather than singular platform lookup:
   ```tsx
   for (const accountId of selectedAccountIds) {
     const targetAccount = accounts?.find((acc) => acc.id === accountId);
     if (!targetAccount) continue;
     result = await upsertRendition.mutateAsync({
       id: result.id,
       expectedVersion: result.version,
       rendition: {
         social_account_id: targetAccount.id,
         text_override: overrides[targetAccount.platform] || undefined,
       },
     });
   }
   ```

- [ ] **Step 4: Run tests and verify they pass**

Run:
```bash
cd /home/gautam/Desktop/Monkeys/the_monkeys/apps/the_monkeys && pnpm test ComposerPage.test.tsx
```
Expected: PASS

- [ ] **Step 5: Commit Composer changes**

```bash
git -C /home/gautam/Desktop/Monkeys/the_monkeys add apps/the_monkeys/src/features/studio/composer/ComposerPage.tsx apps/the_monkeys/src/features/studio/composer/ComposerPage.test.tsx
git -C /home/gautam/Desktop/Monkeys/the_monkeys commit --no-verify -m "feat(studio): add Composer account sub-selector for multi-account publishing"
```
