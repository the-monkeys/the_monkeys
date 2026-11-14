import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PostReadiness } from './PostReadiness';

vi.mock('./ReadinessPanel', () => ({
  ReadinessPanel: ({ open, state, report, onOpenChange, onCheckAgain }: any) =>
    open ? (
      <div role='dialog' aria-label='Search and AI readiness'>
        <span>{state}</span>
        <output>{report?.preview?.title}</output>
        <button onClick={onCheckAgain}>Check again</button>
        <button onClick={() => onOpenChange(false)}>Close readiness</button>
      </div>
    ) : null,
}));

afterEach(cleanup);
const document = {
  blocks: [
    {
      id: 'title',
      type: 'header',
      data: { text: 'Legacy-safe post', level: 1 },
    },
    {
      type: 'paragraph',
      data: {
        text: 'A substantial introduction explains a subject clearly and helps readers.',
      },
    },
  ],
};
const props = {
  resourceKey: 'draft-1',
  accountKey: 'creator-1',
  document,
  topics: ['Community'],
  audience: 'public',
};

describe('creator readiness entry', () => {
  it('keeps the document untouched when a creator opens and closes a report', async () => {
    const before = JSON.stringify(document);
    render(<PostReadiness {...props} />);
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Check readiness' }));
    await screen.findByRole('dialog', { name: 'Search and AI readiness' });
    await waitFor(() =>
      expect(screen.getByRole('dialog').textContent).toContain(
        'Legacy-safe post'
      )
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close readiness' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(JSON.stringify(document)).toBe(before);
  });

  it('updates the report for a changed parent document without writing it back', async () => {
    const view = render(<PostReadiness {...props} />);
    fireEvent.click(screen.getByRole('button', { name: 'Check readiness' }));
    await waitFor(() =>
      expect(screen.getByRole('dialog').textContent).toContain(
        'Legacy-safe post'
      )
    );
    const next = {
      ...document,
      blocks: [
        { ...document.blocks[0], data: { text: 'New title', level: 1 } },
        document.blocks[1],
      ],
    };
    view.rerender(<PostReadiness {...props} document={next} />);
    await waitFor(() =>
      expect(screen.getByRole('dialog').textContent).toContain('stale')
    );
    await waitFor(
      () =>
        expect(screen.getByRole('dialog').textContent).toContain('New title'),
      { timeout: 2500 }
    );
    expect(document.blocks[0].data.text).toBe('Legacy-safe post');
  });

  it('does not analyse or transmit a draft before the report is opened', () => {
    const reads = vi.fn();
    const unreadDocument = {
      get blocks() {
        reads();
        return document.blocks;
      },
    };
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    render(<PostReadiness {...props} document={unreadDocument} />);
    expect(reads).not.toHaveBeenCalled();
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('can retry an input extraction failure without closing the report or losing the document', async () => {
    let shouldFail = true;
    const input = {
      get blocks() {
        if (shouldFail) throw new Error('Local extraction failed');
        return document.blocks;
      },
    };
    render(<PostReadiness {...props} document={input} />);
    fireEvent.click(screen.getByRole('button', { name: 'Check readiness' }));
    await waitFor(() =>
      expect(screen.getByRole('dialog').textContent).toContain('error')
    );
    shouldFail = false;
    fireEvent.click(screen.getByRole('button', { name: 'Check again' }));
    await waitFor(() =>
      expect(screen.getByRole('dialog').textContent).toContain(
        'Legacy-safe post'
      )
    );
  });
});
