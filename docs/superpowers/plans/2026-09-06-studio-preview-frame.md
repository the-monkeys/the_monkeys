# Studio Preview Frame Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the studio live preview so Image templates, X screenshots, and business cards fill the inset well, the border hugs the real canvas, and sticky mobile export icons cannot collapse width on WebKit.

**Architecture:** Extract one width-only scale helper (`fitPreviewScale`). The well has no forced height or 4:5 aspect; it grows with `nativeHeight * scale`. Mobile-first: phone `w-full`, then `sm:max-w-[420px] md:max-w-[520px] lg:max-w-[560px]`. Overlay icons stay; `display: contents` on the mobile preview section stays. Commit and push only after the Cursor browser responsive matrix passes.

**Tech Stack:** Next.js 14, React 18, Tailwind, Vitest (`npm test` in `apps/the_monkeys`).

**Spec:** `docs/superpowers/specs/2026-09-06-studio-preview-frame-design.md`

## Global Constraints

- Scale formula is exactly `scale = min(1, availableWidth / nativeWidth)`. Never use `clientHeight` to shrink.
- Well classes: `mx-auto w-full sm:max-w-[420px] md:max-w-[520px] lg:max-w-[560px]`, `box-border rounded-2xl border p-2 sm:p-4`. No `h-80`, no `aspect-[1080/1350]`, no `overflow-hidden` on the well.
- Do not commit or push until Task 7 (Cursor browser: 360, 390, 768, 1440) passes. The user asked to commit and push after that gate.
- Keep `display: contents` on the mobile preview `<section>`. Keep overlay export icons (`absolute`, `md:hidden`). Never `flex` + `min-w-0 flex-1` beside icons.
- WebKit bans: no `w-auto` with `width: 100%` children; no `min()` / `svh` as the only size; no `absolute inset-0` on the scaled canvas.
- Cursor Chromium is not iPhone Safari. Do not claim Safari is fixed from a Chromium screenshot.
- The user asked to commit and push after the Cursor browser responsive matrix passes. Do not commit before Task 7.
- Do not commit the untracked file `a` at the repo root.
- Do not redesign templates, themes, or export pixel output.

## File map

| File | Responsibility |
| ---- | -------------- |
| Create `apps/the_monkeys/src/features/snapshot/lib/fitPreviewScale.ts` | Width-only scale math |
| Create `apps/the_monkeys/src/features/snapshot/lib/fitPreviewScale.test.ts` | Unit tests for every template aspect in the spec |
| Create `apps/the_monkeys/src/components/studioPreviewFitClass.test.ts` | Regression: well class has no height/aspect lock |
| Modify `apps/the_monkeys/src/components/StudioPreviewSticky.tsx` | `studioPreviewFitClass` = width caps only |
| Modify `apps/the_monkeys/src/features/snapshot/components/SnapshotPreview.tsx` | Use helper; stage height follows canvas |
| Modify `apps/the_monkeys/src/features/cards/components/CardPreview.tsx` | Use helper; stage height follows canvas |
| Modify `apps/the_monkeys/src/features/snapshot/components/SnapshotStudio.tsx` | Well classes; X scale via helper |
| Modify `apps/the_monkeys/src/features/cards/components/CardStudio.tsx` | Same well classes as snapshot |

---

### Task 1: Width-only scale helper

**Files:**
- Create: `apps/the_monkeys/src/features/snapshot/lib/fitPreviewScale.ts`
- Test: `apps/the_monkeys/src/features/snapshot/lib/fitPreviewScale.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `fitPreviewScale(nativeWidth: number, nativeHeight: number, availableWidth: number): { scale: number; scaledWidth: number; scaledHeight: number }`

- [ ] **Step 1: Write the failing test**

Create `apps/the_monkeys/src/features/snapshot/lib/fitPreviewScale.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { fitPreviewScale } from './fitPreviewScale';

