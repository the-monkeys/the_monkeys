# Studio Social Media Account Linking & Delinking Design

## 1. Overview & Goals
Allow users to manually link and delink multiple social media accounts of each platform type (e.g., multiple X/Twitter accounts, multiple Instagram accounts, LinkedIn, Facebook, YouTube, TikTok).

- **Authentication Flow**: Follows standard OAuth 2.0 redirect flows (similar to Postiz and OpenPost) for each provider.
- **Local / Demo Fallback**: When third-party OAuth app credentials (`CLIENT_ID`, `CLIENT_SECRET`) are not configured in the environment, the system provides a mock OAuth fallback flow and clearly flags those accounts as demo/mock accounts (`is_mock = true`) across both backend and frontend.
- **Delinking**: Performs a soft delink / disconnect (`status = 'disconnected'`, wiping stored credentials), automatically cancels pending scheduled jobs for that account, and reverts affected posts to `draft` while warning the user in a confirmation modal.
- **Studio Composer Multi-Account Targeting**: Enables platform toggles with an account sub-selector (checkboxes/chips) beneath the active platform to choose which specific account(s) will receive the post.

---

## 2. Architecture & Data Flow

```
+-----------------------------------------------------------------------------------------+
|                                    Next.js Frontend                                     |
|                                                                                         |
|  [Connected Accounts Page]                     [Composer Page]                          |
|  - Groups accounts by platform                 - Platform toggles                       |
|  - "Connect Account" -> OAuth / Mock           - Account sub-selector chips             |
|  - Demo/Mock indicator badges                  - Targets renditions to social_account_id|
|  - "Delink" -> Warning modal -> Disconnect                                              |
+---------------------------+---------------------------------+---------------------------+
                            |                                 |
                            | HTTP / REST                     | HTTP / REST
                            v                                 v
+-----------------------------------------------------------------------------------------+
|                                 The Monkeys Gateway                                     |
|                                                                                         |
|  - GET  /api/v1/social-posts/oauth/:platform/authorize  (Generates state/PKCE / Mock)   |
|  - GET  /api/v1/social-posts/oauth/:platform/callback   (Exchanges code, gets profile)  |
|  - POST /api/v1/social-posts/accounts/mock              (Creates demo/mock account)     |
|  - DELETE /api/v1/social-posts/accounts/:id             (Calls DisconnectAccount)       |
+-------------------------------------------+---------------------------------------------+
                                            |
                                            | gRPC (SocialPostService)
                                            v
+-----------------------------------------------------------------------------------------+
|                             The Monkeys Social Post Service                             |
|                                                                                         |
|  - LinkAccount(): Inserts/updates social_accounts (status='active', is_mock, tokens)    |
|  - DisconnectAccount(): Sets status='disconnected', wipes tokens, cancels pending       |
|    publish jobs, and reverts scheduled posts to draft                                   |
|  - ListAccounts(): Returns user's accounts with is_mock, avatar_url, and status         |
+-------------------------------------------+---------------------------------------------+
                                            |
                                            | SQL
                                            v
+-----------------------------------------------------------------------------------------+
|                                  PostgreSQL Database                                    |
|                                                                                         |
|  - Table: social_accounts                                                               |
|    - Drops uq_social_accounts_owner_platform (allows multiple accounts per platform)    |
|    - Enforces uq_social_accounts_external_ref (prevents duplicate external IDs)         |
|    - Adds is_mock BOOLEAN, avatar_url TEXT, and status IN ('active','disabled',         |
|      'disconnected')                                                                    |
+-----------------------------------------------------------------------------------------+
```

---

## 3. Detailed Component Specifications

### 3.1 Database Migration (`monkeys_brain/schema/000023_allow_multiple_social_accounts.up.sql`)
1. **Drop single-account constraint**:
   ```sql
   ALTER TABLE social_accounts DROP CONSTRAINT IF EXISTS uq_social_accounts_owner_platform;
   ```
2. **Update status constraint**:
   ```sql
   ALTER TABLE social_accounts DROP CONSTRAINT IF EXISTS chk_social_accounts_status;
   ALTER TABLE social_accounts ADD CONSTRAINT chk_social_accounts_status
       CHECK (status IN ('active', 'disabled', 'disconnected'));
   ```
3. **Add new columns**:
   ```sql
   ALTER TABLE social_accounts ADD COLUMN IF NOT EXISTS is_mock BOOLEAN NOT NULL DEFAULT FALSE;
   ALTER TABLE social_accounts ADD COLUMN IF NOT EXISTS avatar_url TEXT;
   ```
4. **Update default provisioning trigger**:
   - `provision_social_mock_accounts()`: Sets `is_mock = TRUE`, `status = 'active'`, and uses `ON CONFLICT (owner_user_id, platform, external_account_ref) DO NOTHING`.

