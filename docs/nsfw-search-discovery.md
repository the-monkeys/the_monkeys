# NSFW article search discovery

This opt-in feature lets verified Googlebot, Google-InspectionTool, OAI-SearchBot and PerplexityBot read published public NSFW article text at the existing article URL. Human visitors keep the existing login, birthday and reveal checks. Age eligibility still uses the self-reported profile birthday; separate identity/age verification is outside this feature. It does not rewrite author content, create a service, change PostgreSQL, or change the production Compose procedure.

## Default and mixed-version behavior

Without the settings below the previous behavior remains: restricted articles are redacted and excluded from indexing. New frontend plus old backend also retains that behavior because the backend must explicitly return the optional SEO capability. Old frontend plus new backend ignores the optional fields and continues its existing protection. Do not enable the frontend flag until the backend and trusted ingress are ready.

## Required private runtime settings

Gateway:
- NSFW_SEO_ENABLED=1
- SEO_CRAWLER_SIGNING_KEY: a random private value of at least 32 characters.

Next.js frontend:
- NSFW_SEO_ENABLED=1
- SEO_CRAWLER_SIGNING_KEY: the same value used by the Gateway.
- SEO_CRAWLER_INGRESS_SECRET: a different random private value of at least 32 characters.

Never prefix these settings with NEXT_PUBLIC. Never commit their values or print them in application/access logs. Existing env_file loading is sufficient; no Compose file change is required.

The trusted proxy in front of Next.js must OVERWRITE, not append, these request headers:
- X-Monkeys-Ingress-Proof: the private ingress secret.
- X-Monkeys-Client-IP: the actual independently established client address.
- User-Agent: the original request user agent.

The Next.js application cannot prove a socket peer from arbitrary forwarded headers. This private ingress contract is therefore mandatory. Do not copy client-provided X-Forwarded-For or CF-Connecting-IP without an independently verified trusted-proxy configuration. Requests reaching Next.js directly without the secret cannot acquire the crawler assertion. HTTPS/private trusted transport is required between the ingress, Next.js and Gateway as appropriate to the actual network.

Production proxy topology has NOT been verified in this task. Leave the flags disabled until the owner configures and verifies this contract. The existing manual Docker compose pull/up deployment still works with the feature disabled. Configuring this opt-in feature is a separate deployment prerequisite, not an automatic production change.

## Verification and policy

Next.js middleware classifies the raw request before Next removes router headers, always overwriting any client-supplied classification marker. The server signing helper requires that document marker in addition to authenticated ingress. Next.js signs only document requests with the authenticated ingress secret and a recognized search agent. Cookie/authorization-bearing requests and recognized RSC, router-prefetch, server-action and prefetch subrequests do not receive an assertion. Next may normalize a header-only prefetch probe without the Flight protocol into a normal HTML document; a genuinely verified indexing crawler can read that document. This does not authorize an ordinary browser or a spoofed crawler. The assertion binds GET, the exact article API path, source IP, original agent and timestamp; the Gateway accepts at most 60 seconds of age and 5 seconds of clock skew.

The Gateway then verifies the IP against the matching provider's official HTTPS list. Lists are bounded, refreshed hourly, reject redirects, and fail closed on expiry/fetch failure. Failed refreshes have a one-minute retry delay. There is no per-request DNS lookup and no generic Google Cloud IP exception.

The existing User Service moderation RPC checks anonymous publication and audience every time. The exception applies only to a matching public article detail, never list/search results, private/members-only content, drafts or human reveal actions. Crawler output uses an allowlist and does not mutate reveal consent. No user account is fabricated.

Provider lists:
- https://developers.google.com/static/crawling/ipranges/common-crawlers.json
- https://openai.com/searchbot.json
- https://www.perplexity.ai/perplexitybot.json

ChatGPT-User, GPTBot and Perplexity-User are not indexing exceptions. This feature does not alter training permissions.

## Rendering, discovery and age protection

Verified crawler responses contain escaped original article text/code with registration-gated Article markup. Protected content is not hydrated into a visitor's query cache. Other visitors retain generic sensitive metadata and the existing age gate. Backend content responses and dynamic frontend pages must remain private/no-store; local verification checks the actual served headers and cache ordering.

The public catalog adds the optional original stored slug for location discovery without replacing explicit canonical_slug. Existing public-page canonical and RSS GUID rules are unchanged. The sitemap includes only canonical location/date information for public restricted articles carrying the backend capability. General public-content filtering is unchanged: RSS, related-post exports, snapshots and Open Graph previews do not acquire restricted text or images.

After the user's clarification that explicit material may be indexed while on-site viewing is gated, crawler text snippets remain eligible. Blanket nosnippet/data-nosnippet restrictions were intentionally removed from the crawler document because they conflict with the requested AI-search discovery. Search providers control their own results and previews; Monkeys cannot guarantee off-site age containment.

Original restricted image URLs remain protected. This feature enables article-text discovery, not public image indexing or crawler media bypass. Crawler metadata suppresses image/video previews. The existing binary NSFW flag does not identify sexual explicitness, so the implementation does not label every NSFW article or the whole site as sexually explicit. Content has an accurate 18+ access rating; providers can classify fetched text. A separate explicit-content taxonomy is not silently introduced.

## Deployment verification and rollback

1. Deploy backward-compatible code with flags off.
2. Establish private settings and trusted ingress; verify header overwrite and real client attribution.
3. Enable Gateway, then frontend.
4. Verify signed crawler access, spoofed-header denial, private-content denial, normal signed-out/minor/adult journeys and private cache headers.
5. Use live Search Console inspection and provider crawling after deployment. A local signed fixture does not prove a real Google crawl.
6. Compare normal-page SEO controls and 7/28-day clicks/query cohorts against the preserved Search Console baseline.

Disable the flags to restore the previous exclusion behavior. No data deletion or reverse migration is necessary. Disabling future crawling cannot recall material already ingested by external providers. Do not claim ranking growth from local tests.

## Sources

- https://developers.google.com/search/docs/specialty/explicit/guidelines
- https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests
- https://developers.google.com/search/docs/appearance/structured-data/paywalled-content
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.openai.com/api/docs/bots
- https://docs.perplexity.ai/docs/resources/perplexity-crawlers

Google-InspectionTool is admitted only with the same official common-crawler IP verification and server assertion, for Search Console and Rich Results testing. Generic GoogleOther and user-triggered fetcher identities remain excluded.
