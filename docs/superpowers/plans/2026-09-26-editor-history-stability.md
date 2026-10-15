# Editor history stability implementation plan

Spec: approved conversation plan, including backward-compatible title enforcement.

Work in the current checkout and branch. Preserve staged changes; leave new changes unstaged. No API, published-content migration, commit, or push.

- [x] Title compatibility: normalize editor documents without consuming body content; keep legacy title serialization, render it as H1, retain blank titles in saves.
- [x] Selection: derive full-document selection from the DOM; support keyboard and mobile beforeinput deletion without intercepting search/dialog inputs.
- [x] History: serialize capture/clear/undo/redo, deep-copy rich block data, invalidate redo on new typing, preserve focus/selection and viewport across block patches.
- [x] Verification: regression tests first, frontend suite and type check, then desktop/mobile-width browser tests on an unpublished draft. See limitations below.

Review focus: legacy title data, inline formatting, empty titles, mixed nested blocks, quick clear/undo, edit after undo, changing drafts during pending work, selection outside the canvas.

## Execution ledger

- Baseline: 49 editor tests passed; browser Ctrl+A/delete did not clear and undo lost focus to BODY.
- Ruling: use the user-requested checkout, not a separate worktree; preserve all existing staged/unstaged work.
- Pre-flight: title normalization is shared by capture, initial data, and external data. History patches must preserve the same serialized block format.

## Implemented and verified

- Library node replacement caused focus loss; preserve selection and viewport around incremental patches. Reserve full-document rendering for serialized tune restoration, which the installed insertion/update APIs do not reliably preserve.
- Give each editor instance its own holder so delayed StrictMode cleanup cannot destroy its replacement. Callback identity changes no longer remount the editor.
- Preserve empty paragraphs omitted by the library saver, and patch using actual live block order. Never delete the final block before inserting its replacement.
- Reconcile incoming draft data before seeding history or publishing during asynchronous startup. Assign missing legacy block IDs before history starts.
- Retry saves when the visible editor changes while asynchronous tool saves are pending. If it keeps changing, abort that capture without applying a stale snapshot.
- Preserve legacy title serialization, body H2 content, moved titles, inline formatting, and nested tool data. No published-content migration.
- Removed immediate deletion of uploaded assets during reversible block removal; history may still reference those assets.
- Independent read-only review: addressed all reproduced startup, concurrency, ID, tune, and external-field shortcut findings with regression tests. Follow-up found no further critical issues in the last fixes.

### Verification results, 2026-09-26

- Full frontend Vitest run: 437 passed, 1 failed, 112 test files. All editor tests passed.
- Unrelated existing failure: `LandingEventsSection.test.tsx` has no QueryClientProvider for EventHostName/useUser. Left untouched.
- TypeScript check still reports existing test-fixture errors in LandingPageClient, userInfo, getBlogContent, shared/createBlock, and topicCatalog tests. No errors reported in this change's implementation files. A clean production build is not claimed.
- `git diff --check` passed.
- Real browser at 390px and 1280px: clear-all leaves exactly one focused blank H1; undo restores title/body/empty paragraph; redo clears correctly; fresh typing after undo invalidates redo; Enter works after restoration.
- Direct keyboard test in a long document: undo preserved scroll at 3655.33px and retained focus/caret in the body. Locator-based focus can itself scroll a long editable, so direct keyboard events were used for this measurement.
- No horizontal overflow observed at either tested width. Native iOS/Android keyboards and IME were not exercised on physical devices; mobile beforeinput behavior has automated coverage.
- Restored the local test draft's title and body after browser checks; did not publish it. Reset viewport override and left the editor tab open.
- Current branch remains `codex/group-scoped-blogs`. Existing staged work preserved; this task's changes are unstaged. No commits, pushes, API edits, or SEO edits.
