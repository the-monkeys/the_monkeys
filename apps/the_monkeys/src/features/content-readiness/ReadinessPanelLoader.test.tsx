import { Component, type ReactNode, useEffect, useState } from 'react';

import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PostReadiness } from './PostReadiness';
import type { ReadinessPanelProps } from './ReadinessPanel';
import { ReadinessPanelLoader } from './ReadinessPanelLoader';
import * as adapters from './adapters';
import type { PostReadinessContext, ReadinessSnapshot } from './types';

vi.mock('./ReadinessPanel', () => ({
  ReadinessPanel: ({
    state,
    report,
    onOpenChange,
    onCheckAgain,
  }: ReadinessPanelProps) => (
    <section aria-label='Loaded readiness report'>
      <p>{state}</p>
      <p>{report?.visibility}</p>
      <button type='button' onClick={onCheckAgain}>
        Check again
      </button>
      <button type='button' onClick={() => onOpenChange(false)}>
        Close loaded report
      </button>
    </section>
  ),
}));

function LoadedPanel({
  state,
  onOpenChange,
  onCheckAgain,
}: ReadinessPanelProps) {
  return (
    <section aria-label='Loaded readiness report'>
      <p>{state}</p>
      <button type='button' onClick={onCheckAgain}>
        Check again
      </button>
      <button type='button' onClick={() => onOpenChange(false)}>
        Close loaded report
      </button>
    </section>
  );
}

type PanelModule = { ReadinessPanel: typeof LoadedPanel };
type LoadPanel = () => Promise<PanelModule>;
function deferred() {
  let resolve!: (value: PanelModule) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<PanelModule>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

const pageFailure = vi.fn();
const editorUnmount = vi.fn();
class PageBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    pageFailure();
  }
  render() {
    return this.state.failed ? <p>Page unavailable</p> : this.props.children;
  }
}

function Editor() {
  const [draft, setDraft] = useState('Unsaved original draft');
  useEffect(
    () => () => {
      editorUnmount();
    },
    []
  );
  return (
    <label>
      Draft
      <input value={draft} onChange={(event) => setDraft(event.target.value)} />
    </label>
  );
}

function Host({ loadPanel }: { loadPanel: LoadPanel }) {
  const [open, setOpen] = useState(true);
  return (
    <PageBoundary>
      <Editor />
      <button type='button' onClick={() => setOpen(true)}>
        Open readiness
      </button>
      {open && (
        <ReadinessPanelLoader
          open
          onOpenChange={setOpen}
          state='current'
          report={null}
          onCheckAgain={() => {}}
          loadPanel={loadPanel}
        />
      )}
    </PageBoundary>
  );
}

async function fail(pending: ReturnType<typeof deferred>) {
  await act(async () => {
    pending.reject(new Error('ChunkLoadError: offline internal detail'));
  });
}

