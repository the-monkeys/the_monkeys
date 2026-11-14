# Studio search entry experience

Date: 14 November 2026

## Purpose and evidence

Help a visitor searching for an X screenshot generator reach the working tool immediately. Existing query evidence identifies this tool as a discovery opportunity, not an estimate of total demand or proof of a future ranking gain.

The current mobile layout renders the preview before the URL input. The page has a hidden heading and no task instructions beside the working tool. The experiment makes the first action easier to find and explains what the existing tool actually does.

## Approach

Improve the existing `/snapshot/new?view=x` page rather than create overlapping keyword pages. Keep `/snapshot/new`, its default template view, saved tab preference, query parameters, exports, author lookup and authentication behavior. Put one URL input before the preview in document order; on desktop it remains in the right control column. Add a short visible heading and useful instructions below the tool. Copy follows the active tab.

Include the existing X tool's self-canonical URL in the main sitemap. Use natural, relevant terminology such as X screenshot, Twitter post, tweet link and PNG image where it accurately describes the tool. Describe its actual square, portrait and landscape formats. No dictionary keyword lists, unrelated keywords, invented capabilities or new keyword pages are part of the change.

Alternatives considered: creating a second X screenshot URL would duplicate an already discoverable tool; building unrelated calculators would not use Monkeys' current strengths. Both are outside this first experiment.

## Constraints

- Keep existing routes, API contracts, public access, exports and saved preferences backward compatible.
- Keep the existing design tokens, Next.js 14 and Tailwind 3. No dependency upgrade.
- Use a compact mobile-first layout, with no new large hero or forced signup.
- Preserve the original checkout's 18 staged mobile files byte for byte.
- Keep all implementation and testing local. Do not publish, deploy, contact people, buy services or alter production.
- No em dashes in controlled visible copy or SEO copy.
- Do not claim guaranteed rankings, traffic or support for private/deleted X posts.

## Measurement

After a separately approved deployment, compare Google clicks and impressions for the existing Studio URLs over equal complete 28-day windows, by query and device. Track tool success separately if suitable existing measurement is available; this change adds no tracking. The business target is 100,000 genuine incoming clicks per month across acquisition channels, including Google, Bing/MSN, DuckDuckGo and other relevant sources. The saved Google baseline is one measured channel, not total platform acquisition. Keep click totals, visits and sessions separate and avoid counting the same reporting stream twice. This is one experiment within a wider content and distribution program, not a claim that one layout change reaches that target.
