# Premium Editorial Landing Page Design

## Purpose

Redesign the Monkeys landing page so it feels like a credible, mature editorial community rather than a long sequence of unrelated content cards. The page must make the product understandable within the first viewport, highlight the strongest writing, introduce upcoming events as a first-class discovery surface, and remain comfortable to use on phones, tablets, laptops, and wide desktop screens.

## Scope

This change is limited to the public landing page and its presentation components. It will:

- Recompose the existing meta-feed into a stronger editorial hierarchy.
- Add a public upcoming-events section using the existing events API and React Query infrastructure.
- Improve loading, empty, and partial-error behavior so one failed data source does not remove the other content.
- Preserve the existing application shell, navigation, sidebars, footer, authentication behavior, backend contracts, and event-detail pages.

It will not add or modify backend endpoints, event-management behavior, notification behavior, global navigation, the right rail, or the events discovery page.

## Chosen Direction

Use a premium editorial-community direction. The visual language is restrained and content-led: warm near-white surfaces, strong charcoal typography, Newsreader for prominent editorial headlines, Inter or DM Sans for supporting information, thin neutral rules, modest corner radii, and brand orange used only for active labels, key actions, and small highlights.

This direction is preferred over a social-network feed because it gives stories enough visual authority and avoids a noisy collection of equally weighted cards. It is preferred over a corporate marketing hero because Monkeys already has real editorial and event content that should demonstrate the product instead of relying on generic promotional copy.

## Information Architecture

The landing content renders in this order:

1. **Editorial introduction** — a compact eyebrow, visible H1, one-sentence value proposition, and two links: explore stories and explore events. On authenticated sessions the copy remains useful; it does not become a sign-up wall.
2. **Lead story composition** — one dominant featured story beside two compact supporting stories when the viewport permits. The lead image, topic, headline, excerpt, and story actions remain navigable through existing blog routes.
3. **Featured voices** — retain the current author discovery strip, but place it after the lead composition so the first viewport establishes the editorial proposition first.
4. **Upcoming events** — show up to three published upcoming events sorted soonest, with a section introduction and a “View all events” link. Reuse `EventGridCard` so date, place, price, organizer, and attendee details remain consistent with the events product.
5. **Latest thinking** — render the next four to six stories as a readable list with one stronger feature slot and supporting list rows. Avoid repeating stories already used in the lead composition.
6. **Community discovery** — keep a short final set of recent stories. The existing right rail continues to provide trending topics and newsletter discovery on wide screens.

The landing page must not render dozens of visually identical feed rows. When more stories are available, the page ends with a clear route into the broader feed instead of exhausting the full 30-item response.

## Responsive Behavior

### Mobile: below 640px

- Stack the editorial introduction, lead story, supporting stories, voices, events, and latest writing in one column.
- Keep primary headings between 36px and 44px with compact line height so the first viewport is not consumed by typography.
- Render event cards in a horizontally scrollable snap row with approximately 88% card width, showing the edge of the next card as a discovery cue.
- Keep all interactive targets at least 44px high or wide where practical.
- Use 16px page gutters and prevent decorative elements from creating horizontal overflow.

### Tablet: 640px to 1023px

- Use a two-column lead composition where space permits; otherwise preserve a clear stacked hierarchy.
- Show two event cards per row.
- Keep supporting story summaries short and avoid dense metadata wrapping.

### Desktop: 1024px and above

- Use a twelve-column editorial grid within the existing main-content width.
- Give the lead story approximately two-thirds of the content width and supporting stories one-third.
- Show three event cards in one row.
- Preserve the existing left navigation and right rail rather than widening content underneath them.

### Wide desktop

- Cap readable text and image widths. Additional viewport width becomes breathing room, not stretched lines or oversized cards.

## Components and Responsibilities

### `LandingPageClient`

Owns composition only. It selects non-overlapping blog slices, coordinates independent blog and event states, and renders sections in the specified order. It must not contain event formatting logic or large inline card implementations.

### `LandingIntro`

A new presentational component responsible for the visible H1, product description, and links to stories and events. It accepts no remote data and remains server-renderable in structure even though its parent is currently a client component.

