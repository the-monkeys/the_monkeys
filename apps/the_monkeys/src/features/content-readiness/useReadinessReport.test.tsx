import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ReadinessReport, ReadinessSnapshot } from './types';
import { useReadinessReport } from './useReadinessReport';

const { analyse } = vi.hoisted(() => ({ analyse: vi.fn() }));
vi.mock('./analyse', () => ({ analyseReadiness: analyse }));

function snapshot(
  overrides: Partial<ReadinessSnapshot> = {}
): ReadinessSnapshot {
  return {
    resourceKey: 'post:one',
    accountKey: 'ada',
    revision: 1,
    kind: 'post',
    publicationState: 'draft',
    visibility: 'public',
    title: 'A clear title',
    description: 'Useful context',
    bodyText: 'Unsaved writing',
    topics: [],
    headings: [],
    images: [],
    links: [],
    hasIntroduction: true,
    hasSections: false,
    sourceCount: 0,
    hasMethodology: false,
    hasDataset: false,
    extraction: { partial: false, reasons: [], sourceCoverageKnown: true },
    preview: null,
    ...overrides,
  };
}

function report(input: ReadinessSnapshot): ReadinessReport {
  return {
    resourceKey: input.resourceKey,
    accountKey: input.accountKey,
    revision: input.revision,
    rulesVersion: 'creator-event-v1',
    kind: input.kind,
    publicationState: input.publicationState,
    seoScore: 100,
    passedCount: 2,
    applicableKnownCount: 2,
    coverage: 'complete',
    visibility: input.visibility,
    checks: [],
    preview: input.preview,
    coverageReasons: [],
  };
}

function deferred() {
  let resolve!: (value: ReadinessReport) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<ReadinessReport>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  // Keep a failing/no-op implementation from producing a runner-level rejection.
  void promise.catch(() => {});
  return { promise, resolve, reject };
}

