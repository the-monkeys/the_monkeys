import { afterEach, describe, expect, it, vi } from 'vitest';

import { preserveEditorSelection } from './preserveEditorSelection';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});
describe('editor selection preservation', () => {
  it('restores focus and text offset after a block node is replaced', async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    document.body.innerHTML =
      '<div id="canvas"><div class="ce-block" data-id="title"><h1 contenteditable="true">Hello world</h1></div></div>';
    const canvas = document.getElementById('canvas')!;
    const heading = canvas.querySelector('h1')!;
    heading.tabIndex = 0;
    heading.focus();
    const selection = window.getSelection()!;
    selection.setBaseAndExtent(heading.firstChild!, 2, heading.firstChild!, 5);
    await preserveEditorSelection(canvas, async () => {
      canvas.querySelector('.ce-block')!.innerHTML =
        '<h1 contenteditable="true" tabindex="0">Hello again</h1>';
    });
    expect(document.activeElement).toBe(canvas.querySelector('h1'));
    expect(selection.toString()).toBe('llo');
    expect(selection.anchorOffset).toBe(2);
  });
  it('focuses the empty title after a document clear', async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    document.body.innerHTML =
      '<div id="canvas"><div class="ce-block" data-id="title"><h1 contenteditable="true" tabindex="0">Old</h1></div></div>';
    const canvas = document.getElementById('canvas')!;
    await preserveEditorSelection(
      canvas,
      async () => {
        canvas.querySelector('h1')!.textContent = '';
      },
      true
    );
    expect(document.activeElement).toBe(canvas.querySelector('h1'));
    expect(window.getSelection()?.isCollapsed).toBe(true);
  });
});
