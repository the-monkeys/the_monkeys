# Docker Refactor - June 2026

## Overview

This refactor addresses a limitation in how the Next.js application was containerized and configured. Previously, environment variables were embedded during the build process, making Docker images environment-specific and difficult to reuse across different deployments.

The new approach enables runtime configuration, allowing a single Docker image to be deployed to multiple environments without rebuilding.

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

The application now loads configuration at runtime instead of build time.

A single Docker image is built once and pushed to the container registry. Environment-specific configuration is injected when the container starts.

### Benefits

* Build once, deploy anywhere.
* The same image can be used for Development, Staging, and Production.
* Environment variables can be changed without rebuilding the image.
* Faster deployments and simpler CI/CD workflows.
* Improved portability and consistency across environments.

### Runtime Configuration Flow

1. Docker image is built and pushed to the registry.
2. Environment variables are provided when the container starts.
3. The application exposes runtime configuration through an API endpoint.
4. The frontend retrieves and caches the configuration.
5. API clients and other services consume the runtime values.

---

## Implementation Details

### `/api/config`

Provides runtime configuration to the frontend.

Responsibilities:

* Reads environment variables available to the running container.
* Returns configuration values required by the client.
* Serves as the single source of truth for runtime configuration.

### `src/lib/runtime-config.ts`

Client-side runtime configuration loader.

Responsibilities:

* Fetches configuration from `/api/config`.
* Caches configuration to avoid repeated network requests.
* Provides a consistent API for accessing runtime values.

### `src/constants/api.ts`

Updated to use runtime configuration instead of build-time environment variables.

Responsibilities:

* Retrieves API endpoints from the runtime configuration layer.
* Removes dependency on build-time `NEXT_PUBLIC_*` variables.

---

## Impact

### Development

Developers can run the same image with different configuration values by supplying a different `.env` file.

### Staging

The staging environment can use its own API endpoints and services without requiring a separate image build.

### Production

Production deployments can use the same image artifact while injecting production-specific configuration at runtime.

---

## Result

Docker images are now portable, environment-agnostic artifacts that can be promoted across environments without rebuilding, while configuration remains flexible and environment-specific.


## References

- https://nextjs.org/docs/app/guides/environment-variables#runtime-environment-variables
- https://nemanjamitic.com/blog/2025-12-13-nextjs-runtime-environment-variables/