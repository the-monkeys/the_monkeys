# Repeatable HTTP page benchmarks

This stdlib-only harness measures controlled HTTP GET requests against an explicit
page allowlist. Use a **local production build and production server** for both the
before and after runs. Build/start commands and data preparation belong to the
application workflow; this script does not build or start the app.

It measures initial HTML response performance at controlled local request
concurrency. It does not simulate real production traffic, execute JavaScript,
fetch assets or client APIs, render a browser, or measure browser LCP. Client-only
and protected routes can return only a shell or login redirect. Label them as
initial HTML measurements; these are not full authenticated-page measurements.

## Manifest

Supply `--manifest` explicitly. No routes are discovered or crawled. UTF-8 JSON can
be a path array or an object containing a `routes` array. Entries can be literal
paths, or objects with `path` and an optional descriptive `label`:

```json
{
  "routes": [
    {"path": "/", "label": "public static page"},
    {"path": "/topics/science", "label": "representative topic initial HTML"},
    {"path": "/snapshot/new", "label": "client-only/protected initial HTML"}
  ]
}
```

Feed the reviewed static inventory and stable representative dynamic paths into
this manifest. Use existing, consistent data for dynamic pages. Object entries
support `path`, `label`, and optional boolean `local_only`; labels are at most 300 characters. Paths must be
unique, literal origin-relative ASCII paths starting with `/`. Absolute filesystem
paths, absolute URLs, `//` hosts, queries (including action queries), fragments,
percent encodings, backslashes, traversal, and API/logout/delete/remove/action or
auth callback/token paths are rejected before requests begin. Unicode/encoded
slugs are conservatively unsupported. Review the allowlist: GET alone cannot
prove that an application's handler has no side effects. Exclude action/token
routes even if their names are not recognized by the conservative denylist.

## Controlled local runs

From the frontend repository root in PowerShell, after the main workflow has
started its local production server at port 3001:

```powershell
python -B scripts/benchmark-pages.py --manifest scripts/benchmark-routes.json --warmup --concurrency 1 --repeats 5 --output docs/benchmarks/before-c1.json
# After the comparable production build has been started:
python -B scripts/benchmark-pages.py --manifest scripts/benchmark-routes.json --warmup --concurrency 1 --repeats 5 --output docs/benchmarks/after-c1.json
```

The manifest and output directory must already exist. These example commands are
for the person coordinating the builds; implementing/testing the harness does
not run them. Report files are created exclusively and **never overwritten**.
Use distinct descriptive filenames for every run and retain the original baseline.

Defaults: `--base-url http://127.0.0.1:3001`, `--concurrency 1`, `--repeats 5`,
`--timeout 20` seconds, and no warmup. `--warmup` sends exactly one sequential GET
per route before measured requests and records its samples/summaries separately.
Measured request count is `routes Ãƒâ€” repeats`; warmup adds `routes` requests.
Measured work visits every route for each repeat, with at most the configured
number of outstanding requests. Concurrency must be 1Ã¢â‚¬â€œ8; choose a small bounded
value (for example 1 or 4) and hold it constant across each comparison. There is no
request-rate or arrival-pattern simulation. Every sample uses a new connection,
without automatic retries, proxy use, cookie persistence, or redirect following.

The supplied manifest includes all 28 literal static pages except the auth callback
and reset/verify token routes, six representative dynamic pages, and four supplied
local-only NSFW fixtures (38 routes total). The NSFW entries have `local_only: true`
and explicit gated initial-HTML labels. Remote runs reject a manifest containing
local-only fixtures, even with `--allow-remote`; create a separately reviewed
manifest omitting them for any authorized future production comparison.

The default accepts only `localhost`, `*.localhost`, and `127.0.0.1`.
Local hostnames connect directly to IPv4 loopback while retaining their HTTP Host
and HTTPS SNI name. `--base-url` must be an HTTP(S) origin, with optional port and
no credentials, path prefix, query, or fragment. A later **explicitly authorized**
postdeployment comparison can use `--allow-remote --base-url https://your-host`.
Do not use remote traffic to establish the local baseline. The remote flag is an
opt-in, not permission to load a deployment; keep its request count/concurrency
small and separately authorize that comparison.

Optional session cookies come only from `MONKEYS_BENCH_COOKIE` in the environment.
Do not put secrets in a manifest or command argument. The cookie is sent only to
the chosen origin; redirects are never followed, including same-origin redirects.
The harness never saves bodies, Set-Cookie, or general response headers. Cookie
values reflected in saved strings are redacted; exception messages are not saved.
The report contains only selected response metadata and the supplied labels.

## Report and interpretation

