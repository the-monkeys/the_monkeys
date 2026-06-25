# Docker Refactor - June 2026

## Overview

This refactor addresses a limitation in how the Next.js application was containerized and configured. Previously, environment variables were embedded during the build process, making Docker images environment-specific and difficult to reuse across different deployments.

The new approach uses [`next-runtime-env`](https://www.npmjs.com/package/next-runtime-env) to enable runtime configuration, allowing a single Docker image to be deployed to multiple environments without rebuilding.

---

## Previous Approach

The application relied on Next.js `NEXT_PUBLIC_*` environment variables during the build process.

### Limitations

* Environment variables were embedded into the application at build time.
* Docker images became environment-specific.
* Any change to public environment variables required rebuilding and republishing the image.
* The same image could not be reused across Development, Staging, and Production environments.
* Configuration changes required a full CI/CD build cycle, even when only environment values changed.

### Example

If an image was built with:

```env
NEXT_PUBLIC_API_URL=https://staging-api.example.com
```

the API URL was permanently embedded in the generated frontend assets. Deploying the same image to Production would still use the staging API endpoint unless a new image was built.

---

## New Approach

The application now uses `next-runtime-env` to load configuration at runtime instead of build time.

A single Docker image is built once and pushed to the container registry. Environment-specific configuration is injected when the container starts. `next-runtime-env` automatically exposes all `NEXT_PUBLIC_*` variables to the browser at runtime via an inline script, without any custom API endpoint or manual fetching.

### Benefits

* Build once, deploy anywhere.
* The same image can be used for Development, Staging, and Production.
* Environment variables can be changed without rebuilding the image.
* Faster deployments and simpler CI/CD workflows.
* Improved portability and consistency across environments.
* No custom `/api/config` endpoint needed — `next-runtime-env` handles the plumbing.

### Runtime Configuration Flow

1. Docker image is built and pushed to the registry.
2. `NEXT_PUBLIC_*` environment variables are provided when the container starts.
3. `PublicEnvScript` in `app/layout.tsx` injects the runtime values into the page as an inline script at render time.
4. Client components access values via the `env()` helper from `next-runtime-env`.
5. Server components and API routes continue to read directly from `process.env`.

---

## Implementation Details

### Installation

```bash
npm install next-runtime-env
```

### `app/layout.tsx`

Add `PublicEnvScript` to the `<head>`. This component reads all `NEXT_PUBLIC_*` variables available to the running server process and injects them into the HTML at render time — no build-time baking, no custom endpoints.

```tsx
// app/layout.tsx
import { PublicEnvScript } from 'next-runtime-env';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <PublicEnvScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Client Components

Use the `env()` helper anywhere in client code. It reads from the runtime values injected by `PublicEnvScript`, not from the build-time bundle.

```tsx
// app/some-page.tsx
'use client';
import { env } from 'next-runtime-env';

export default function SomePage() {
  const apiUrl = env('NEXT_PUBLIC_API_URL');
  return <div>API URL: {apiUrl}</div>;
}
```

### `src/constants/api.ts`

Updated to use `env()` instead of `process.env.NEXT_PUBLIC_*`. This removes the hard build-time dependency on environment values.

```ts
// src/constants/api.ts
import { env } from 'next-runtime-env';

export const API_URL = env('NEXT_PUBLIC_API_URL');
export const WS_URL  = env('NEXT_PUBLIC_WS_URL');
```

### Server Components and API Routes

No changes needed. Server-side code continues to access `process.env` directly, as the values are available from the container environment at runtime.

```ts
// Server component or API route
const secret = process.env.SECRET_KEY; // works as before
```

### `.env` Files (Development)

No changes needed. During local development, `next-runtime-env` reads from `.env.local` just like standard Next.js, so the developer experience is unchanged.

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## What Was Removed

The previous custom implementation is no longer needed and should be deleted:

* `app/api/config/route.ts` — the custom runtime config endpoint
* `src/lib/runtime-config.ts` — the manual fetch-and-cache utility

`next-runtime-env` replaces both with `PublicEnvScript` (server-side injection) and `env()` (client-side access).

---

## Impact

### Development

Developers continue using `.env.local` files. `env()` works exactly like `process.env.NEXT_PUBLIC_*` would have, with no change in DX.

### Staging

The staging environment supplies its own `NEXT_PUBLIC_*` values at container start. The same image artifact is used as production — no separate build.

### Production

Production deployments inject production-specific variables at runtime. Promoting an image from Staging to Production requires only a config change, not a rebuild.

---

## Result

Docker images are now portable, environment-agnostic artifacts that can be promoted across environments without rebuilding. `next-runtime-env` handles runtime injection cleanly, replacing the previous custom `/api/config` + fetch-and-cache pattern with a single `<PublicEnvScript />` component and a one-line `env()` call.

---

## References

- [next-runtime-env on npm](https://www.npmjs.com/package/next-runtime-env)
- [expatfile/next-runtime-env on GitHub](https://github.com/expatfile/next-runtime-env)
- [Next.js Runtime Environment Variables](https://nextjs.org/docs/app/guides/environment-variables#runtime-environment-variables)
- [Build Once, Deploy Many](https://www.mikemcgarr.com/blog/build-once-deploy-many.html)