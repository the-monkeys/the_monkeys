import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  isChromeEditableField,
  isChromeShortcutTarget,
  isPostCanvasFullySelected,
  selectPostCanvas,
  shortcutKind,
  shouldHandleClearDocument,
  shouldHandleRedo,
  shouldHandleSelectAll,
  shouldHandleUndo,
} from './shortcuts';

function key(
  partial: Partial<KeyboardEvent> & Pick<KeyboardEvent, 'key'>
): Pick<KeyboardEvent, 'key' | 'shiftKey' | 'ctrlKey' | 'metaKey' | 'altKey'> {
  return {
    shiftKey: false,
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    ...partial,
  };
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('isChromeShortcutTarget', () => {
  it('is true for dialog, chrome scope, and vaul drawer', () => {
    document.body.innerHTML = `
      <div data-shortcut-scope="chrome"><input id="search" /></div>
      <div role="dialog"><input id="dialog" /></div>
      <div data-radix-dialog-content><input id="radix" /></div>
      <div data-vaul-drawer><input id="drawer" /></div>
      <div data-post-canvas>
        <textarea id="md"></textarea>
        <input id="chart" />
        <div id="heading" contenteditable="true"></div>
      </div>
    `;
    expect(isChromeShortcutTarget(document.getElementById('search'))).toBe(
      true
    );
    expect(isChromeShortcutTarget(document.getElementById('dialog'))).toBe(
      true
    );
    expect(isChromeShortcutTarget(document.getElementById('radix'))).toBe(true);
    expect(isChromeShortcutTarget(document.getElementById('drawer'))).toBe(
      true
    );
    expect(isChromeShortcutTarget(document.getElementById('md'))).toBe(false);
    expect(isChromeShortcutTarget(document.getElementById('chart'))).toBe(
      false
    );
    expect(isChromeShortcutTarget(document.getElementById('heading'))).toBe(
      false
    );
    expect(isChromeShortcutTarget(document.body)).toBe(false);
    expect(isChromeShortcutTarget(null)).toBe(false);
  });

  it('treats chrome inputs as editable fields, not tabs or canvas editors', () => {
    document.body.innerHTML = `
      <div data-shortcut-scope="chrome">
        <input id="search" />
        <button id="preview">Preview</button>
      </div>
      <div data-post-canvas>
        <textarea id="md"></textarea>
      </div>
    `;
    expect(isChromeEditableField(document.getElementById('search'))).toBe(true);
    expect(isChromeEditableField(document.getElementById('preview'))).toBe(
      false
    );
    expect(isChromeEditableField(document.getElementById('md'))).toBe(false);
    expect(isChromeEditableField(null)).toBe(false);
  });
});

describe('shortcutKind', () => {
  it('maps Docs shortcuts and ignores Alt+Ctrl and Shift+A', () => {
    expect(shortcutKind(key({ key: 'a', ctrlKey: true }))).toBe('selectAll');
    expect(shortcutKind(key({ key: 'A', metaKey: true }))).toBe('selectAll');
    expect(shortcutKind(key({ key: 'a', ctrlKey: true, shiftKey: true }))).toBe(
      null
    );
    expect(shortcutKind(key({ key: 'z', ctrlKey: true }))).toBe('undo');
    expect(shortcutKind(key({ key: 'z', metaKey: true, shiftKey: true }))).toBe(
      'redo'
    );
    expect(shortcutKind(key({ key: 'y', ctrlKey: true }))).toBe('redo');
    expect(shortcutKind(key({ key: 'y', metaKey: true }))).toBe(null);
    expect(shortcutKind(key({ key: 'z', ctrlKey: true, altKey: true }))).toBe(
      null
    );
    expect(shortcutKind(key({ key: 'a' }))).toBe(null);
  });
});

describe('shouldHandle*', () => {
  it('does not steal chrome or fire undo without a controller', () => {
    const select = key({ key: 'a', ctrlKey: true });
    const undo = key({ key: 'z', ctrlKey: true });
    const redo = key({ key: 'y', ctrlKey: true });
    expect(shouldHandleSelectAll(select, { isChrome: false })).toBe(true);
    expect(shouldHandleSelectAll(select, { isChrome: true })).toBe(false);
    expect(shouldHandleUndo(undo, { isChrome: false, hasUndo: true })).toBe(
      true
    );
    expect(shouldHandleUndo(undo, { isChrome: true, hasUndo: true })).toBe(
      false
    );
    expect(shouldHandleUndo(undo, { isChrome: false, hasUndo: false })).toBe(
      false
    );
    expect(shouldHandleRedo(redo, { isChrome: false, hasUndo: true })).toBe(
      true
    );
    expect(shouldHandleRedo(redo, { isChrome: false, hasUndo: false })).toBe(
      false
    );
  });
});

describe('selectPostCanvas', () => {
  it('adds a range inside the canvas', () => {
    const canvas = document.createElement('div');
    canvas.append('hello');
    document.body.append(canvas);
    const removeAllRanges = vi.fn();
    const addRange = vi.fn();
    vi.spyOn(window, 'getSelection').mockReturnValue({
      removeAllRanges,
      addRange,
    } as unknown as Selection);
    selectPostCanvas(canvas);
    expect(removeAllRanges).toHaveBeenCalled();
    expect(addRange).toHaveBeenCalled();
    const range = addRange.mock.calls[0][0] as Range;
    expect(
      range.commonAncestorContainer === canvas ||
        canvas.contains(range.commonAncestorContainer)
    ).toBe(true);
  });

  it('does not throw if getSelection is missing', () => {
    vi.spyOn(window, 'getSelection').mockReturnValue(
      null as unknown as Selection
    );
    const el = document.createElement('div');
    expect(() => selectPostCanvas(el)).not.toThrow();
  });
});

describe('isPostCanvasFullySelected', () => {
  it('is true only when the live selection covers the whole canvas', () => {
    const canvas = document.createElement('div');
    canvas.append('hello world');
    document.body.append(canvas);
    const range = document.createRange();
    range.selectNodeContents(canvas);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    expect(isPostCanvasFullySelected(canvas)).toBe(true);
    sel?.collapseToEnd();
    expect(isPostCanvasFullySelected(canvas)).toBe(false);
  });

  it('does not throw when the selection has no ranges', () => {
    const canvas = document.createElement('div');
    canvas.append('hello');
    document.body.append(canvas);
    window.getSelection()?.removeAllRanges();
    expect(() => isPostCanvasFullySelected(canvas)).not.toThrow();
    expect(isPostCanvasFullySelected(canvas)).toBe(false);
  });
});

describe('shouldHandleClearDocument', () => {
  const backspace = key({ key: 'Backspace' });
  const del = key({ key: 'Delete' });

  it('clears only when the canvas is fully selected on edit', () => {
    expect(
      shouldHandleClearDocument(backspace, {
        isChrome: false,
        hasClear: true,
        isFullySelected: true,
      })
    ).toBe(true);
    expect(
      shouldHandleClearDocument(del, {
        isChrome: false,
        hasClear: true,
        isFullySelected: true,
      })
    ).toBe(true);
    expect(
      shouldHandleClearDocument(backspace, {
        isChrome: false,
        hasClear: true,
        isFullySelected: false,
      })
    ).toBe(false);
    expect(
      shouldHandleClearDocument(backspace, {
        isChrome: true,
        hasClear: true,
        isFullySelected: true,
      })
    ).toBe(false);
    expect(
      shouldHandleClearDocument(backspace, {
        isChrome: false,
        hasClear: false,
        isFullySelected: true,
      })
    ).toBe(false);
    expect(
      shouldHandleClearDocument(key({ key: 'Backspace', ctrlKey: true }), {
        isChrome: false,
        hasClear: true,
        isFullySelected: true,
      })
    ).toBe(false);
  });
});
