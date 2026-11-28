# Notification details and mobile Events implementation plan

> **For agentic workers:** Use superpowers:executing-plans and test-driven-development. Work in the user's current checkout, not a separate worktree.

**Goal:** Read a complete notification in an accessible dialog and reach events from the mobile bottom navigation.

**Architecture:** Reuse the complete FRN payload already returned by the list API. Keep profile and resource links independent from a row-level detail trigger. The bell dropdown owns its selected notification outside the dropdown portal so closing the dropdown cannot unmount the dialog. The notifications page reuses the same detail component. Replace only the Explore bottom tab, not topic discovery elsewhere.

**Tech Stack:** Existing Next.js/React, Radix Dialog, TanStack Query and Vitest.

**Spec:** User approved the dialog approach and Events replacement in this chat on 25 October 2026, with existing design, mobile-first responsiveness and local-only implementation on codex/event-timezone-release.

## Global constraints

- Stay on codex/event-timezone-release. Initially local-only; user subsequently authorized staging, committing and pushing relevant files after verification. Do not create or merge a PR, access production or change backend code.
- Reuse existing typography, surfaces, brand accents and dialog/button primitives. No new dependencies.
- Do not alter authentication, notification read semantics, SSE delivery or SEO policy.
- Preserve independent avatar, username and post/event/group links. Never render notification content as HTML or expose raw content.data/debug fields.
- Preserve unrelated dirty files and the original signed-in local browser session.

## Review focus

1. Dropdown unmount/focus changes must not immediately close the detail dialog.
2. Long messages, multiline text and long unbroken words must fit mobile and scroll vertically.
3. Existing actor/resource links must navigate without opening the dialog.
4. Missing content or invalid dates must not crash; template placeholders must resolve and text remain escaped.
5. Events must work while logged out and be active on event-detail routes, with unrelated bottom tabs unchanged.

## Task 1: Shared notification details

Files: NotificationRow.tsx, WSNotificationDropdown.tsx, new NotificationDetailDialog.tsx and focused tests alongside existing navbar tests. NotificationCard already reuses NotificationRow.

Interfaces: Optional NotificationRow.onOpenDetails(notification: FRNNotification): void lets the dropdown own selection; standalone rows own a local snapshot. NotificationDetailDialog receives notification: FRNNotification | null, onOpenChange(open: boolean): void and optional close-focus callback. It consumes only existing presentation helpers and the existing post-title query hook.

- [x] Add tests for opening full details from a row, full templated/multiline content, independent existing links, safe missing fields and closing/reopening.
- [x] Observe those tests fail because no detail trigger/dialog exists.
- [x] Add the shared dialog and semantic row-level button without nested interactive controls. Add dropdown-owned selection outside its portal and restore bell focus when closing details.
- [x] Test actual dropdown-to-dialog handoff with offline HTTP/SSE transports. Do not fake Dialog or Dropdown primitives.

## Task 2: Mobile Events navigation

Files: MobileBottomTabBar.tsx and a focused bottom-bar test.

Interfaces: getMobileBottomTabs(session?: IUser | null) retains its existing public shape. Events uses EVENTS_ROUTE, RiCalendar and exact /events or /events/ descendant matching.

- [x] Write failing tests that the rendered second tab links to /events for guests, activates on detail routes and does not activate on /events-other or topic routes. Existing auth-only tabs remain protected.
- [x] Observe failures, replace Explore with Events and run the focused tests to green.

## Task 3: Verification

- [x] Run focused tests, full frontend suite with the existing external-network guard, TypeScript and lint.
- [x] Review the diff with a fresh read-only reviewer and address important findings with regression tests.
- [x] Use only the local UI to check dialog open/close, keyboard/focus and Events navigation at 390, 768 and 1440px. Save screenshot proof; no existing event data changes.
- [x] Leave the changes locally for the user's review and report actual verification results.

## Progress

- Approved design: dialog rather than a new notification route; Events replaces only the bottom Explore slot. The complete message is already in the authenticated list response, so a new get-by-id API is unnecessary for this interaction.
- Pre-flight: the tasks share no production interfaces. Native implementation is used for this small change, followed by one independent review.
- Initial test run observed 12 expected feature failures and 3 passes. The first implementation passed all 15 focused tests. TypeScript and repository lint passed, with existing lint warnings only.
- User refined the dialog: one message with an inline clickable @username and timestamp, not a separate repeated actor line. Added regressions for raw templates, rendered text with and without @, escaping markup and avoiding matches inside other words. Observed 4 expected failures, then implemented the inline link and moved time beneath the message. Actor-based notifications use a neutral Notification heading so a name in the original title is not repeated.
- Independent review found the bell DropdownMenu traps keyboard users outside the unregistered row buttons. A keyboard-only regression reproduced it. Replaced only the interaction primitive with the existing Popover and retained the current panel styling. The regression now opens details with Enter and restores bell focus with Escape. No new colors or components were introduced into the design system.
- Final focused verification after both refinements: 19 tests passed across the row/card, actual popover handoff and mobile navigation tests. Final full-suite and type/lint reruns are pending.
- Backward-compatibility check found title-only legacy notifications would lose their message when the actor-based heading becomes neutral. Added a regression, observed it fail, then used the resolved title as message fallback only when there is no body. All 20 final focused tests passed. Kept the existing TypeScript target unchanged by iterating over an array of message matches rather than an iterator.
- Local UI evidence: the inline @cohostui_mvn9dypi link opened that exact local profile; the Events tab navigated to /events and became active; touch targets are 61px tall. The dialog fits at 390px (358px wide), 768px and 1440px (448px wide), with no horizontal overflow. Enter opens details from the focused notification; Escape restores focus to the bell. The same message dialog opens on /notifications. Screenshots saved outside the repo, no production access or event-data edits.
- Ruling: use the existing Popover instead of DropdownMenu only for the bell panel, because a mixed notification list contains several independent buttons and links rather than menu items. This preserves the visual panel and normal Tab navigation; the keyboard regression protects the behavior. No deferred review findings remain. Layout-only browser checks and final test results are verified by the parent, not assumed from the read-only review.
- Final results: full frontend run passed 590 tests in 125 files (479.38s). The final legacy-message refinement was additionally verified by all 20 focused tests (including its new regression); final TypeScript and scoped lint both exited 0. Repository-wide lint had also passed with existing unrelated warnings. No production build is claimed. Diff checks passed, index is empty, and changes are left uncommitted/unpushed on codex/event-timezone-release. Original local organizer session remains signed in, with the notification details visible on /notifications.
- Delivery authorization: user requested staging, committing and pushing the relevant changes, while their team reviews the earlier PR. Only the four frontend components, three tests and this plan belong to this delivery. Unrelated frontend drafts/tsconfig changes and backend discussion generated files remain excluded. A fresh full-suite run on the final code is required before the commit.
- Delivery verification: the final unchanged product/test tree passed all 591 tests in 125 files (365.32s), TypeScript exited 0 and repository-wide lint exited 0 with existing warnings only. Staged files match the eight-file allowlist and the added-line credential-pattern scan found no matches. Existing frontend PR #793 targets this branch, so a normal push updates it without creating or merging another PR. No new backend changes belong to these UI fixes.
