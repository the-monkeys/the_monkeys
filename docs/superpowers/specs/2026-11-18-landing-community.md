# Landing community previews

Approved by the user from the generated desktop/mobile concept on 18 November 2026.

- Add Top discussions (up to three) and Discover groups (up to two) beneath the lead story, before the existing article feed. Preserve the existing hero, event placement, navigation, article filters and discovery rail.
- Reuse the current discussion identity, real verification badge, avatar, ellipsis menu and stats. Compact discussion text without changing full discussion cards or threads. Link to existing discussion URLs and `/discussions`.
- Show real public, published groups with their name, description, logo/fallback, Public group label and links to existing group URLs and `/groups`. No invented names, counts or membership actions.
- Use existing fonts, coral accent, neutral borders, dark mode and focus styles. Group cards stack on small screens, become two columns when space permits, and never overflow.
- Read anonymously from existing public APIs with no cookies, no stored responses and bounded timeouts. Rank the recent discussion page by likes plus replies, then recency; this is not a global all-time ranking. Accept missing audience on older site discussions, exclude all non-public/hidden/deleted/members-only content and malformed records. Only explicit public audience is accepted for group discussions.
- Server prefetch and client refresh share public-only keys, isolated from personalized feeds. Failed or empty sections retain their browse links without preventing articles/events/other community content from loading.
- Frontend only; preserve API contracts, data, existing URLs and old component defaults. Keep production, original staged mobile fixes, backend files and other projects untouched. Commit/push this branch; no PR.
