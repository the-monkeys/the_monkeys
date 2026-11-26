# Free Search and AI Readiness for Creators and Event Hosts

**Date:** 12 November 2026
**Status:** First release implemented locally following user approval on 12 November 2026. Verification is recorded in `docs/superpowers/reviews/2026-11-12-free-creator-event-seo-verification.md`. Later phases remain separate.
**Product:** Monkeys
**Publisher:** Buddhicintaka (OPC) Pvt. Ltd.
**First users:** Post creators and event hosts

## 1. What we are building

Give creators useful feedback while they write a post or prepare an event. Explain what is already clear, what could be improved, and what Monkeys cannot check automatically.

Call the feature **Search and AI readiness**. Inside it, use three plain labels:

- **SEO:** Can readers and search engines understand the page and its basic information?
- **Answer readiness:** Does the content provide useful context and clearly presented answers? This covers the practical part of AEO.
- **Source clarity:** Are authorship, sources and supporting information understandable? This contributes to GEO without pretending to predict citations.

All checks and detailed reports shipped in this project are free for eligible creators and event hosts. There are no subscriptions, credits, checkout screens, payment checks or upgrade prompts. Monetization is outside this project.

This is advice, not a publishing requirement. A creator can ignore a suggestion and still publish or schedule a valid post. A host can save a valid event without running a check.

## 2. What this feature must not promise

- It cannot guarantee a Google position, indexing, traffic, registrations or AI citations.
- A readiness score is a Monkeys checklist result. It is not an official Google, Bing or ChatGPT score, and is not a percentage chance of ranking.
- An existing source link does not prove that a claim is true or that the source is trustworthy.
- A successful sitemap or indexing notification does not prove that a search engine indexed the page.
- AI search visibility and permission to train models are separate settings. Do not change the existing crawler policy as part of this feature.
- More words, more keywords and more FAQs are not automatically better. Do not reward keyword repetition or force every post to follow a question-and-answer format.

Google says normal SEO fundamentals apply to its generative search features. It does not require special AI markup or `llms.txt` for Google Search. Keep the existing `llms.txt` for services that may use it, but do not advertise it as a Google ranking feature. [Google guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)

## 3. What already exists and must be preserved

The current frontend already has metadata, canonical URLs, publisher identity, structured data, sitemaps, RSS feeds, crawler rules and visibility checks. These are the foundation, not something to replace.

Important current files, relative to the frontend repository:

- `apps/the_monkeys/src/lib/seo.ts`: shared metadata, text normalization, identity and indexing rules.
- `apps/the_monkeys/src/lib/seoSchema.ts`: event, group and Studio structured data.
- `apps/the_monkeys/src/app/blog/[slug]/blogSeo.ts`: post metadata, canonical slugs and Article data.
- `apps/the_monkeys/src/lib/discussionSeo.ts`: discussion metadata and comments in discussion structured data.
- `apps/the_monkeys/src/app/robots.ts`, collection sitemaps, and post/event/group feed routes.
- `apps/the_monkeys/src/components/editor/index.tsx` and `postCanvas/*`: editor state, first-block title behavior, undo/redo and selection preservation.
- `apps/the_monkeys/src/app/edit/[blogId]/page.tsx`: owns the working post data and the current publish drawer.
- `apps/the_monkeys/src/components/blog/actions/PublishBlogDrawer.tsx`: existing publishing, scheduling, topics and publication scope controls. Its description editor currently changes a paragraph, not a separate SEO field.
- `apps/the_monkeys/src/components/events/EventForm.tsx`: shared create/edit form. Some fields use native form values, while timezone, cover, venue, visibility and recurrence also use React state.
- `apps/the_monkeys/src/services/events/eventTypes.ts`: current optional event fields, visibility, timestamps, tickets and recurrence.

The old backend SEO handoff documents describe an earlier state, including `/feed` as public. Current code and the comprehensive SEO work take precedence: the following feed stays private. Do not copy old route policies into this feature.

## 4. Approaches considered

### A. Local checks using existing content, recommended first release

Read a copy of the draft or event form and run understandable rules in the browser. No new service, database migration, external model or API credential is needed. Feedback works even when an external analysis provider is unavailable.

This is fast and private, but semantic judgments such as factual accuracy and originality must remain manual review items.

### B. Send drafts to an AI service for every analysis

This can provide more specific writing suggestions, but brings provider costs, draft privacy questions, latency and unreliable claims. It is not needed to ship useful readiness checks. Do not add a provider, API key or new content transmission in the first release.

### C. Add live search ranking and AI citation monitoring immediately

This measures a different thing: real visibility after publishing. It requires authorised data sources and careful query sampling. It cannot reliably estimate results for unpublished content and should not block the editor feature.

