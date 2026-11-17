'use client';

import { useMemo, useRef, useState } from 'react';

import { editorToolClass } from '@/components/editor/editorToolClass';
import Icon from '@/components/icon';
import { Button } from '@the-monkeys/ui/atoms/button';

import { ReadinessPanelLoader } from './ReadinessPanelLoader';
import { toPostSnapshot } from './adapters';
import type { PostReadinessContext } from './types';
import { useReadinessReport } from './useReadinessReport';

export interface PostReadinessProps
  extends Omit<PostReadinessContext, 'revision'> {
  document: unknown;
  presentation?: 'button' | 'toolbar';
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
  presentation = 'button',
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
        variant={presentation === 'toolbar' ? 'ghost' : 'outline'}
        size='sm'
        className={
          presentation === 'toolbar'
            ? `${editorToolClass} shrink-0 max-w-full whitespace-normal aria-expanded:text-text-light dark:aria-expanded:text-text-dark aria-expanded:after:bg-brand-orange [&[aria-expanded=true]_svg]:text-brand-orange`
            : 'min-h-11 shrink-0 whitespace-nowrap'
        }
        aria-haspopup='dialog'
        aria-expanded={open}
        title={
          presentation === 'toolbar' ? 'Review publishing readiness' : undefined
        }
        onClick={() => setOpen(true)}
      >
        {presentation === 'toolbar' ? (
          <>
            <span aria-hidden='true'>
              <Icon name='RiSearch' size={16} />
            </span>
            Publishing readiness
          </>
        ) : (
          'Publishing readiness'
        )}
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
