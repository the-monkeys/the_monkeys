# Production UI Stability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove client-side request blocking and harden public page rendering against browser capability and malformed-content failures.

**Architecture:** Browser metadata collection becomes synchronous and best effort, while the gateway remains authoritative for client IP. Server-fetched topic posts are rendered directly, shared render boundaries normalize unsafe data, and Next.js error boundaries provide recovery from unexpected failures.

**Tech Stack:** Next.js 14, React 18, TypeScript, Axios, React Query, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-14-production-ui-stability-design.md`

## Global Constraints

- Do not change public API paths or response contracts.
- Do not perform external IP discovery in either the browser or the synchronous gateway request path.
- Preserve non-IP client metadata when available.
- Do not use em dashes in user-facing copy.
- Preserve SEO metadata and server-rendered topic content.

---

### Task 1: Non-blocking request metadata

**Files:**

- Create: `apps/the_monkeys/src/utils/requestHeaders.test.ts`
- Modify: `apps/the_monkeys/src/utils/clientInfo.ts`
- Modify: `apps/the_monkeys/src/utils/requestHeaders.ts`
- Modify: `apps/the_monkeys/package.json`
- Modify: `apps/the_monkeys/next.config.mjs`
- Modify: `pnpm-lock.yaml`

**Interfaces:**

- Consumes: browser `navigator`, `screen`, and optional `matchMedia` capabilities.
- Produces: `getAllRequestHeaders(): Promise<Record<string, string>>` without an IP header or external network dependency.

- [ ] Write tests proving headers resolve without public-IP discovery and without `matchMedia`.
- [ ] Run the focused test and confirm the current implementation fails.
- [ ] Remove `public-ip`, omit `X-Real-IP`, and feature-detect optional browser APIs.
- [ ] Run focused tests and confirm they pass.

### Task 2: Safe shared content rendering

**Files:**

- Modify: `apps/the_monkeys/__tests__/src/utils/purifyHTML.test.js`
- Modify: `apps/the_monkeys/src/utils/purifyHTML.ts`
- Modify: `apps/the_monkeys/src/components/blog/getBlogContent.tsx`
- Modify: `apps/the_monkeys/src/app/blog/[slug]/BlogPageClient.tsx`
- Modify: `apps/the_monkeys/src/lib/landingPage.test.ts`
- Modify: `apps/the_monkeys/src/lib/landingPage.ts`
- Modify: `apps/the_monkeys/src/components/layout/navbar/Nav.tsx`

**Interfaces:**

- Consumes: untrusted or incomplete API fields.
- Produces: empty strings or filtered records instead of render-time exceptions.

- [ ] Add malformed-input tests and confirm they fail against current code.
- [ ] Normalize sanitizer and selector inputs, use optional-safe blog title access, and guard `ResizeObserver`.
- [ ] Run focused tests and confirm they pass.

### Task 3: Server-render topic posts and trim production work

**Files:**

- Create: `apps/the_monkeys/__tests__/src/app/topics/BlogsByTopic.test.tsx`
- Modify: `apps/the_monkeys/src/app/topics/[topic]/page.tsx`
- Modify: `apps/the_monkeys/src/app/topics/[topic]/components/BlogsByTopic.tsx`
- Modify: `apps/the_monkeys/src/app/page.tsx`
- Modify: `apps/the_monkeys/src/app/LandingPageClient.tsx`
- Modify: `apps/the_monkeys/src/app/query-client-mount.tsx`

**Interfaces:**

- Consumes: normalized server-fetched topic post arrays.
- Produces: crawlable topic cards without a duplicate browser API request.

- [ ] Add a component test proving server-provided posts render without loading state.
- [ ] Convert the topic list to server-provided data and remove its client fetch.
- [ ] Reduce the landing feed limit to the posts used by the layout.
- [ ] Load React Query Devtools only in development.
- [ ] Run focused tests and confirm they pass.

### Task 4: Recoverable application errors and verification

**Files:**

- Create: `apps/the_monkeys/src/app/error.tsx`
- Create: `apps/the_monkeys/src/app/global-error.tsx`
- Create: `apps/the_monkeys/__tests__/src/app/error.test.tsx`

**Interfaces:**

- Consumes: Next.js route error and reset callback.
- Produces: accessible recovery UI with retry and home navigation.

- [ ] Add a failing error-boundary interaction test.
- [ ] Implement route and global recovery screens.
- [ ] Run the complete frontend test suite.
- [ ] Run lint and the production build, then inspect route bundle output and warnings.
- [ ] Review the final diff for secrets and unrelated files.
