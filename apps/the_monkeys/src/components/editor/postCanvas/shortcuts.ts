export type ShortcutKind = 'selectAll' | 'undo' | 'redo';

const CHROME_SELECTOR = [
  '[data-shortcut-scope="chrome"]',
  '[role="dialog"]',
  '[data-radix-dialog-content]',
  '[data-vaul-drawer]',
].join(', ');

function elementFromTarget(node: EventTarget | null): Element | null {
  if (node instanceof Element) return node;
  if (node instanceof Node) return node.parentElement;
  return null;
}

export function isChromeShortcutTarget(node: EventTarget | null): boolean {
  const el = elementFromTarget(node);
  if (!el) return false;
  return Boolean(el.closest(CHROME_SELECTOR));
}

const CHROME_EDITABLE_SELECTOR =
  'input, textarea, select, [contenteditable]:not([contenteditable="false"])';

export function isChromeEditableField(node: EventTarget | null): boolean {
  const el = elementFromTarget(node);
  if (!el || !el.closest(CHROME_SELECTOR)) return false;
  return Boolean(el.closest(CHROME_EDITABLE_SELECTOR));
}

function hasMod(
  e: Pick<KeyboardEvent, 'ctrlKey' | 'metaKey' | 'altKey'>
): boolean {
  if (e.altKey) return false;
  return e.ctrlKey || e.metaKey;
}

export function shortcutKind(
  e: Pick<KeyboardEvent, 'key' | 'shiftKey' | 'ctrlKey' | 'metaKey' | 'altKey'>
): ShortcutKind | null {
  if (!hasMod(e)) return null;
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key.toLowerCase();
  if (key === 'a' && !e.shiftKey) return 'selectAll';
  if (key === 'z' && !e.shiftKey) return 'undo';
  if (key === 'z' && e.shiftKey) return 'redo';
  if (key === 'y' && e.ctrlKey && !e.metaKey && !e.shiftKey) return 'redo';
  return null;
}

export function shouldHandleSelectAll(
  e: Pick<KeyboardEvent, 'key' | 'shiftKey' | 'ctrlKey' | 'metaKey' | 'altKey'>,
  opts: { isChrome: boolean }
): boolean {
  return shortcutKind(e) === 'selectAll' && !opts.isChrome;
}

export function shouldHandleUndo(
  e: Pick<KeyboardEvent, 'key' | 'shiftKey' | 'ctrlKey' | 'metaKey' | 'altKey'>,
  opts: { isChrome: boolean; hasUndo: boolean }
): boolean {
  return shortcutKind(e) === 'undo' && !opts.isChrome && opts.hasUndo;
}

export function shouldHandleRedo(
  e: Pick<KeyboardEvent, 'key' | 'shiftKey' | 'ctrlKey' | 'metaKey' | 'altKey'>,
  opts: { isChrome: boolean; hasUndo: boolean }
): boolean {
  return shortcutKind(e) === 'redo' && !opts.isChrome && opts.hasUndo;
}

export function shouldHandleClearDocument(
  e: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey'>,
  opts: { isChrome: boolean; hasClear: boolean; isFullySelected: boolean }
): boolean {
  if (opts.isChrome || !opts.hasClear || !opts.isFullySelected) return false;
  if (e.ctrlKey || e.metaKey || e.altKey) return false;
  return e.key === 'Backspace' || e.key === 'Delete';
}

export function isPostCanvasFullySelected(root: HTMLElement): boolean {
  try {
    const sel = window.getSelection?.();
    if (!sel || typeof sel.getRangeAt !== 'function' || sel.rangeCount === 0) {
      return false;
    }
    const range = sel.getRangeAt(0);
    if (range.collapsed) return false;
    const full = document.createRange();
    full.selectNodeContents(root);
    return (
      range.compareBoundaryPoints(Range.START_TO_START, full) === 0 &&
      range.compareBoundaryPoints(Range.END_TO_END, full) === 0
    );
  } catch (err) {
    console.warn('isPostCanvasFullySelected failed', err);
    return false;
  }
}

export function selectPostCanvas(root: HTMLElement): void {
  try {
    const sel = window.getSelection?.();
    if (!sel) return;
    const range = document.createRange();
    range.selectNodeContents(root);
    sel.removeAllRanges();
    sel.addRange(range);
  } catch (err) {
    console.warn('selectPostCanvas failed', err);
  }
}