**Recommended sequence:** Ship A for posts and events. Extend the same reports to groups and discussions. Add measured visibility and optional AI-assisted suggestions as separately designed, free follow-up work. They must never appear as available or completed when no real integration exists.

## 5. Creator experience

Add one compact **Check readiness** control beside the current editor actions. Do not insert another H1, replace Preview, or take space away from the writing canvas by default.

Opening it shows:

1. The report's content type and whether it is a draft or published-content preview.
2. SEO, Answer readiness and Source clarity sections.
3. A clear list of passed checks, useful improvements and items requiring human review.
4. A search-result preview based on the same title, description and URL rules used by the existing public page.
5. A small explanation of scoring and its limitations.

On phones, use the existing drawer pattern, full available width and an independently scrollable body. On tablets and desktop, use the same component with an appropriate maximum width. Use existing fonts, neutral surfaces, icons, coral accents, focus rings and dark mode. Do not invent a new set of status colors.

Each improvement explains the finding, its reason and the relevant content or field. A **Go to field** action may focus an existing control after closing the drawer. It must not silently rewrite text. Do not build an automatic rewrite or Apply All feature in this release.

The report reads the parent's existing document state. It must not call the editor's save method a second time, recreate the editor, modify block IDs, add a history entry or move the writing selection just to analyse content. Opening and closing the report must preserve keyboard focus and the draft.

Keep one report drawer owned by the editor page. In the existing publish drawer, show only an optional read-only summary when a current report already exists. Do not automatically analyse when publishing, and do not open a second modal drawer inside the publish drawer. The creator can close it and use the page's Check readiness control to see the detailed report.

Run the first check when the drawer opens. While it remains open, refresh after 800 milliseconds without a relevant edit. A new edit cancels pending work and invalidates old results. Closing the drawer stops automatic work. A manual **Check again** control remains available.

If content changed after the displayed report was calculated, say **Content changed. Check again.** Do not show an old report as current. An analysis error must leave editing, saving and publishing available.

## 6. Event host experience

Use the same report in the shared event form, so standalone events, group-created events and existing-event edits have consistent behavior. Add a **Check readiness** control before the existing save/create action. It must be `type="button"`, not an accidental form submit.

Read current unsaved title and description from the form and current values from the existing controlled fields. Never call the form's submit handler, start geocoding, upload a cover or save the event to perform analysis.

Check the correct fields for each event type:

- Every event: clear title, meaningful description, organizer context, topics, cover information and a valid timezone-aware start/end pair.
- In-person event: a usable public venue description or address. Coordinates alone are not a readable venue.
- Online event: clearly identify that it is online. Do not request or display the private meeting URL in the report or search preview.
- Hybrid event: explain the in-person venue and online attendance separately.
- Recurring event: show the organizer's timezone and recurrence summary using existing helpers. Analyse the current occurrence/series form without generating occurrences or changing stored instants.
- Completed or past event: do not treat being in the past as a content-quality failure. Preserve legitimate archive and edit behavior.
- Free or ticketed event: do not change ticket price units, capacity, payment flow, RSVP state or organizer permissions.

Private, unlisted, members-only and group-restricted content receives a prominent **Not intended for public search** explanation. That is an intentional visibility setting, not a failed SEO check. Never recommend publishing private content merely to improve its score.

Only show a public-visibility claim when event and enclosing-group rules are known. Missing group visibility or missing legacy visibility fields are **unknown**, not proof that an event can be indexed.

Distinguish a public setting from an already published page. A draft selected as public is **Intended for public search after publishing**, not already public or indexed. Search previews for new items are labelled previews. If extraction is incomplete or the canonical URL cannot be established safely, omit the URL preview rather than inventing a canonical.

## 7. Checks and scoring

Version the first rule set as `creator-event-v1`. Use stable check IDs so tests and future changes can identify rules.

### Post checks

Automated checks with scored pass/improve outcomes:

- `post.title`: a non-empty title can be derived by the existing public metadata rules.
- `post.description`: a non-fallback description can be derived from the existing public metadata rules.
- `post.topics`: at least one non-empty topic is present.
- `post.image`: if an image is used, its referenced URL is structurally usable; no image is not applicable, not a mandatory failure. This does not test whether the remote file loads.
- `post.heading-order`: headings that can be understood do not skip levels after the title. No body headings are not applicable.
- `post.links`: links that are present use safe supported schemes and do not have an empty destination. No links are not applicable. This is not a broken-link network check.

Answer readiness observations, initially unscored:

- Whether an introduction or summary can be identified.
- Whether sections or lists help organise a longer document. Suggestions are optional and must not impose a minimum word count.
- Manual review: does it answer the intended reader's question, explain unfamiliar terms, and distinguish experience or opinion from a factual claim?