### 3.2 Protobuf Contracts (`monkeys_brain/apis/serviceconn/gateway_social_post/pb/gw_social_post.proto`)
- **Extend `SocialAccount`**:
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
  ```
- **New Service RPCs**:
  ```protobuf
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

  service SocialPostService {
    ...
    rpc LinkAccount(LinkAccountRequest) returns (SocialAccount);
    rpc DisconnectAccount(DisconnectAccountRequest) returns (DisconnectAccountResponse);
  }
  ```

### 3.3 Backend Service (`the_monkeys_social_post`)
- **`LinkAccount`**:
  - Validates `platform` is one of `x`, `linkedin`, `instagram`, `facebook`, `youtube`, `tiktok`.
  - Encrypts tokens using system secret.
  - Inserts/updates `social_accounts` with `owner_user_id`, `platform`, `display_name`, `handle`, `external_account_ref`, `avatar_url`, `is_mock`, `status = 'active'`.
- **`DisconnectAccount`**:
  - Verifies user ownership of `account_id`.
  - In a single database transaction:
    1. Updates `social_accounts` SET `status = 'disconnected'`, `encrypted_access_token = NULL`, `encrypted_refresh_token = NULL`, `updated_at = NOW()`.
    2. Cancels pending jobs: `UPDATE social_publish_jobs SET status = 'cancelled' WHERE social_account_id = $1 AND status IN ('ready', 'retry_wait')`.
    3. Reverts affected posts: `UPDATE social_posts SET state = 'draft', status = 'draft' WHERE id IN (SELECT DISTINCT post_id FROM social_publish_jobs WHERE social_account_id = $1) AND state = 'scheduled'`.
    4. Records audit log event `account_disconnected`.

### 3.4 API Gateway (`the_monkeys_gateway`)
- **OAuth Endpoints**:
  - `GET /api/v1/social-posts/oauth/:platform/authorize`:
    - Reads client credentials for `:platform` from config.
    - If configured: generates state (CSRF + PKCE verifier) and redirects to platform OAuth consent URL.
    - If not configured (Mock Fallback): redirects to `/studio/accounts/mock-connect?platform=:platform` or directly provisions a demo account via `LinkAccount` and redirects to `/studio/accounts?connected=mock`.
  - `GET /api/v1/social-posts/oauth/:platform/callback`:
    - Validates state, exchanges code for tokens, retrieves user profile info (`handle`, `display_name`, `avatar_url`), calls gRPC `LinkAccount`, redirects to `/studio/accounts?connected=true&platform=:platform`.
  - `POST /api/v1/social-posts/accounts/mock`:
    - Manual mock creation endpoint accepting `{ "platform": "...", "handle": "...", "display_name": "..." }`, setting `is_mock = true`.
  - `DELETE /api/v1/social-posts/accounts/:accountID`:
    - Calls gRPC `DisconnectAccount`, returns `{ "success": true, "cancelled_jobs": n, "reverted_drafts": m }`.

### 3.5 Frontend Architecture (`the_monkeys`)
- **`types.ts` & `socialPostsApi.ts`**:
  - Updates `SocialAccount` type with `is_mock` and `status`.
  - Adds `delinkAccount(id: string)` and `createMockAccount(...)`.
- **`useSocialPosts.ts`**:
  - Adds `useSocialAccountMutations()` hook with `delink` and `createMock`.
- **`accounts/page.tsx`**:
  - Groups accounts by platform (`safeAccounts.filter(a => a.platform === platform.id && a.status !== 'disconnected')`).
  - Renders all accounts per platform with handle, display name, avatar, "Connected" badge, and "Demo / Mock" indicator if `account.is_mock`.
  - Platform card header includes "Add Account" button initiating OAuth / mock connect.
  - "Delink" button on each account triggers a confirmation modal warning that scheduled posts will be cancelled and moved to drafts.
- **`ComposerPage.tsx`**:
  - Top-level platform toggles (`[X]`, `[LinkedIn]`, etc.).
  - When an active platform has multiple connected accounts, an account sub-selector row appears below the platform toggle with chips/checkboxes for each account.
  - Rendition creation/upsert loops over each selected `social_account_id`.

---

## 4. Error Handling & Edge Cases
1. **OAuth Failures**:
   - Expired or invalid state triggers a redirect to `/studio/accounts?error=invalid_state`.
   - Access denied by user on provider screen redirects to `/studio/accounts?error=oauth_denied&platform=:platform`.
2. **Duplicate Accounts**:
   - If an account with the same `(owner_user_id, platform, external_account_ref)` exists and was `disconnected`, `LinkAccount` reactivates it to `active` and refreshes tokens.
3. **Active Publishing Conflict**:
   - If a job is currently `leased` by a worker when delinking occurs, it runs to completion/failure. Only jobs in `ready` or `retry_wait` are cancelled.
4. **Token Expiration**:
   - If publishing fails due to expired or revoked OAuth tokens, the account is marked `disabled`, and the user is alerted to reconnect.

---

## 5. Verification Plan

### Backend Verification (`monkeys_brain`)
- Run SQL migration and verify constraints via `psql` or Go migration tests.
- Unit tests in `the_monkeys_social_post`:
  - `TestLinkAccount`: tests active status, token encryption, and `is_mock` flag.
  - `TestDisconnectAccount`: tests job cancellation, post reversion to `draft`, and audit logging.
- Gateway route tests in `the_monkeys_gateway`:
  - Test `/oauth/:platform/authorize` real vs mock fallback redirect.
  - Test `/accounts/mock` and `/accounts/:id` deletion.

### Frontend Verification (`the_monkeys`)
- Unit/component tests:
  - `StudioPages.test.tsx` / `AccountsPage.test.tsx`:
    - Renders multiple accounts under one platform.
    - Displays "Demo / Mock" badge for mock accounts.
    - Delink button opens confirmation modal with draft cancellation warning.
    - Confirming delink calls API and updates account list.
  - `ComposerPage.test.tsx`:
    - Platform toggle reveals account sub-selector when multiple accounts exist.
    - Selected accounts generate renditions for each `social_account_id`.
