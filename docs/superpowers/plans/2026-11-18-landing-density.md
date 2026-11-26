# Landing density correction

**Goal:** Match the approved compact concept and expose more genuine content without tiny type, new colors, duplicated widgets or filler.

**User refinement:** Keep the existing fonts and readable control sizes; reduce oversized imagery, padding and unused column space instead.

**Layout:** A horizontal lead story and featured event share the first desktop row. Below them, the post column stacks discussions, filters and articles independently of the right column's public groups and discovery widgets. On phones the lead uses a full-width landscape image above its full-width headline and summary. The same single instances visually flow as lead story, discussions, groups, featured event, articles and discovery. Full article headlines remain readable; only discussion/description previews are shortened. Existing public readers, routes, filters, timezone conversion, identity, verification and actions stay unchanged.

- [x] Add failing tests for independent community slots, one featured event, mobile reading order, existing links/actions and compact-only whitespace handling.
- [x] Split community presentation into reusable discussion/group sections while retaining the existing combined component contract.
- [x] Replace the full-width poster lead with a thumbnail/text layout; retain the complete H1, byline and actions. Compact the event spacing without removing its date/timezone, place, host or destination link.
- [x] Pair desktop grid rows and move groups into the right column; retain a logical single-instance mobile DOM order.
- [x] Run relevant regressions, TypeScript and lint; verify actual first-viewport geometry and scrolling at desktop, tablet and phone widths in both themes. Do not claim every viewport fits all content; record actual geometry with the restored long titles.
- [x] Review and preserve the separate staged mobile baseline.
- Delivery: commit/push the current feature branch. No PR, backend changes, dependencies or production access.

## Regression focus

- Long multilingual headlines must wrap without cropping or unreadably small text.
- Missing/failed post, event, discussion or group data must leave the other sections working.
- Do not create duplicate mobile/desktop event or group cards or hidden focusable inline links.
- Keep the 320px header fix, article-filter/feed adjacency, public-only readers and existing Studio/menu actions.

## Local browser evidence

- Actual restored public content, including the full 78-character privacy headline and multilingual discussion text; no generated mock screenshots.
- Widths 320, 390, 820, 1024, 1280, 1440 and the user's normal 1945px viewport checked. Light and dark themes inspected. No horizontal overflow at the measured widths.
- The initial square thumbnail was replaced after smoke-test feedback; see the latest refinement below. Two desktop columns start at 1280px so the sidebar does not squeeze the lead title at 1024px.
- Gap between the lead card and discussions is 16px at all measured widths. At 1440x900 the lead, event, discussions and both groups fit on the first screen; shorter/narrower screens scroll normally.
- Mobile discussion menu fits within the viewport. Actual discussion and public group detail navigation opens successfully.
- Group logos use containment and the existing fallback during loading/errors. The local proxy and backend both return 404 for the sampled RRWA logo and Dave photo; their fallback is appropriate. Tests cover successful logo loading and available host photo sources, without substituting images or altering local records.
- Independent review's encoded-headline accessible-name issue was fixed by referencing the rendered H1; final review found no further actionable issues.
- The separate mobile checkout still has exactly 18 staged files and its original staged-diff SHA-256 is unchanged.
- Final 47 regression tests across nine suites passed. TypeScript and scoped lint passed, as did the isolated Next production build with application traffic restricted to a local fixture. Its temporary output/config edits were removed after verification.

## Smoke-test refinement

- User requested only the latest two public discussions and a larger mobile lead image. Selection now sorts the bounded public API page by creation time, takes two and leaves privacy, visibility, legacy timestamps and count normalization intact. Presentation also caps previously hydrated arrays at two. The full discussion page and its API remain unchanged.
- Phones use a full-width 16:9 lead image followed by the label, full headline and summary, preserving the existing fonts, colors, byline, links and actions. From 640px the image sits beside the text; on wide desktops it grows proportionally and fills the content height. Only the normal 12px footer gutter remains below the image.
- Actual local browser checks at 320, 390, 430, 640, 820 and 1440px confirmed loaded images, complete wrapping headlines, exactly two discussion previews and no horizontal overflow. At 390px the image is 317x179px instead of 80x80px. The normal browser viewport was restored afterwards.
- Fresh verification: 33 tests across six suites passed, including public-only filtering, legacy records, anonymous transport, server-rendered links, latest-two ordering, component cap and existing lead actions. Both new behavior assertions failed before their fix. TypeScript and scoped lint passed. The earlier full build belongs to the initial density correction; this refinement was checked through the local dev compilation and focused regressions.

## Desktop column flow correction

- After reducing the preview list to two discussions, the taller group cards held the next shared desktop row down, leaving a measured 105px gap before the article filters.
- Independent body stacks now keep discussion/filter/article content together in the post region and group/discovery content in the complementary region. The existing first-row lead/event alignment is retained. No duplicated sections, viewport JavaScript or measured negative margins are used.
- Below 1280px the body wrappers use `display: contents`; responsive ordering retains the exact visible mobile sequence. At 390px every measured section's position and height matched the previous layout. Source order follows the two semantic regions; visual mobile positioning remains unchanged.
- At 1280, 1440 and 1944px both the discussion-to-filter and group-to-discovery gaps measure 16px. No horizontal overflow was found at 320, 820 or these desktop widths. The lead summary remains exactly two lines instead of stretching within its grid row.
- The column containment regression failed before the fix. Nineteen focused component, integration and server-rendering tests passed after the correction; TypeScript and scoped source lint passed. Routes, public selection, auth, security and backend code were not changed.