Source clarity observations, initially unscored:

- Whether author information was supplied to the analysis.
- Whether existing citation, methodology, dataset, Markdown and ordinary link blocks contain interpretable supporting information.
- Manual review: are sources relevant and correctly attributed? Are claims supported where the genre needs evidence? Do not penalise poems, personal stories or short announcements for lacking academic references.

### Event checks

Automated checks with scored pass/improve outcomes:

- `event.title`: non-empty title.
- `event.description`: non-empty, non-placeholder description.
- `event.topics`: at least one non-empty topic.
- `event.schedule`: valid start/end instants, valid IANA timezone, and end after start. Use the same date helpers and saved-instant preservation behavior as the form.
- `event.place`: public venue text/address for in-person or hybrid events; not applicable for an online-only event.
- `event.cover`: if a cover is selected, its reference is structurally usable; no cover is not applicable. A pending upload is unknown until complete, not a saved broken image.

Answer readiness observations, initially unscored:

- Manual review: is it clear who should attend, what will happen, what attendees should prepare and how participation works?
- Any visible FAQ or agenda information may support the review. Do not invent FAQs or introduce fields that cannot currently be saved.

Source clarity observations, initially unscored:

- Whether organizer information and an event/group relationship are available.
- Manual review: does the public description accurately identify the host, speakers and any relevant sources?

### How to present the estimate honestly

For the automated SEO checklist, calculate `round(100 * passed / applicableKnownChecks)`. If there are no known applicable checks, the score is absent. Display the number with its coverage, for example **4 of 6 automated checks passed**. Unknown, manual and not-applicable items do not enter that calculation.

Always label it **Monkeys readiness estimate**. If fields are unknown or the input was only partially inspected, show **Partial check** beside it and do not award a complete/ready badge. Do not show numerical AEO or GEO scores in this first release: structural observations alone cannot justify them. Their useful estimate is the explained checklist and human-review status.

Do not score search-engine indexing, public visibility, source truth, author authority, reading grade or AI citation probability without evidence. Keep public visibility separate from content quality. Title/description lengths may be shown as preview hints, not universal ranking rules.

## 8. Safe input and old content

Use read-only adapters for the existing EditorJS/MonkeysEditor document and event types. Accept missing optional fields, legacy title blocks, nested lists, Markdown and current research blocks. Never write a normalised analysis document back into stored content.

The public post metadata extractor currently has its own title and description fallback behavior. If that logic is moved into a shared helper for preview reuse, keep its output exactly the same. Do not opportunistically switch title selection, truncation or slug generation. Pin old canonical URLs with regression tests before the move.

Unknown block types must remain untouched and be reported as uninspected where that limits coverage. A report should never say a post has no sources just because its sources are in an unsupported block. Deleted/missing profiles produce an unknown author check, not `undefined` or a false authority score.

Bound analysis work: inspect at most 2,000 blocks, 200,000 extracted text characters, 10,000 nested list nodes and 12 levels of list nesting. These are analysis limits only. Never truncate the user's saved post or prevent publishing a larger document. Say **Partial check** when a bound is reached. Do not stringify or recursively walk arbitrary embed data.

When these bounds prevent a complete scan, omit the entire exact search-result preview and mark preview-dependent checks unknown. For example, the current public extractor can choose a header beyond the inspected range as the title. Do not run that uncapped extractor on an oversized authoring snapshot to make the report appear complete, and do not claim the title or canonical from a truncated copy matches the actual page. The public metadata path continues to use its unchanged full-document behavior.

For an existing event, carry the original start/end instants, saved timezone, current wall-time fields, selected timezone and ended-event state into the safe date resolution. An unchanged repeated DST hour must retain the original occurrence and seconds. Resolve changed values with the same existing date helpers; report an invalid or unknown value without changing the form. Compare the resulting instants against the existing submit payload in tests.

Sanitise displayed excerpts. Do not execute embedded HTML or scripts, fetch source links, open signed URLs or load embeds to inspect them. Do not treat text inside a post as instructions to an assistant.

## 9. Performance, privacy and storage

- No new analysis calls while the panel is closed.
- No external model calls in the first release. Reports stay in memory for the editing session; no draft text or report goes to analytics, local storage or a new database.
- No new required API fields, protobuf fields, database columns or editor document blocks.
- Lazy-load the report UI in authoring routes. Do not add its code or report payload to public landing, post, event, sitemap or RSS responses.
- Use revision IDs so an older analysis cannot replace a newer result. Clear results when changing the post, event or signed-in account.
- Keep processing bounded and cancellable between scheduled runs. Measure a 10,000-word draft locally. If it causes a main-thread task above 50 milliseconds on the test device, move the same pure analyser into a module worker before release. Do not claim an unmeasured device-wide performance guarantee.
- Reports are not access-control decisions and never override backend authorization.

