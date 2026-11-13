'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { analyseReadiness } from './analyse';
import type {
  ReadinessIdentity,
  ReadinessReport,
  ReadinessSnapshot,
  ReadinessState,
} from './types';

function sameOwner(a: ReadinessIdentity | null, b: ReadinessIdentity | null) {
  return (
    !!a &&
    !!b &&
    a.resourceKey === b.resourceKey &&
    a.accountKey === b.accountKey
  );
}

function sameRevision(
  a: ReadinessIdentity | null,
  b: ReadinessIdentity | null
) {
  return sameOwner(a, b) && a!.revision === b!.revision;
}

interface Result {
  identity: ReadinessIdentity | null;
  state: ReadinessState;
  report: ReadinessReport | null;
}

const empty: Result = { identity: null, state: 'idle', report: null };

export function useReadinessReport(
  snapshot: ReadinessSnapshot | null,
  open: boolean
): {
  state: ReadinessState;
  report: ReadinessReport | null;
  checkAgain: () => void;
} {
  const [result, setResult] = useState<Result>(empty);
  const latest = useRef({ snapshot, open });
  latest.current = { snapshot, open };
  const mounted = useRef(false);
  const generation = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previous = useRef<{
    identity: ReadinessIdentity | null;
    open: boolean;
  }>({ identity: null, open: false });

  const cancel = useCallback(() => {
    generation.current += 1;
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const checkAgain = useCallback(() => {
    cancel();
    const { snapshot: input, open: isOpen } = latest.current;
    if (!mounted.current || !isOpen || !input) return;
    const run = generation.current;
    const isCurrent = () =>
      mounted.current &&
      latest.current.open &&
      run === generation.current &&
      sameRevision(input, latest.current.snapshot);

    setResult((old) => ({
      identity: input,
      state: 'pending',
      report: sameOwner(old.report, input) ? old.report : null,
    }));
    const failed = () => {
      if (isCurrent()) setResult((old) => ({ ...old, state: 'error' }));
    };
    try {
      // Promise.resolve also guards future asynchronous execution without
      // changing the pure analyser's synchronous public contract.
      void Promise.resolve(analyseReadiness(input)).then((report) => {
        if (!isCurrent()) return;
        if (!sameRevision(report, input)) {
          failed();
          return;
        }
        setResult({ identity: input, state: 'current', report });
      }, failed);
    } catch {
      failed();
    }
  }, [cancel]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      cancel();
    };
  }, [cancel]);

  const resourceKey = snapshot?.resourceKey;
  const accountKey = snapshot?.accountKey;
  const revision = snapshot?.revision;
  useEffect(() => {
    const input = latest.current.snapshot;
    const before = previous.current;
    previous.current = { identity: input, open };
    if (!input) setResult(empty);
    else if (!open) {
      setResult((old) => (sameOwner(old.identity, input) ? old : empty));
    } else if (!before.open || !sameOwner(before.identity, input)) {
      checkAgain();
    } else {
      timer.current = setTimeout(checkAgain, 800);
    }
    return cancel;
  }, [open, resourceKey, accountKey, revision, cancel, checkAgain]);

  // Derive invalidation during render so a parent cannot briefly see an old
  // account's report or treat an old revision as current before effects run.
  const report = sameOwner(result.report, snapshot) ? result.report : null;
  let state: ReadinessState = result.state;
  if (!snapshot) state = 'idle';
  else if (!sameRevision(result.identity, snapshot))
    state = report ? 'stale' : open ? 'pending' : 'idle';
  else if (!open && state === 'pending') state = report ? 'stale' : 'idle';
  return { state, report, checkAgain };
}
