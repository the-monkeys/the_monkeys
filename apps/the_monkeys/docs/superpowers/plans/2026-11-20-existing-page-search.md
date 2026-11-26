# Existing-page search improvements

> Implement in the existing codex/discussion-seo-fixes branch, as explicitly authorized.

Goal: strengthen existing article discovery and X screenshot search entry without new pages, changed URLs or redesigned layouts.

Approved scope: improve relevant descriptions and answers, internal links and image delivery; work locally, preserve private content and staged mobile fixes; commit and push; no PR or production writes.

Approach: reuse existing article metadata extraction, the anonymous public catalog and the existing recommendation cards and Studio help. Avoid hard-coded runtime article overrides, silent changes to author content, extra landing pages or keyword repetition targets.

## Tasks
- [x] Correct nested-list and table body text extraction for descriptions and Article JSON-LD. Preserve the existing title extraction and slug semantics exactly. Test strings, modern nested lists, malformed values, Hindi and no mutation.
- [x] Load public related articles on the server and pass them into the existing recommendation UI. Keep the legacy client fallback. Exclude current, duplicate, future, draft and group-only records. Test unavailable APIs, anonymous requests and initial HTML links.
- [x] Optimize only recommendation card images using existing Next Image quality, sizes and priority controls; preserve existing geometry and other callers. Test lazy loading and explicit sizes.
- [x] Refine the X tool's existing title, description, instructions and FAQs using actual supported URLs, sizes and export behavior. Keep tabs, controls and canonical URL intact. Test metadata and visible/schema agreement.
- [x] Prepare versioned editorial refreshes for the existing SpiderMonkey and Go roadmap articles: exact original title retained, direct opening answers, useful additions, primary sources and relevant existing links. These content drafts are separate from automatic runtime behavior; no production article writes. Validate against local source documents.
- [x] Run focused tests, TypeScript, scoped lint and compiled local HTTP checks; attempt responsive browser checks and record the connection blocker. Review changes, verify the protected index fingerprint, commit and push only relevant files.

## Evidence and review focus
Saved Search Console baseline: Oct 21-Nov 17, 2026. SpiderMonkey: 128 impressions, 0 clicks, position 9.77. Go roadmap: 232 impressions, 2 clicks, position 18.25. X page: 63 impressions, 2 clicks, position 8.08. These observations prioritize experiments; sitewide queries are not assumed to be exact page-query pairs.

Review: missing/deleted/private posts; API outages and stale client requests; legacy list shapes; immutable multilingual slugs; actual supported export formats. No new tracking, auth changes, backend migrations, dependencies or external publication.

Verification: 124 tests passed across 29 files; TypeScript and final scoped lint passed. Independent review found no remaining important issues after legacy-tag, pagination, transient-fallback, UTC-date and block-ID regressions were added. Browser responsive checks are currently blocked by the inbuilt control connection despite reopening. Local HTML and isolated cached-font build checks are recorded separately in the task evidence folder.

Final build: passed with unchanged application fonts served from verified local copies of the exact Google font dependencies. Original tsconfig restored; generated build moved outside the repository. Compiled local HTTP checks: all three existing URLs returned 200. Both articles contain six distinct related article URLs in initial HTML, six lazy-loaded responsive images using configured quality 80, valid Article JSON-LD and no [object Object] text. The X tool retains its canonical URL and includes the new supported-link/mobile-save answers. Responsive visual verification remains blocked by the inbuilt control connection; it is not claimed as passed.