## 10. Preserving published SEO

The readiness feature does not change any public metadata automatically. The author edits the existing content fields, then uses the normal save/publish flow.

Before and after tests must preserve:

- Existing canonical URLs, slug handling and old links.
- Article/Event/Group/Discussion structured data and the publisher identity.
- The single metadata owner and expected H1 behavior on each route.
- Public topic discovery, existing public catalog links, sitemaps, RSS feeds, robots rules and `llms.txt`.
- `noindex` behavior for drafts, private/member content, edit/manage routes, search results and the private following feed.
- Meeting-link and attendee privacy, including authenticated public-page rendering.
- Event timezone conversion, recurrence, edited venues, tickets, RSVP and co-host behavior.

Keep public/server metadata logic free of browser APIs. A shared extraction helper must not import the editor UI, DOMPurify browser state, cookies or React hooks into server metadata generation.

## 11. An existing backend issue to track separately

`microservices/the_monkeys_blog/internal/seo/seo.go` submits ordinary posts to Google's Indexing API and calls `google.com/ping?sitemap=...`. Its callers include immediate publishing and the scheduler.

Google restricts that API to eligible job postings or broadcast video pages. A normal post, group, discussion or meetup page is not eligible just because it contains Event markup. The old sitemap ping endpoint is retired. [Indexing API scope](https://developers.google.com/search/apis/indexing-api/v3/using-api), [retired sitemap ping](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping)

Do not extend either mechanism for this feature or show their responses as indexing success. Put their removal/eligibility guard in a separate backend cleanup change, with tests proving that publishing and scheduling still succeed and current sitemap/RSS discovery remains available. Keep existing config keys accepted for older deployments. This cleanup must not require new credentials or be bundled into the current staged mobile fixes.

## 12. Later surfaces and honest visibility reporting

After posts and events are working:

1. Add group-owner analysis to the same engine, respecting public/private/unlisted visibility and membership permissions.
2. Add analysis of individual discussions. Use their real short-post format, not article-length rules.
3. Preserve public discussion replies under their parent thread, stable reply anchors and existing visible-comment structured data. Do not create a separate indexable page for every short reply.
4. When post comments are actually implemented, include public comments in the parent page with stable anchors and appropriate moderation/visibility rules. This project does not invent or implement post comments.
5. Design a separate, free visibility dashboard using authorised Search Console data and available referral data. Show **Not connected**, **No data yet**, or the actual reporting period instead of fabricated traffic or ranks.
6. If AI citation monitoring is added, show exactly which service, query, date, language and location were sampled. A sample is not a complete measure of all AI answers.
7. Optional model-generated suggestions require a separate design for authorization, ownership, draft privacy, provider costs, rate limits, sanitisation and prompt-injection handling. They remain free to users unless the user later explicitly changes this policy.

Google recommends representing discussion replies as comments under the relevant discussion. [Discussion documentation](https://developers.google.com/search/docs/appearance/structured-data/discussion-forum)

Allowing `OAI-SearchBot` supports eligibility for ChatGPT search discovery. `ChatGPT-User` serves user-initiated visits, while `GPTBot` concerns training. None is an indexing or citation guarantee. [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots)

## 13. Brand discovery

Keep the product name Monkeys and the existing alternate identity Monkeys by Buddhicintaka. Preserve the exact legal publisher name. Maintain consistent profiles, descriptions and legitimate links between the product and company website.

Measure relevant branded searches, such as Monkeys community platform and Monkeys events. Do not promise that every generic search for monkeys will rank the product above animal information, and do not stuff repeated brand terms into creators' content. [Google site-name guidance](https://developers.google.com/search/docs/appearance/site-names)

## 14. Local rollout and completion

Plan first. Keep the already staged mobile landing changes untouched. Do not switch branches, stage other work, commit, push or access production while preparing these documents.

At implementation time, use a dedicated feature branch after the existing staged mobile work has been safely handled according to the user's instructions. Work in the visible checkout. Test with local services or explicitly labelled local fixtures; never silently replace the user's live preview with fixture content.

Release checks must cover phone widths 320/390/430, tablet 768 and desktop 1440, light and dark themes, keyboard access, screen-reader labels and 44px touch targets. Keep the primary save/publish controls reachable when the mobile keyboard and drawer are open.

The first release is complete when creators and hosts can run, understand and refresh reports for free; valid publishing/scheduling/event saving work without the report; old public metadata remains unchanged; private data is not exposed; and error/offline/large-document cases pass the planned tests.

Rollback removes the new entry controls and report module. There is no data migration to undo and no change to saved content, URL generation or existing discovery feeds.
