import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PostArticleCanvas } from './PostArticleCanvas';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function mockSelection() {
  const removeAllRanges = vi.fn();
  const addRange = vi.fn();
  vi.spyOn(window, 'getSelection').mockReturnValue({
    removeAllRanges,
    addRange,
  } as unknown as Selection);
  return { removeAllRanges, addRange };
}

describe('PostArticleCanvas', () => {
  it('marks the wrapper as the post canvas', () => {
    render(
      <PostArticleCanvas>
        <p>Post title</p>
      </PostArticleCanvas>
    );
    expect(
      screen.getByText('Post title').closest('[data-post-canvas]')
    ).not.toBeNull();
  });

  it('Ctrl+A selects the canvas, not sibling chrome', () => {
    const { addRange } = mockSelection();
    render(
      <div>
        <nav>Cookie Policy</nav>
        <PostArticleCanvas>
          <p>Post title</p>
          <p>Post body</p>
        </PostArticleCanvas>
      </div>
    );
    fireEvent.keyDown(document, { key: 'a', ctrlKey: true });
    expect(addRange).toHaveBeenCalled();
    const range = addRange.mock.calls[0][0] as Range;
    const canvas = document.querySelector('[data-post-canvas]');
    expect(canvas).not.toBeNull();
    expect(
      range.commonAncestorContainer === canvas ||
        canvas!.contains(range.commonAncestorContainer)
    ).toBe(true);
  });

  it('leaves Ctrl+A to a chrome field', () => {
    const { addRange } = mockSelection();
    render(
      <div>
        <div data-shortcut-scope='chrome'>
          <input aria-label='Search stories' defaultValue='hello' />
        </div>
        <PostArticleCanvas>
          <p>Post title</p>
        </PostArticleCanvas>
      </div>
    );
    const input = screen.getByLabelText('Search stories');
    input.focus();
    fireEvent.keyDown(input, { key: 'a', ctrlKey: true, bubbles: true });
    expect(addRange).not.toHaveBeenCalled();
  });
});