async function settle() {
  await act(async () => {
    await Promise.resolve();
  });
}
async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  analyse.mockReset().mockImplementation(report);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('useReadinessReport', () => {
  it('does no work while closed or without a snapshot, including manual retry', async () => {
    const { result, rerender } = renderHook(
      ({ input, open }) => useReadinessReport(input, open),
      {
        initialProps: {
          input: snapshot() as ReadinessSnapshot | null,
          open: false,
        },
      }
    );
    act(() => result.current.checkAgain());
    await advance(2000);
    expect(analyse).not.toHaveBeenCalled();
    expect(result.current).toMatchObject({ state: 'idle', report: null });
    rerender({ input: null, open: true });
    act(() => result.current.checkAgain());
    await advance(2000);
    expect(analyse).not.toHaveBeenCalled();
  });

  it('checks immediately on opening and uses the newest values for Check again', async () => {
    const input = snapshot();
    const { result, rerender } = renderHook(
      ({ input, open }) => useReadinessReport(input, open),
      {
        initialProps: { input, open: false },
      }
    );
    rerender({ input, open: true });
    await settle();
    expect(analyse).toHaveBeenCalledTimes(1);
    expect(result.current).toMatchObject({
      state: 'current',
      report: { revision: 1 },
    });
    const edited = snapshot({ revision: 2, title: 'New unsaved title' });
    rerender({ input: edited, open: true });
    act(() => result.current.checkAgain());
    await settle();
    expect(analyse).toHaveBeenLastCalledWith(edited);
    expect(result.current).toMatchObject({
      state: 'current',
      report: { revision: 2 },
    });
    await advance(1000);
    expect(analyse).toHaveBeenCalledTimes(2);
  });

  it('marks old results stale immediately and coalesces edits after 800ms', async () => {
    const { result, rerender } = renderHook(
      ({ input }) => useReadinessReport(input, true),
      {
        initialProps: { input: snapshot() },
      }
    );
    await settle();
    rerender({ input: snapshot({ revision: 2 }) });
    expect(result.current).toMatchObject({
      state: 'stale',
      report: { revision: 1 },
    });
    await advance(500);
    rerender({ input: snapshot({ revision: 3 }) });
    await advance(799);
    expect(analyse).toHaveBeenCalledTimes(1);
    expect(result.current.state).toBe('stale');
    await advance(1);
    expect(analyse).toHaveBeenCalledTimes(2);
    expect(result.current).toMatchObject({
      state: 'current',
      report: { revision: 3 },
    });
  });

  it('does not restart a scheduled check for a new snapshot object with the same identity', async () => {
    const { result, rerender } = renderHook(
      ({ input }) => useReadinessReport(input, true),
      {
        initialProps: { input: snapshot() },
      }
    );
    await settle();
    rerender({ input: snapshot({ revision: 2 }) });
    await advance(400);
    rerender({ input: snapshot({ revision: 2 }) });
    await advance(400);
    expect(result.current).toMatchObject({
      state: 'current',
      report: { revision: 2 },
    });
    expect(analyse).toHaveBeenCalledTimes(2);
  });

  it('cancels pending work on close and checks immediately on reopening', async () => {
    const { result, rerender } = renderHook(
      ({ input, open }) => useReadinessReport(input, open),
      {
        initialProps: { input: snapshot(), open: true },
      }
    );
    await settle();
    const edited = snapshot({ revision: 2 });
    rerender({ input: edited, open: true });
    rerender({ input: edited, open: false });
    await advance(1500);
    expect(analyse).toHaveBeenCalledTimes(1);
    rerender({ input: edited, open: true });
    await settle();
    expect(result.current).toMatchObject({
      state: 'current',
      report: { revision: 2 },
    });
  });

  it('cancels scheduled work on unmount', async () => {
    const { rerender, unmount } = renderHook(
      ({ input }) => useReadinessReport(input, true),
      {
        initialProps: { input: snapshot() },
      }
    );
    await settle();
    rerender({ input: snapshot({ revision: 2 }) });
    unmount();
    await advance(2000);
    expect(analyse).toHaveBeenCalledTimes(1);
  });

  it('ignores a late result from an earlier revision', async () => {
    const first = deferred();
    analyse.mockReturnValueOnce(first.promise);
    const { result, rerender } = renderHook(
      ({ input }) => useReadinessReport(input, true),
      {
        initialProps: { input: snapshot() },
      }
    );
    expect(result.current.state).toBe('pending');
    rerender({ input: snapshot({ revision: 2 }) });
    await advance(800);
    await act(async () => first.resolve(report(snapshot())));
    expect(result.current).toMatchObject({
      state: 'current',
      report: { revision: 2 },
    });
  });

  it.each([{ resourceKey: 'post:two' }, { accountKey: 'grace' }])(
    'clears visible results and rejects previous identity work for %j',
    async (identity) => {
      const pending = deferred();
      const { result, rerender } = renderHook(
        ({ input }) => useReadinessReport(input, true),
        {
          initialProps: { input: snapshot() },
        }
      );
      await settle();
      analyse.mockReturnValueOnce(pending.promise);
      act(() => result.current.checkAgain());
      const next = snapshot(identity);
      const nextPending = deferred();
      analyse.mockReturnValueOnce(nextPending.promise);
      rerender({ input: next });
      expect(result.current.report).toBeNull();
      await act(async () => pending.resolve(report(snapshot())));
      expect(result.current.report).toBeNull();
      await act(async () => nextPending.resolve(report(next)));
      expect(result.current).toMatchObject({
        state: 'current',
        report: identity,
      });
    }
  );

  it('ignores late completions after closing and clears reports on null input', async () => {
    const pending = deferred();
    analyse.mockReturnValueOnce(pending.promise);
    const { result, rerender } = renderHook(
      ({ input, open }) => useReadinessReport(input, open),
      {
        initialProps: {
          input: snapshot() as ReadinessSnapshot | null,
          open: true,
        },
      }
    );
    rerender({ input: snapshot(), open: false });
    await act(async () => pending.resolve(report(snapshot())));
    expect(result.current.report).toBeNull();
    rerender({ input: snapshot(), open: true });
    await settle();
    rerender({ input: null, open: true });
    expect(result.current).toMatchObject({ state: 'idle', report: null });
  });

  it('keeps only the latest manual check when the same identity has overlapping runs', async () => {
    const old = deferred();
    analyse.mockReturnValueOnce(old.promise);
    const { result } = renderHook(() => useReadinessReport(snapshot(), true));
    act(() => result.current.checkAgain());
    await settle();
    await act(async () => old.reject(new Error('old failure')));
    expect(result.current.state).toBe('current');
  });

  it.each(['throw', 'reject'])(
    'contains an analysis %s, retains the report and supports local retry',
    async (mode) => {
      const { result } = renderHook(() => useReadinessReport(snapshot(), true));
      await settle();
      if (mode === 'throw')
        analyse.mockImplementationOnce(() => {
          throw new Error('private draft');
        });
      else analyse.mockRejectedValueOnce(new Error('private draft'));
      const log = vi.spyOn(console, 'error');
      act(() => result.current.checkAgain());
      await settle();
      expect(result.current).toMatchObject({
        state: 'error',
        report: { revision: 1 },
      });
      expect(log).not.toHaveBeenCalled();
      act(() => result.current.checkAgain());
      await settle();
      expect(result.current.state).toBe('current');
    }
  );
});
