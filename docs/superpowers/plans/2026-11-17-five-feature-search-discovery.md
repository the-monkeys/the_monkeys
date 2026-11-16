# Existing-page search discovery implementation

User-approved scope: improve the five existing features (posts, events, groups, discussions and Studio), preserve the current visual design, mobile behavior, permissions and historical content. No new landing pages or production changes. Start from latest main. Keep the separate staged mobile fixes untouched. Commit and push after verification; the user creates the PR.

Base: origin/main at 38842903, including the merged Studio entry work.

## Tasks and acceptance gates

1. Posts: render published reader blocks as safe initial HTML inside the current article canvas. Preserve legacy block formats and current interactive embeds, actions and restricted audiences. Test content, sanitization and no duplicated body.
2. Events: fetch a bounded anonymous first page on the server, filter public published records, hydrate the existing discovery controls without waiting on geolocation for initial content. Preserve filters, cards, RSVP and timezone behavior. Remove the redundant hidden heading.
3. Groups: render a bounded public first page in the existing directory. Keep private/unlisted groups out of initial data. Turn existing topic chips into same-style links and expose the public full description in the existing About region.
4. Discussions: make older public threads reachable through the existing control and server cursor, retain incremental loading, and traverse bounded public pages for the sitemap. Preserve thread URLs, replies, removed-content rules and the authenticated following feed.
5. Studio: retain the merged mobile entry and canonical/sitemap improvements; audit task copy and existing help for accurate feature descriptions. Add only a focused correction if a concrete gap remains; do not duplicate completed work.

## Verification

Watch meaningful regression tests fail before implementing their fixes. Run the relevant suites, type checking, lint and a production build with remote production APIs blocked and synthetic public fixtures. Inspect the existing pages at phone, tablet and desktop sizes using local data. Verify anonymous HTML and private-content exclusions. Review the final branch before commit and push.

## Progress

- Latest main fetched; isolated branch codex/five-feature-search-discovery created.
- Original mobile index fingerprint remains ABF1FE8411D653863BBC54639D0B4B45EE4819A316FA31DFBD7869F7F69A702D (18 staged files).
- Search Console checked after owner sign-in. The October 18 to November 14 browser window shows 58 clicks, 3.55K impressions, 1.6% CTR and average position 21.3. The earlier 56-click window overlaps heavily, so this is not a clean before/after result. November 15 connector data is still preliminary. Local evidence is saved outside the repository.
- No backend changes assumed: existing public list/detail/cursor APIs provide required data. Introduce backend changes only for a demonstrated missing contract.
- Implemented bounded anonymous events/groups directory snapshots in existing layouts. Verified initial HTML links, malformed timestamp handling, restricted-field removal, search/filter transitions and empty browser responses.
- Implemented older-discussion links and bounded sitemap cursor traversal. Article reader and public group activity are integrated; branch review, local browser checks and verification are complete.

## Verified behavior

- Public article blocks appear inside the existing canvas in the initial HTML. The editor and publishing flow are unchanged; registered rich blocks, sanitized inline content, historical lists, code and embeds have regression coverage.
- Public directories use bounded anonymous snapshots, then existing browser queries and controls. Private access links and membership fields are excluded from snapshots. Completed empty responses and active filters do not reuse the global snapshot.
- Public group posts and discussions render in the existing Posts tab. Anonymous previews remain separate from viewer-scoped query caches. About content and membership controls stay in place; topic chip styling is unchanged.
- Older discussions have real cursor links and progressive loading. Sitemap traversal is bounded and excludes explicitly restricted/removed discussions.
- Review found and fixed reaction reconciliation when signed-in group data replaces anonymous previews, including a failed toggle while new viewer data arrives. Initial dates, currency and member counts are deterministic; event dates and currency then adopt browser preferences.
- Full frontend suite: 190 files and 1,089 tests passed. Final targeted checks after review: 27 tests passed, including the new group-count and reaction-failure cases. Scoped lint has no errors; pre-existing image and geolocation-dependency warnings remain.
- Final isolated production build and its type check passed with synthetic local APIs. Production API access was blocked; official font downloads were permitted. Temporary build output and generated configuration changes were removed after verification.
- Local browser checks used synthetic data at phone (390 x 844), tablet (820 x 1180), and desktop (1440 x 1000) sizes. All five existing feature areas fit without page-level horizontal overflow. The Satoshi headline and article text were visible, with one page H1. Screenshots and detailed measurements are saved outside the repository.
- Original mobile staging verified unchanged: 18 files and the same fingerprint recorded above. No production data, backend contracts or protobuf files changed. No new landing pages were added.

## Growth measurement after owner deployment

Compare complete, non-overlapping periods using query/page clicks and impressions; keep preliminary Google data and owner self-tests annotated. The 100,000 monthly incoming-click goal includes search engines and AI referrals, but Search Console measures Google search only. Prioritize existing pages with measured demand, starting with the X tool and relevant Go/architecture content. Record each title, summary or linking experiment separately from technical deployment checks. Traffic growth remains to be measured after release; test passes do not represent acquired visitors.
