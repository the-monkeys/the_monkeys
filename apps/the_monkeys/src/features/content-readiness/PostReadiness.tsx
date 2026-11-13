'use client';

import { useMemo, useRef, useState } from 'react';

import { Button } from '@the-monkeys/ui/atoms/button';

import { ReadinessPanelLoader } from './ReadinessPanelLoader';
import { toPostSnapshot } from './adapters';
import type { PostReadinessContext } from './types';
import { useReadinessReport } from './useReadinessReport';

export interface PostReadinessProps
  extends Omit<PostReadinessContext, 'revision'> {
  document: unknown;
}

/** Observes parent state; deliberately has no editor/save/publish capability. */
export function PostReadiness({
  document,
  resourceKey,
  accountKey,
  topics,
  audience,
  publicationState,
  authorName,
  imagePending,
  groupSlug,
  groupVisibility,
  groupResolved,
}: PostReadinessProps) {
  const [open, setOpen] = useState(false);
  const [retry, setRetry] = useState(0);
  const revision = useRef(0);
  const snapshot = useMemo(() => {
    if (!open) return null;
    try {
      return toPostSnapshot(document, {
        resourceKey,
        accountKey,
        revision: ++revision.current + retry,
        topics,
        audience,
        publicationState,
        authorName,
        imagePending,
        groupSlug,
        groupVisibility,
        groupResolved,
      });
    } catch {
      return null;
    }
  }, [
    open,
    document,
    resourceKey,
    accountKey,
    topics,
    audience,
    publicationState,
    authorName,
    imagePending,
    groupSlug,
    groupVisibility,
    groupResolved,
    retry,
  ]);
  const result = useReadinessReport(snapshot, open);
  const state = open && !snapshot ? 'error' : result.state;

  return (
    <>
      <Button
        type='button'
        variant='outline'
        size='sm'
        className='min-h-11 shrink-0 whitespace-nowrap'
        onClick={() => setOpen(true)}
      >
        Check readiness
      </Button>
      {open && (
        <ReadinessPanelLoader
          open={open}
          onOpenChange={setOpen}
          state={state}
          report={result.report}
          onCheckAgain={() =>
            snapshot ? result.checkAgain() : setRetry((value) => value + 1)
          }
        />
      )}
    </>
  );
}
