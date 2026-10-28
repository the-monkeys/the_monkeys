# Production UI Stability Design

## Problem

Public pages can be delayed or fail during client hydration. Every Axios request currently waits for a third-party public-IP lookup, topic pages fetch the same post feed on the server and again in the browser, shared render helpers assume valid API shapes, and the application has no route-level recovery UI for unexpected client exceptions.

## Design

Client request metadata remains best effort and must never delay an API request. The browser will provide device and environment hints only. The Go gateway remains authoritative for the client IP through its existing `GetClientIP` helper and trusted deployment proxy headers.

Topic pages will render the posts already fetched by the server. Shared post selectors and HTML sanitization will accept malformed or missing values and return safe fallbacks. Browser APIs such as `matchMedia` and `ResizeObserver` will be feature-detected before use.

The application will provide route and global error boundaries with a retry action. React Query Devtools will load only during development, and the landing page will request only the number of posts used by the current layout.

## Constraints

- Do not change public API paths or response contracts.
- Do not perform external IP discovery in either the browser or the synchronous gateway request path.
- Preserve client device, browser, operating-system, session, visitor, language, and viewport metadata when available.
- Do not use em dashes in user-facing copy.
- Preserve SEO metadata and server-rendered topic content.

## Verification

- Regression tests cover non-blocking headers, unavailable browser capabilities, malformed post content, and server-provided topic posts.
- The complete frontend test suite and production build pass.
- Production build output no longer includes the `public-ip` dependency warning.
- Landing, topic, and blog routes render in desktop and mobile viewports without a full-page client exception.
