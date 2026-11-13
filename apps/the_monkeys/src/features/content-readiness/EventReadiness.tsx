'use client';

import { type RefObject, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@the-monkeys/ui/atoms/button';

import { ReadinessPanelLoader } from './ReadinessPanelLoader';
import { toEventSnapshot } from './adapters';
import type { EventReadinessContext, EventReadinessValues } from './types';
import { useReadinessReport } from './useReadinessReport';

export interface EventReadinessProps {
  formRef: RefObject<HTMLFormElement>;
  readValues: () => EventReadinessValues;
  context: Omit<EventReadinessContext, 'revision'>;
}

/** Native values are observed only while open; existing submission handlers stay authoritative. */
export function EventReadiness({
  formRef,
  readValues,
  context,
}: EventReadinessProps) {
  const [open, setOpen] = useState(false);
  const [inputRevision, setInputRevision] = useState(0);
  const revision = useRef(0);
  useEffect(() => {
    const form = formRef.current;
    if (!open || !form) return;
    const changed = () => setInputRevision((value) => value + 1);
    form.addEventListener('input', changed);
    form.addEventListener('change', changed);
    return () => {
      form.removeEventListener('input', changed);
      form.removeEventListener('change', changed);
    };
  }, [open, formRef]);
  const snapshot = useMemo(() => {
    if (!open) return null;
    try {
      return toEventSnapshot(readValues(), {
        ...context,
        revision: ++revision.current + inputRevision,
      });
    } catch {
      return null;
    }
  }, [open, readValues, context, inputRevision]);
  const result = useReadinessReport(snapshot, open);

  return (
    <div data-readiness-entry>
      <Button
        type='button'
        variant='outline'
        className='min-h-11 w-full sm:w-auto'
        onClick={() => setOpen(true)}
      >
        Check readiness
      </Button>
      {open && (
        <ReadinessPanelLoader
          open={open}
          onOpenChange={setOpen}
          state={!snapshot ? 'error' : result.state}
          report={result.report}
          onCheckAgain={() =>
            snapshot
              ? result.checkAgain()
              : setInputRevision((value) => value + 1)
          }
        />
      )}
    </div>
  );
}