JSON schema version 1 records UTC start timestamp, source checkout git commit
(or `null` if unavailable), origin, route paths, `route_labels`, settings,
`measured_request_count`, measured `samples`/`summaries`, and separate `warmup`
request count/samples/summaries. The commit identifies the source checkout, not
the actual running build or uncommitted modifications; record build provenance
alongside each run.

Each sample includes route, repeat number, HTTP status (or `null` without headers),
redirect Location, Content-Type, declared Content-Length, HTTP version, bytes read,
TTFB milliseconds, total milliseconds, and an error code. TTFB is a client-side
proxy measured when the response headers are available to Python, rather than a
packet-level first-byte timestamp. Total time includes reading/draining the body.
Bytes count payload read after transfer framing, not headers or total wire bytes;
`Accept-Encoding: identity` is requested. Response bodies are discarded in chunks.
The timeout applies to blocking socket operations; a body deadline is checked
between chunks. It is not a hard wall-clock limit on DNS or slowly trickled headers.

Per-route summaries contain sample count, total bytes, status counts (including
`no_response`), errors, redirects, and p50/p95 for total and TTFB times using the
**nearest-rank** method (`ceil(percentile Ãƒâ€” count)`, one-based). All total durations
are included, including HTTP errors, transport failures, timeouts and partial
bodies. Unknown TTFB values have explicit `missing` counts; they are not fabricated
or silently presented as successful samples. Non-2xx statuses, including redirects,
count as errors for interpretation; redirects also have a separate count. Warmup
failures remain in warmup metadata. A completed report returns exit code 0 even if
samples failed: inspect counts/statuses before comparing performance. Invalid
configuration/manifest/cookie/output returns exit code 2 without page requests.

For an apples-to-apples comparison, keep the manifest, representative data,
session/age-gate state, production build mode, server command/runtime versions,
backend endpoints, database contents, cache state/warmup, concurrency, repeats,
timeouts, network path, and machine workload consistent. Record any deliberate
changes and whether a route is public, protected, client-rendered, or a redirect.
Distinguish cold from warm runs. Compare response/status/byte counts as well as
latency, and never interpret faster failures or login shells as page improvements.
Five repeats provide a small sanity sample; p95 at that size is essentially the
maximum, not a reliable tail-latency estimate. Local and postdeployment latency
also include different networks/infrastructure and need separate interpretation.

## Focused tests

No dependencies or application server are required:

```powershell
python -B -m unittest discover -s scripts -p test_benchmark_pages.py -v
```

Tests use only a disposable loopback HTTP fixture, never the application server.
They cover route/target validation, bounded concurrency, manifest labels, HTTP
metadata, warmup isolation, percentiles including failures, timeout/partial reads,
cookie protection, no redirects, and baseline output preservation.


## Build bundle measurements

`benchmark-bundles.py` reads the selected Next build's app manifest and measures
unique JavaScript chunks for each page entry plus its ancestor layouts. It
records raw bytes and the sum of individually gzipped chunk sizes, build ID,
checkout SHA and the exact chunk list. It rejects manifest paths outside the
build directory. This is a reproducible manifest-size estimate, not a browser
network-transfer, cache, parse-time or LCP measurement. Async assets, images and
fonts are outside this calculation. Next's printed First Load JS table uses a
different accounting method; do not mix the two metrics.

```powershell
python -B scripts/benchmark-bundles.py --build-dir apps/the_monkeys/.next-perf-before --output docs/benchmarks/before-bundles.json
python -B scripts/benchmark-bundles.py --build-dir apps/the_monkeys/.next-perf-after --output docs/benchmarks/after-bundles.json
python -B -m unittest discover -s scripts -p 'test_benchmark_*.py'
```

Run after a successful production build. Output files are created exclusively.
The before/after manifests cover all page entries, including dynamic templates;
the HTTP route manifest covers the safe static-page inventory and representative
existing dynamic records. Authentication callback, token verification/reset,
invitation and unspecified record/action paths are deliberately not exercised.
A representative dynamic URL does not prove every record's performance.

## Repeating after deployment

The checked-in manifest contains four `local_only` NSFW fixture records. The
harness refuses to send these to remote origins. When a deployment comparison is
explicitly authorized, derive a separate manifest excluding `local_only` entries
and review representative dynamic URLs against that deployment. Use a distinct
report filename and start at concurrency one; opt into a small concurrency-four
run only within the authorized workload. Do not copy local session credentials
to a production benchmark.

Keep the local baseline files. Compare every route's status, redirects, bytes,
p50 and p95, not just the aggregate. A different database, CDN, connection or
cache state needs its own interpretation. The benchmark script does not deploy,
create an automation, or send any production requests on its own.

The checked-in raw timing and bundle reports use compact JSON to keep the code review small; no samples or precision are removed. Provenance, browser checks and the human-readable results note remain formatted.
