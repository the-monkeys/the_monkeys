# Reference-led landing page design

## Goal

Restructure the Monkeys landing page into a professional editorial and community dashboard inspired by the supplied reference. The result must make posts, events, people, and groups visible without copying the reference literally or introducing unsupported product behavior.

The page must be designed mobile first, remain readable at every viewport size, use the existing Monkeys visual language, and rely only on data and routes already available in the frontend.

## Design principles

- Preserve the compact `Posts, events and communities` H1 for page meaning and SEO.
- Establish clear editorial hierarchy through typography, spacing, image scale, and placement rather than heavy decoration.
- Use brand orange selectively for active states, labels, links, focus treatments, and primary actions.
- Prefer dense but calm information design. Every visible module must help users discover a post, event, person, topic, or group.
- Do not use em dashes in platform-written landing-page or SEO copy.
- Do not fabricate live status, attendance counts, engagement metrics, trending percentages, or other data.

## Information architecture

The landing page will use the following order:

1. Compact page heading.
2. Community hosts strip.
3. Opening feature area with one lead post and one featured upcoming event.
4. Compact content discovery navigation.
5. Main editorial feed and contextual event cards.
6. Desktop discovery rail containing upcoming events, trending posts, people, and groups.
7. Remaining community posts.

The existing global AppShell remains responsible for primary navigation. The landing page will not add a second permanent left sidebar.

## Opening area

### Community hosts strip

The existing active-user and featured-author data will power a horizontally scrollable host strip. It will be labelled as community hosts rather than implying that every person is currently live. Each person remains a profile link.

On mobile, the strip uses touch scrolling and partially reveals the next item to signal overflow. On desktop, it stays on one compact row with optional scroll controls only when needed.

### Lead post

The lead post remains the strongest visual item. Its image, topic, title, summary, and post link form one coherent editorial card. The whole visual and title area must provide clear navigation without nesting conflicting links.

### Featured event

The first valid upcoming event becomes the featured event. It sits below the lead post on mobile and beside it on large desktop screens. It uses only fields returned by the current event API, including image, title, date, location or online state, host, and attendance when available.

The event card links to the event details page. Existing RSVP behavior may be surfaced only when the current event components already support it safely.

## Discovery navigation

The current large capability cards will become a compact filter-style navigation row for Posts, Events, and Groups. On mobile, the row scrolls horizontally. On tablet and desktop, it remains a single unobtrusive line.

This navigation is secondary to the opening content and must not consume the height of a promotional hero.

## Main content and discovery rail

### Editorial feed

Posts use three reusable presentations:

- Lead story for the opening feature.
- Horizontal story card for important posts.
- Compact story row for supporting and community posts.

One compact event card may appear between post groups to keep events integrated with the content experience. It must not interrupt the feed on very small screens with excessive spacing.

### Desktop discovery rail

At large desktop widths, the page becomes a main column and a narrower discovery rail. The rail contains:

- A compact upcoming-events list with dates and direct links.
- A numbered trending-post list based on the selected landing post order, with no invented trend measurements.
- A compact people-worth-following module using existing profile data.
- A groups discovery card that links to the groups page.

The rail may use sticky positioning only when its measured height fits comfortably inside the viewport. Otherwise it remains in normal document flow.

No newsletter form will be added because there is no confirmed functional subscription destination.

## Responsive behavior

### Mobile, below 640px

- One content column.
- Hosts and compact navigation scroll horizontally.
- Lead post appears first, followed immediately by the featured event.
- Upcoming events use concise stacked rows or a horizontal snap list.
- The desktop discovery rail is decomposed into full-width sections and placed between logical feed groups.
- Interactive targets are at least 44 pixels high where applicable.
- Images use stable aspect ratios to avoid layout shift.

### Tablet, 640px to 1023px

- No narrow permanent discovery rail.
- Supporting post and event cards may use two-column grids.
- Feature content remains stacked until sufficient width is available.
- Text measure and card width stay constrained for readability.

### Desktop, 1024px and above

- Opening feature area uses approximately a two-thirds lead post and one-third featured event split.
- Main content uses approximately a 68 percent editorial column and 32 percent discovery rail.
- Shared gutters and card edges align across the opening area, feed, and rail.
- Overall width remains constrained to prevent an overly stretched layout.

## Data flow

The existing landing data sources remain authoritative:

- `useGetMetaFeedBlogs` and its server-prefetched query provide posts.
- `useEventList` and its server-prefetched query provide upcoming events.
- Existing active-user hooks provide people.
- Existing group routes provide group discovery navigation.

Landing selection helpers may be extended to derive lead, supporting, latest, community, and trending post slots without duplicating a post in multiple prominent positions. No backend API changes are required.

## Loading, empty, and error states

- Post and event loading states must preserve the final layout dimensions.
- If posts fail, event and community discovery remain available.
- If events fail or are empty, the featured event area becomes a compact link to browse events rather than an empty decorative card.
- Missing images use the existing post or event placeholder behavior.
- Missing optional metadata is omitted cleanly without blank labels or separators.

## Accessibility and interaction

- Maintain one H1 and a logical heading hierarchy.
- Use semantic sections, articles, navigation landmarks, and descriptive accessible names.
- Every image, title, person, event, and group link must navigate to the corresponding existing route.
- Preserve visible keyboard focus using the brand focus treatment.
- Horizontal scrollers must work by touch, trackpad, keyboard, and optional labelled controls.
- Content order in the DOM must match the mobile reading order.

## SEO

- Keep the current landing metadata focused on posts, events, and communities.
- Preserve server-side prefetching and JSON-LD output.
- Keep meaningful content in semantic HTML rather than decorative images.
- Do not add hidden keyword blocks or duplicate promotional copy.
- Do not use em dashes in landing metadata or platform-written landing copy.

## Testing and verification

Implementation will include focused tests for:

- Post selection and deduplication.
- Featured-event selection and empty behavior.
- Mobile-first DOM order.
- Compact discovery navigation.
- Correct links for posts, events, people, and groups.
- Loading and error states.
- Metadata and em-dash restrictions.

Verification will include focused unit tests, linting, a production build, and visual checks at representative mobile, tablet, and desktop viewport widths against the running local application.

## Out of scope

- Backend or API changes.
- A new permanent application sidebar.
- Breaking-news or live-presence systems.
- Fabricated metrics or editorial rankings.
- Newsletter subscription infrastructure.
- Changes to notification behavior or unrelated staged work.