beforeEach(() => {
  pageFailure.mockClear();
  editorUnmount.mockClear();
  // React intentionally reports caught render/lazy failures in development.
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('ReadinessPanelLoader failure isolation', () => {
  it('contains the first offline chunk rejection and preserves the editor and unsaved state', async () => {
    const pending = deferred();
    const loadPanel = vi.fn(() => pending.promise);
    render(<Host loadPanel={loadPanel} />);
    const draft = screen.getByRole('textbox', { name: 'Draft' });
    fireEvent.change(draft, { target: { value: 'My unsaved changes' } });
    await fail(pending);
    expect(pageFailure).not.toHaveBeenCalled();
    expect(
      await screen.findByRole('button', { name: 'Retry readiness report' })
    ).toBeTruthy();
    expect(screen.getByRole('alert').textContent).toMatch(
      /free.*editing.*saving/i
    );
    expect(screen.getByRole('alert').textContent).not.toContain(
      'ChunkLoadError'
    );
    expect(screen.getByRole('textbox', { name: 'Draft' })).toBe(draft);
    expect((draft as HTMLInputElement).value).toBe('My unsaved changes');
    fireEvent.change(draft, { target: { value: 'Still writing offline' } });
    expect((draft as HTMLInputElement).value).toBe('Still writing offline');
    expect(editorUnmount).not.toHaveBeenCalled();
    expect(pageFailure).not.toHaveBeenCalled();
    expect(loadPanel).toHaveBeenCalledTimes(1);
  });

  it('creates a fresh lazy attempt on retry and succeeds without remounting the editor', async () => {
    const first = deferred(),
      second = deferred();
    const loadPanel = vi
      .fn<LoadPanel>()
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise);
    render(<Host loadPanel={loadPanel} />);
    const draft = screen.getByRole('textbox', { name: 'Draft' });
    fireEvent.change(draft, { target: { value: 'Keep my work' } });
    await fail(first);
    fireEvent.click(
      await screen.findByRole('button', { name: 'Retry readiness report' })
    );
    expect(loadPanel).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('status').textContent).toMatch(
      /loading readiness report/i
    );
    await act(async () => second.resolve({ ReadinessPanel: LoadedPanel }));
    expect(
      await screen.findByRole('region', { name: 'Loaded readiness report' })
    ).toBeTruthy();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByRole('textbox', { name: 'Draft' })).toBe(draft);
    expect((draft as HTMLInputElement).value).toBe('Keep my work');
    expect(editorUnmount).not.toHaveBeenCalled();
    expect(pageFailure).not.toHaveBeenCalled();
  });

  it.each(['loading', 'failed'])(
    'keeps Close usable while %s without submitting or losing the editor',
    async (phase) => {
      const pending = deferred();
      render(<Host loadPanel={() => pending.promise} />);
      const draft = screen.getByRole('textbox', { name: 'Draft' });
      if (phase === 'failed') await fail(pending);
      const close = screen.getByRole('button', { name: 'Close' });
      expect(close.getAttribute('type')).toBe('button');
      fireEvent.click(close);
      expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
      expect(
        screen.queryByRole('button', { name: 'Retry readiness report' })
      ).toBeNull();
      expect(screen.getByRole('textbox', { name: 'Draft' })).toBe(draft);
      expect(editorUnmount).not.toHaveBeenCalled();
      expect(pageFailure).not.toHaveBeenCalled();
    }
  );

  it.each(['resolve', 'reject'])(
    'ignores an old chunk %s after close/unmount and reopen',
    async (outcome) => {
      const old = deferred(),
        current = deferred();
      const loadPanel = vi
        .fn<LoadPanel>()
        .mockReturnValueOnce(old.promise)
        .mockReturnValueOnce(current.promise);
      const oldPanel = vi.fn(LoadedPanel);
      render(<Host loadPanel={loadPanel} />);
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
      fireEvent.click(screen.getByRole('button', { name: 'Open readiness' }));
      expect(loadPanel).toHaveBeenCalledTimes(2);
      await act(async () => {
        if (outcome === 'resolve') old.resolve({ ReadinessPanel: oldPanel });
        else old.reject(new Error('Old offline failure'));
      });
      expect(screen.getByRole('status').textContent).toMatch(
        /loading readiness report/i
      );
      expect(screen.queryByRole('alert')).toBeNull();
      expect(oldPanel).not.toHaveBeenCalled();
      await act(async () => current.resolve({ ReadinessPanel: LoadedPanel }));
      expect(
        await screen.findByRole('region', { name: 'Loaded readiness report' })
      ).toBeTruthy();
      expect(pageFailure).not.toHaveBeenCalled();
      expect(editorUnmount).not.toHaveBeenCalled();
    }
  );

  it.each(['factory', 'render'])(
    'contains a synchronous %s failure and can retry it',
    async (source) => {
      function BrokenPanel(): never {
        throw new Error('Readiness rendering failed');
      }
      const loadPanel = vi.fn<LoadPanel>();
      if (source === 'factory')
        loadPanel.mockImplementationOnce(() => {
          throw new Error('Cannot start chunk');
        });
      else loadPanel.mockResolvedValueOnce({ ReadinessPanel: BrokenPanel });
      loadPanel.mockResolvedValue({ ReadinessPanel: LoadedPanel });
      render(<Host loadPanel={loadPanel} />);
      fireEvent.click(
        await screen.findByRole('button', { name: 'Retry readiness report' })
      );
      expect(
        await screen.findByRole('region', { name: 'Loaded readiness report' })
      ).toBeTruthy();
      expect(pageFailure).not.toHaveBeenCalled();
      expect(editorUnmount).not.toHaveBeenCalled();
    }
  );

  it('offers themed, non-submitting 44px error controls without a payment gate', async () => {
    const submit = vi.fn();
    render(
      <PageBoundary>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <ReadinessPanelLoader
            open
            state='idle'
            report={null}
            onOpenChange={() => {}}
            onCheckAgain={() => {}}
            loadPanel={() => Promise.reject(new Error('offline'))}
          />
        </form>
      </PageBoundary>
    );
    const retry = await screen.findByRole('button', {
      name: 'Retry readiness report',
    });
    for (const button of [
      retry,
      screen.getByRole('button', { name: 'Close' }),
    ]) {
      expect(button.getAttribute('type')).toBe('button');
      expect(button.className).toContain('min-h-11');
      expect(button.className).toContain('min-w-11');
      fireEvent.click(button);
    }
    expect(submit).not.toHaveBeenCalled();
    expect(document.body.textContent).not.toMatch(
      /upgrade|subscribe|payment|credits/i
    );
  });

  it('does not request the panel while closed', () => {
    const loadPanel = vi.fn<LoadPanel>();
    render(
      <ReadinessPanelLoader
        open={false}
        state='idle'
        report={null}
        onOpenChange={() => {}}
        onCheckAgain={() => {}}
        loadPanel={loadPanel}
      />
    );
    expect(loadPanel).not.toHaveBeenCalled();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('passes current props and callbacks when a pending chunk finally loads', async () => {
    const pending = deferred(),
      checkAgain = vi.fn(),
      onOpenChange = vi.fn();
    const loadPanel = () => pending.promise;
    const view = render(
      <ReadinessPanelLoader
        open
        state='pending'
        report={null}
        onOpenChange={onOpenChange}
        onCheckAgain={checkAgain}
        loadPanel={loadPanel}
      />
    );
    view.rerender(
      <ReadinessPanelLoader
        open
        state='stale'
        report={null}
        onOpenChange={onOpenChange}
        onCheckAgain={checkAgain}
        loadPanel={loadPanel}
      />
    );
    await act(async () => pending.resolve({ ReadinessPanel: LoadedPanel }));
    expect(await screen.findByText('stale')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Check again' }));
    expect(checkAgain).toHaveBeenCalledOnce();
    fireEvent.click(
      screen.getByRole('button', { name: 'Close loaded report' })
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe('PostReadiness group context plumbing', () => {
  it('passes groupSlug, groupVisibility and groupResolved and refreshes when each changes', async () => {
    const contexts: PostReadinessContext[] = [];
    vi.spyOn(adapters, 'toPostSnapshot').mockImplementation(
      (_document, context): ReadinessSnapshot => {
        contexts.push(context);
        return {
          ...context,
          kind: 'post',
          publicationState: 'draft',
          visibility: 'unknown',
          title: 'Draft',
          description: 'Context',
          bodyText: '',
          topics: [],
          headings: [],
          images: [],
          links: [],
          hasIntroduction: false,
          hasSections: false,
          sourceCount: 0,
          hasMethodology: false,
          hasDataset: false,
          extraction: {
            partial: false,
            reasons: [],
            sourceCoverageKnown: true,
          },
          preview: null,
        };
      }
    );
    const input = {
      document: {},
      resourceKey: 'draft',
      accountKey: 'ada',
      groupSlug: 'first-group',
      groupVisibility: 'private',
      groupResolved: true,
    };
    const view = render(<PostReadiness {...input} />);
    fireEvent.click(screen.getByRole('button', { name: 'Check readiness' }));
    await screen.findByRole('region', { name: 'Loaded readiness report' });
    expect(contexts.at(-1)).toMatchObject({
      groupSlug: 'first-group',
      groupVisibility: 'private',
      groupResolved: true,
    });
    view.rerender(<PostReadiness {...input} groupSlug='second-group' />);
    await waitFor(() =>
      expect(contexts.at(-1)?.groupSlug).toBe('second-group')
    );
    view.rerender(
      <PostReadiness
        {...input}
        groupSlug='second-group'
        groupVisibility='public'
      />
    );
    await waitFor(() =>
      expect(contexts.at(-1)?.groupVisibility).toBe('public')
    );
    view.rerender(
      <PostReadiness
        {...input}
        groupSlug='second-group'
        groupVisibility='public'
        groupResolved={false}
      />
    );
    await waitFor(() => expect(contexts.at(-1)?.groupResolved).toBe(false));
  });
});