### `LandingStoryGrid`

A focused composition component that receives a lead blog and up to two supporting blogs. It reuses existing editorial cards where their hierarchy fits and introduces only the minimal wrapper/layout needed to form the desktop grid and mobile stack.

### `LandingEventsSection`

A new component that receives the result of `useEventList`. It renders the section header, `EventGridCard` items, a lightweight loading skeleton, a compact empty state, and a non-blocking error state. Event failure never replaces the blog landing page.

### Existing components

Reuse `EditorialHero`, `HorizontalFeatureCard`, `FeedListItem`, `MinimalBlogCard`, `FeaturedAuthorsStrip`, `SectionLabel`, and `EventGridCard` where they support the chosen hierarchy. Targeted style adjustments are allowed, but unrelated refactoring is excluded.

## Data Flow

The server landing page continues to prefetch the v2 meta-feed. It additionally prefetches the existing public event list using these filters:

```ts
{
  limit: 3,
  status: 'published',
  date: 'upcoming',
  sort: 'soonest',
}
```

The event query uses the existing `queryKeys.events.list(filters)` key and `listEvents(filters)` function. `LandingPageClient` calls `useEventList` with the exact same stable filter object values so React Query consumes the dehydrated result instead of issuing an avoidable duplicate request.

No new endpoint, response transformation, or authentication requirement is introduced. Event links continue to use `/events/:slug`; blog links continue to use the existing generated blog route.

## Loading, Empty, and Error States

- Blog loading may use the existing feed skeleton or a landing-specific skeleton if the existing one no longer matches the composition.
- If blogs fail or return no usable stories, show the existing friendly feed error treatment and still render upcoming events when available.
- If events are loading, reserve card dimensions to prevent layout shift.
- If events return an empty list, show a restrained message with a link to browse events; do not display a large error illustration.
- If events fail, omit the cards and show a one-line retry/browse message. Blog content remains fully usable.
- Missing blog images continue through the existing placeholder image behavior.

## Accessibility

- Render exactly one visible H1 on the landing page.
- Use H2 headings for major sections and H3 headings for card titles.
- Preserve descriptive link names; do not make multiple nested links compete for the same card surface.
- Maintain visible keyboard focus states and logical DOM/tab order matching the visual order.
- Decorative event and story images use empty alt text only when the adjacent link already provides the same title; meaningful standalone images use descriptive alt text.
- Horizontal mobile event scrolling remains operable through touch, trackpad, and keyboard-visible links without requiring drag gestures.

## SEO and Performance

- Keep the existing root metadata and organization schema unchanged in this phase.
- Ensure the visible H1 and introductory copy explain that Monkeys is a research and long-form writing community with events.
- Keep story and event destinations as crawlable Next.js links.
- Server-prefetch the upcoming-event data so event titles and links are present in the initial hydrated render when the API is available.
- Reuse existing image loading behavior and reserve media aspect ratios to reduce cumulative layout shift.
- Do not add a new carousel library, animation library, or analytics dependency.

## Testing and Verification

Automated tests will cover:

- Blog slot selection does not duplicate the lead or supporting stories.
- The event query uses the exact published/upcoming/soonest filters with a limit of three.
- The events section renders event links and the “View all events” route.
- Empty and error event states do not suppress blog sections.
- The landing page exposes one visible H1 and semantic section headings.

Verification will include focused tests and lint, a production build, and browser inspection at representative widths of 390px, 768px, 1024px, and 1440px. Checks include horizontal overflow, focus visibility, readable text wrapping, stable card heights, working story/event links, and light/dark theme contrast.

## Acceptance Criteria

- The first viewport clearly states what Monkeys offers and presents one dominant story.
- Up to three real upcoming published events appear on the landing page without API changes.
- The layout is intentionally composed at mobile, tablet, and desktop widths.
- A failed events request cannot make the editorial feed disappear.
- No blog or event is displayed twice within the page composition.
- Existing navigation, right rail, footer, authentication, blog routes, and event routes continue to work.
- Focused tests, lint, and the production build pass before the landing-page changes are staged.