describe('fitPreviewScale', () => {
  it('scales 4:5 editorial by width only (264px inner phone well)', () => {
    const r = fitPreviewScale(1080, 1350, 264);
    expect(r.scale).toBeCloseTo(264 / 1080);
    expect(r.scaledWidth).toBeCloseTo(264);
    expect(r.scaledHeight).toBeCloseTo(330);
  });

  it('scales 1:1 quote to a square, not a 4:5 box', () => {
    const r = fitPreviewScale(1080, 1080, 264);
    expect(r.scaledWidth).toBeCloseTo(264);
    expect(r.scaledHeight).toBeCloseTo(264);
  });

  it('scales 16:9 X share landscape', () => {
    const r = fitPreviewScale(1200, 675, 264);
    expect(r.scaledWidth).toBeCloseTo(264);
    expect(r.scaledHeight).toBeCloseTo(264 * (675 / 1200));
  });

  it('scales LinkedIn 1200x627', () => {
    const r = fitPreviewScale(1200, 627, 264);
    expect(r.scaledHeight).toBeCloseTo(264 * (627 / 1200));
  });

  it('scales Instagram carousel 3240x1350', () => {
    const r = fitPreviewScale(3240, 1350, 264);
    expect(r.scaledWidth).toBeCloseTo(264);
    expect(r.scaledHeight).toBeCloseTo(264 * (1350 / 3240));
  });

  it('scales story 9:16 by width (taller well, no letterbox)', () => {
    const r = fitPreviewScale(1080, 1920, 264);
    expect(r.scaledWidth).toBeCloseTo(264);
    expect(r.scaledHeight).toBeCloseTo(469.333, 1);
  });

  it('scales business card 1050x600', () => {
    const r = fitPreviewScale(1050, 600, 264);
    expect(r.scaledWidth).toBeCloseTo(264);
    expect(r.scaledHeight).toBeCloseTo(264 * (600 / 1050));
  });

  it('does not upscale past native size', () => {
    const r = fitPreviewScale(1080, 1350, 2000);
    expect(r.scale).toBe(1);
    expect(r.scaledWidth).toBe(1080);
    expect(r.scaledHeight).toBe(1350);
  });

  it('returns zeros when width is not measurable yet', () => {
    expect(fitPreviewScale(1080, 1350, 0)).toEqual({
      scale: 0,
      scaledWidth: 0,
      scaledHeight: 0,
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run from `apps/the_monkeys`:

```bash
npm test -- src/features/snapshot/lib/fitPreviewScale.test.ts
```

Expected: FAIL with cannot find module `./fitPreviewScale` (or `fitPreviewScale` is not exported).

- [ ] **Step 3: Write minimal implementation**

Create `apps/the_monkeys/src/features/snapshot/lib/fitPreviewScale.ts`:

```ts
export function fitPreviewScale(
  nativeWidth: number,
  nativeHeight: number,
  availableWidth: number
): { scale: number; scaledWidth: number; scaledHeight: number } {
  if (nativeWidth <= 0 || availableWidth <= 0) {
    return { scale: 0, scaledWidth: 0, scaledHeight: 0 };
  }
  const scale = Math.min(1, availableWidth / nativeWidth);
  return {
    scale,
    scaledWidth: nativeWidth * scale,
    scaledHeight: nativeHeight * scale,
  };
}
```

- [ ] **Step 4: Run tests and make sure they pass**

```bash
npm test -- src/features/snapshot/lib/fitPreviewScale.test.ts
```

Expected: PASS, 9 tests.

- [ ] **Step 5: Commit**

Skip unless the user asked to commit.

```bash
git add apps/the_monkeys/src/features/snapshot/lib/fitPreviewScale.ts apps/the_monkeys/src/features/snapshot/lib/fitPreviewScale.test.ts
git commit -m "Add width-only studio preview scale helper."
```

---

### Task 2: Well class with no height or aspect lock

**Files:**
- Modify: `apps/the_monkeys/src/components/StudioPreviewSticky.tsx` (the `studioPreviewFitClass` export at the bottom of the file)
- Test: `apps/the_monkeys/src/components/studioPreviewFitClass.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `studioPreviewFitClass` string `'relative w-full max-w-[280px] md:max-w-[560px]'`

- [ ] **Step 1: Write the failing test**

Create `apps/the_monkeys/src/components/studioPreviewFitClass.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { studioPreviewFitClass } from './StudioPreviewSticky';

describe('studioPreviewFitClass', () => {
  it('caps width on phones and desktop without locking height or aspect', () => {
    expect(studioPreviewFitClass).toContain('max-w-[280px]');
    expect(studioPreviewFitClass).toContain('md:max-w-[560px]');
    expect(studioPreviewFitClass).not.toContain('h-80');
    expect(studioPreviewFitClass).not.toContain('aspect-[');
    expect(studioPreviewFitClass).not.toContain('min(');
    expect(studioPreviewFitClass).not.toContain('svh');
    expect(studioPreviewFitClass).not.toContain('w-auto');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- src/components/studioPreviewFitClass.test.ts
```

Expected: FAIL because current class is `'relative h-80 w-full max-w-[560px] md:h-auto md:aspect-[1080/1350]'`.

- [ ] **Step 3: Write minimal implementation**

In `apps/the_monkeys/src/components/StudioPreviewSticky.tsx`, replace the export at the bottom. Keep the overlay-icon `StudioPreviewSticky` markup unchanged (`relative w-full` wrapper, `absolute right-1 top-1/2 ... md:hidden` actions). Change only:

```ts
/** Phone max 280px so 4:5 stays ~330px tall. Desktop 560px. Height follows the canvas. */
export const studioPreviewFitClass =
  'relative w-full max-w-[280px] md:max-w-[560px]';
```

Do not change the sticky wrapper classes. Do not put actions back into a flex row.

- [ ] **Step 4: Run tests and make sure they pass**

```bash
npm test -- src/components/studioPreviewFitClass.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Skip unless the user asked to commit.

```bash
git add apps/the_monkeys/src/components/StudioPreviewSticky.tsx apps/the_monkeys/src/components/studioPreviewFitClass.test.ts
git commit -m "Size Studio wells by max-width so templates keep their own aspect."
```

---

### Task 3: SnapshotPreview scales by width

**Files:**
- Modify: `apps/the_monkeys/src/features/snapshot/components/SnapshotPreview.tsx`
- Test: `apps/the_monkeys/src/features/snapshot/lib/fitPreviewScale.test.ts` (already passing from Task 1)

**Interfaces:**
- Consumes: `fitPreviewScale(nativeWidth, nativeHeight, availableWidth)` from `../lib/fitPreviewScale`
- Produces: stage whose height is the scaled canvas, not `height: 100%` of a locked well

- [ ] **Step 1: Confirm current letterbox math is the bug**

In `SnapshotPreview.tsx` the effect currently does:

```ts
const byWidth = availableW / template.width;
const byHeight =
  el.clientHeight > 0 ? el.clientHeight / template.height : byWidth;
const next = Math.min(1, byWidth, byHeight);
```

That is the spec violation. Replace it. No new test file; Task 1 already locks the math.

- [ ] **Step 2: Replace scale + stage styles**

Replace the `useEffect` and `stageStyle` in `SnapshotPreview.tsx` with:

```tsx
import { fitPreviewScale } from '../lib/fitPreviewScale';
```

```tsx
    useEffect(() => {
      if (!stageRef.current) return;
      const el = stageRef.current;
      let tries = 0;
      const update = () => {
        const availableW = maxPreviewWidth ?? el.clientWidth;
        if (!availableW) {
          if (tries++ < 12) window.requestAnimationFrame(update);
          return;
        }
        const next = fitPreviewScale(
          template.width,
          template.height,
          availableW
        ).scale;
        setScale((prev) => (Math.abs(prev - next) < 0.001 ? prev : next));
      };
      update();
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }, [template.width, template.height, maxPreviewWidth]);
```

Replace `stageStyle` with:

```tsx
    const stageStyle: CSSProperties = {
      width: '100%',
      maxWidth: maxPreviewWidth,
      backgroundColor: stageBackground,
    };
```

Remove `height: '100%'`, `minHeight: 0`, `overflow: 'hidden'`, `display: 'flex'`, `alignItems`, `justifyContent` from the stage. Keep the inner scaled wrapper (`width: scaledWidth`, `height: scaledHeight`, `overflow: 'hidden'`, centered with `marginLeft/Right: auto`). Keep transform on the inner wrapper, not on the export ref.

- [ ] **Step 3: Run unit tests**

```bash
npm test -- src/features/snapshot/lib/fitPreviewScale.test.ts src/components/studioPreviewFitClass.test.ts
```

Expected: PASS.

- [ ] **Step 4: Commit**

Skip unless the user asked to commit.

```bash
git add apps/the_monkeys/src/features/snapshot/components/SnapshotPreview.tsx
git commit -m "Scale image templates by width so the well hugs the canvas."
```

---

### Task 4: CardPreview scales by width

**Files:**
- Modify: `apps/the_monkeys/src/features/cards/components/CardPreview.tsx`

**Interfaces:**
- Consumes: `fitPreviewScale` from `@/features/snapshot/lib/fitPreviewScale` (shared helper; do not duplicate)
- Produces: card stage height follows 1050×600 scaled by width

- [ ] **Step 1: Add the import**

At the top of `CardPreview.tsx`:

```tsx
import { fitPreviewScale } from '@/features/snapshot/lib/fitPreviewScale';
```

- [ ] **Step 2: Replace scale effect and stage class**

Replace the `update` body inside `useEffect` with:

```tsx
        const availableW = maxPreviewWidth ?? el.clientWidth;
        if (!availableW) {
          if (tries++ < 12) window.requestAnimationFrame(update);
          return;
        }
        const next = fitPreviewScale(
          template.width,
          template.height,
          availableW
        ).scale;
        setScale((prev) => (Math.abs(prev - next) < 0.001 ? prev : next));
```

On the measured stage `div` (`ref={stageRef}`), change class from `'flex h-full w-full items-center justify-center overflow-hidden'` to `'w-full'`. Keep `maxWidth: maxPreviewWidth`. Keep the scaled inner wrappers and export ref unchanged.

- [ ] **Step 3: Run unit tests**

```bash
npm test -- src/features/snapshot/lib/fitPreviewScale.test.ts
```

Expected: PASS.

- [ ] **Step 4: Commit**

Skip unless the user asked to commit.

```bash
git add apps/the_monkeys/src/features/cards/components/CardPreview.tsx
git commit -m "Scale business card previews by width like image templates."
```

---

### Task 5: SnapshotStudio well + X screenshot scale

**Files:**
- Modify: `apps/the_monkeys/src/features/snapshot/components/SnapshotStudio.tsx` (xScale `useEffect` near line 136; well markup near line 370)

**Interfaces:**
- Consumes: `fitPreviewScale`, `studioPreviewFitClass`
- Produces: Image and X share the same well; X scale is width-only

- [ ] **Step 1: Add import**

With the other snapshot imports:

```tsx
import { fitPreviewScale } from '../lib/fitPreviewScale';
```

- [ ] **Step 2: Replace X scale effect**

Replace the `useEffect` that sets `xScale` with:

```tsx
  useEffect(() => {
    if (previewMode !== 'x' || !xStageRef.current) return;
    const el = xStageRef.current;
    let tries = 0;
    const update = () => {
      const available = el.clientWidth;
      if (!available) {
        if (tries++ < 12) window.requestAnimationFrame(update);
        return;
      }
      const next = fitPreviewScale(
        tweetCanvasSize.width,
        tweetCanvasSize.height,
        available
      ).scale;
      setXScale(next);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [previewMode, tweetCanvasSize.width, tweetCanvasSize.height]);
```

- [ ] **Step 3: Replace well markup**

Replace the well `div` and its two children with:

```tsx
          <div
            className={cn(
              'mx-auto box-border rounded-2xl border bg-background-light p-2 dark:bg-background-dark sm:p-4',
              studioPreviewFitClass
            )}
            style={{ width: '100%' }}
          >
            {previewMode === 'template' ? (
              <SnapshotPreview
                ref={snapshotRef}
                className='w-full'
                input={renderedInput}
                templateId={state.templateId}
                themeId={state.themeId}
                accent={state.accent}
              />
            ) : (
              <div ref={xStageRef} className='w-full'>
                <div
                  style={{
                    width: tweetCanvasSize.width * xScale,
                    height: tweetCanvasSize.height * xScale,
                    overflow: 'hidden',
                    position: 'relative',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  <div
                    style={{
                      width: tweetCanvasSize.width,
                      height: tweetCanvasSize.height,
                      transform: `scale(${xScale})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    <TweetScreenshotPreview
                      ref={tweetPreviewRef}
                      tweetUrl={tweetUrl}
                      options={tweetOptions}
                      onError={setTweetLoadError}
                      onTweetReady={setTweetForDownload}
                      exportMode={exportMode}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
```

Do not add `overflow-hidden` on the well. Do not add `h-full` on the X stage. Keep `section className='contents md:sticky ...'`. Keep `StudioPreviewSticky` actions overlay.

- [ ] **Step 4: Run unit tests**

```bash
npm test -- src/features/snapshot/lib/fitPreviewScale.test.ts src/components/studioPreviewFitClass.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Skip unless the user asked to commit.

```bash
git add apps/the_monkeys/src/features/snapshot/components/SnapshotStudio.tsx
git commit -m "Match X screenshot well to image templates and scale by width."
```

---

### Task 6: CardStudio well matches snapshot

**Files:**
- Modify: `apps/the_monkeys/src/features/cards/components/CardStudio.tsx` (`CardPreview` `className` near line 228)

**Interfaces:**
- Consumes: `studioPreviewFitClass` from `@/components/StudioPreviewSticky`
- Produces: card well uses the same width-cap + inset border rule

- [ ] **Step 1: Replace CardPreview className**

Replace the `CardPreview` `className` with:

```tsx
            className={cn(
              'mx-auto box-border rounded-2xl border border-foreground/10 bg-background-light p-2 dark:bg-background-dark sm:p-4',
              studioPreviewFitClass
            )}
```

Remove `overflow-hidden` from that class list. Keep `StudioPreviewSticky` and `actionsClassName='md:flex lg:hidden'`. Keep `contents lg:sticky ...` on the parent.

- [ ] **Step 2: Run unit tests**

```bash
npm test -- src/components/studioPreviewFitClass.test.ts
```

Expected: PASS.

- [ ] **Step 3: Commit**

Skip unless the user asked to commit.

```bash
git add apps/the_monkeys/src/features/cards/components/CardStudio.tsx
git commit -m "Give business card preview the same inset well as snapshot."
```

---

### Task 7: Chromium check, then stop (Safari is the user)

**Files:** none (verification only)

**Interfaces:**
- Consumes: Tasks 1–6 on the local dev server (`npm run dev` in `apps/the_monkeys`)
- Produces: measurements + screenshots; **not** a Safari-done claim

- [ ] **Step 1: Open `/snapshot/new` at 390×844**

Use the Cursor browser. Image template Editorial Portrait. Measure the well and the scaled canvas.

Pass if:

- Well width is ~280px (not ~full 390 minus chrome only, and not 1px).
- Canvas width ≈ well inner width (well minus `p-2`).
- Canvas height ≈ canvas width × (1350/1080), not a square `h-80` box with side gutters.
- Author row (Anonymous User) is visible.
- Inset padding and rounded border are visible around the canvas, not around empty space.
- Copy / PNG / JPG are overlayed, not a sibling column.

- [ ] **Step 2: Switch template to Quote Card (1:1)**

Pass if well height ≈ well inner width. Fail if a 4:5 empty bar remains above/below or left/right of the square.

- [ ] **Step 3: Switch to X screenshot, Portrait 4:5 then Landscape 16:9**

Pass if the well uses the same border/padding as Image, and landscape well is shorter than portrait. Fail if both sit in the same 320px-tall letterbox.

- [ ] **Step 4: If logged in, open `/cards/new`**

Pass if the 1050×600 card fills inner width (landscape). Skip with a written note if login blocks the route.

- [ ] **Step 5: Report**

Tell the user Chromium results. Tell them to hard-refresh the Netlify PR 705 preview on iPhone Safari. Do not write “Safari is fixed”.

- [ ] **Step 6: Commit**

Skip unless the user asked to commit.

---

## Spec coverage (self-review)

| Spec requirement | Task |
| ---------------- | ---- |
| Width-only scale | 1, 3, 4, 5 |
| All listed template sizes in tests | 1 |
| Well `max-w-[280px]` / `md:max-w-[560px]` | 2, 5, 6 |
| No `h-80` / `aspect-[1080/1350]` / well `overflow-hidden` | 2, 5, 6 |
| Overlay icons, no flex sibling | 2 (leave markup), 5–6 (do not revert) |
| `display: contents` kept | 5–6 (do not remove) |
| rAF retry when width is 0 | 3, 4, 5 |
| WebKit bans | 2 test + 5–6 markup |
| Chromium then user Safari | 7 |
| No export pipeline change | no task touches `useExport` |

No placeholders. `fitPreviewScale` signature is the same in Tasks 1, 3, 4, and 5.
