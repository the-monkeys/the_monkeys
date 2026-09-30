import { useRef } from 'react';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { usePostCanvasShortcuts } from './usePostCanvasShortcuts';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function Harness({ clearDocument }: { clearDocument?: (() => void) | null }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  usePostCanvasShortcuts({
    canvasRef,
    undo: null,
    clearDocument,
  });
  return (
    <div ref={canvasRef} data-post-canvas>
      hello world
    </div>
  );
}

function PageWithNav() {
  const canvasRef = useRef<HTMLDivElement>(null);
  usePostCanvasShortcuts({ canvasRef, undo: null });
  return (
    <div>
      <nav>Monkeys Business Tech</nav>
      <div data-shortcut-scope='chrome'>
        <button type='button'>Preview</button>
        <input aria-label='Search stories...' />
      </div>
      <div ref={canvasRef} data-post-canvas>
        <div className='codex-editor__redactor'>Untitled Post</div>
      </div>
    </div>
  );
}

describe('usePostCanvasShortcuts select all', () => {
  it('leaves unrelated contenteditable undo and select-all native', () => {
    const undo = vi.fn();
    function WithSibling() {
      const canvasRef = useRef<HTMLDivElement>(null);
      usePostCanvasShortcuts({ canvasRef, undo: { undo, redo: vi.fn() } });
      return (
        <>
          <div ref={canvasRef}>Post</div>
          <div contentEditable data-testid='external' />
        </>
      );
    }
    render(<WithSibling />);
    const sibling = screen.getByTestId('external');
    const nativeHandler = vi.fn();
    sibling.addEventListener('keydown', nativeHandler);
    expect(fireEvent.keyDown(sibling, { key: 'z', ctrlKey: true })).toBe(true);
    expect(fireEvent.keyDown(sibling, { key: 'a', ctrlKey: true })).toBe(true);
    expect(undo).not.toHaveBeenCalled();
    expect(nativeHandler).toHaveBeenCalledTimes(2);
  });
  it('Ctrl+A selects only [data-post-canvas], not a sibling nav', () => {
    render(<PageWithNav />);
    fireEvent.keyDown(document, { key: 'a', ctrlKey: true });
    const canvas = document.querySelector('[data-post-canvas]') as HTMLElement;
    const redactor = canvas.querySelector(
      '.codex-editor__redactor'
    ) as HTMLElement;
    const sel = window.getSelection();
    const node = sel?.anchorNode as Node | null;
    expect(node).toBeTruthy();
    expect(redactor.contains(node as Node)).toBe(true);
    expect(document.querySelector('nav')?.contains(node as Node)).toBe(false);
  });

  it('Ctrl+A from Edit/Preview chrome still selects the canvas', () => {
    render(<PageWithNav />);
    const tab = screen.getByRole('button', { name: 'Preview' });
    const prevented = !fireEvent.keyDown(tab, { key: 'a', ctrlKey: true });
    expect(prevented).toBe(true);
    const canvas = document.querySelector('[data-post-canvas]') as HTMLElement;
    const node = window.getSelection()?.anchorNode as Node | null;
    expect(canvas.contains(node as Node)).toBe(true);
  });

  it('Ctrl+A in a chrome search field keeps native select', () => {
    render(<PageWithNav />);
    const search = screen.getByLabelText('Search stories...');
    const prevented = !fireEvent.keyDown(search, { key: 'a', ctrlKey: true });
    expect(prevented).toBe(false);
  });
});

describe('usePostCanvasShortcuts clear document', () => {
  it('clears a native full-document selection without requiring Ctrl+A', () => {
    const clearDocument = vi.fn();
    render(<Harness clearDocument={clearDocument} />);
    const canvas = document.querySelector('[data-post-canvas]') as HTMLElement;
    const range = document.createRange();
    range.selectNodeContents(canvas);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    fireEvent.keyDown(document, { key: 'Backspace' });
    expect(clearDocument).toHaveBeenCalledOnce();
  });

  it('a normal key after Ctrl+A drops the document selection', () => {
    const clearDocument = vi.fn();
    render(<Harness clearDocument={clearDocument} />);
    fireEvent.keyDown(document, { key: 'a', ctrlKey: true });
    fireEvent.keyDown(document, { key: 'x' });
    window.getSelection()?.removeAllRanges();
    fireEvent.keyDown(document, { key: 'Backspace' });
    expect(clearDocument).not.toHaveBeenCalled();
  });

  it('Ctrl+A then Backspace clears the document', () => {
    const clearDocument = vi.fn();
    render(<Harness clearDocument={clearDocument} />);
    fireEvent.keyDown(document, { key: 'a', ctrlKey: true });
    fireEvent.keyDown(document, { key: 'Backspace' });
    expect(clearDocument).toHaveBeenCalled();
  });

  it('keeps full selection actionable after asynchronous selectionchange', () => {
    const clearDocument = vi.fn();
    let frame: FrameRequestCallback = () => {};
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      frame = cb;
      return 1;
    });
    render(<Harness clearDocument={clearDocument} />);
    fireEvent.keyDown(document, { key: 'a', ctrlKey: true });
    frame(0);
    fireEvent(document, new Event('selectionchange'));
    fireEvent.keyDown(document, { key: 'Backspace' });
    expect(clearDocument).toHaveBeenCalledOnce();
  });

  it('handles mobile beforeinput deletion of a full native selection', () => {
    const clearDocument = vi.fn();
    render(<Harness clearDocument={clearDocument} />);
    const canvas = document.querySelector('[data-post-canvas]')!;
    const range = document.createRange();
    range.selectNodeContents(canvas);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    fireEvent(
      canvas,
      new InputEvent('beforeinput', {
        inputType: 'deleteContentBackward',
        bubbles: true,
        cancelable: true,
      })
    );
    expect(clearDocument).toHaveBeenCalledOnce();
  });

  it('does not clear on Preview when no clearer is passed', () => {
    render(<Harness clearDocument={null} />);
    const canvas = document.querySelector('[data-post-canvas]') as HTMLElement;
    const range = document.createRange();
    range.selectNodeContents(canvas);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
    fireEvent.keyDown(document, { key: 'Backspace' });
  });
});
