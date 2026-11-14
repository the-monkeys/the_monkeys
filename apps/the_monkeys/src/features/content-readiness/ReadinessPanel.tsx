'use client';

import { useRef } from 'react';

import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@the-monkeys/ui/atoms/drawer';

import type { CheckStatus, ReadinessReport, ReadinessState } from './types';

export interface ReadinessPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: ReadinessState;
  report: ReadinessReport | null;
  onCheckAgain: () => void;
  onGoToField?: (fieldKey: string) => void;
}

const buttonClass =
  'min-h-11 min-w-11 h-auto whitespace-normal px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2';

const statusLabels: Record<CheckStatus, string> = {
  pass: 'Passed',
  improve: 'Improve',
  manual: 'Human review',
  unknown: 'Unknown',
  'not-applicable': 'Not applicable',
};

const sections = [
  {
    key: 'seo',
    label: 'SEO',
    description: 'An automated checklist of page basics.',
  },
  {
    key: 'answers',
    label: 'Answer readiness',
    description: 'Observations and human review of useful context and answers.',
  },
  {
    key: 'sources',
    label: 'Source clarity',
    description:
      'Review attribution and supporting information. A source link does not prove accuracy or authority.',
  },
] as const;

function publicPreviewUrl(value?: string) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash
      ? value
      : null;
  } catch {
    return null;
  }
}

export function ReadinessPanel({
  open,
  onOpenChange,
  state,
  report,
  onCheckAgain,
  onGoToField,
}: ReadinessPanelProps) {
  const opener = useRef<HTMLElement | null>(null);
  const goToField = useRef<string | null>(null);
  const preview =
    report?.visibility === 'public' && report.coverage === 'complete'
      ? report.preview
      : null;
  const previewUrl = publicPreviewUrl(preview?.url);
  const partial =
    report?.coverage === 'partial' ||
    report?.checks.some((check) => check.status === 'unknown');
  const message =
    state === 'stale'
      ? 'Content changed. Check again.'
      : state === 'pending'
        ? 'Checking readiness…'
        : state === 'error'
          ? 'Could not check readiness. Try Check again. Editing, saving and publishing remain available.'
          : state === 'idle' || !report
            ? 'Add content, then check readiness to see suggestions. You can keep writing and save normally.'
            : null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} autoFocus>
      <DrawerContent
        className='mx-auto w-full max-w-2xl max-h-[90dvh] data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:max-h-[90dvh] overflow-hidden text-text-light dark:text-text-dark font-dm_sans'
        onOpenAutoFocus={() => {
          // The authoring entry owns the trigger outside this Drawer root.
          opener.current =
            document.activeElement instanceof HTMLElement
              ? document.activeElement
              : null;
          goToField.current = null;
        }}
        onCloseAutoFocus={(event) => {
          if (goToField.current && onGoToField) {
            event.preventDefault();
            const field = goToField.current;
            goToField.current = null;
            onGoToField(field);
          } else if (opener.current?.isConnected) {
            event.preventDefault();
            opener.current.focus();
          }
        }}
      >
        <DrawerHeader className='shrink-0 text-left'>
          <div className='flex items-start justify-between gap-3'>
            <DrawerTitle>Search and AI readiness</DrawerTitle>
            <DrawerClose asChild>
              <Button
                type='button'
                variant='ghost'
                className={buttonClass}
                aria-label='Close readiness report'
              >
                Close
              </Button>
            </DrawerClose>
          </div>
          <DrawerDescription>
            Optional, free guidance for your content. Suggestions never block
            saving or publishing.
          </DrawerDescription>
        </DrawerHeader>
        <div
          className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 [overflow-wrap:anywhere]'
          tabIndex={0}
          role='region'
          aria-label='Readiness report details'
        >
          {/* Stale text deliberately has no live region: edits must stay quiet. */}
          {message && (
            <p className='mb-4 rounded-lg bg-foreground-light dark:bg-foreground-dark p-3 text-sm'>
              {message}
            </p>
          )}
          {state === 'error' && report && (
            <p className='mb-4 text-sm'>
              The previous report may be out of date.
            </p>
          )}
          {report && (
            <>
              <p className='mb-3 text-sm'>
                {report.kind === 'event' ? 'Event' : 'Post'}{' '}
                {report.publicationState === 'draft'
                  ? 'draft preview'
                  : 'published-content preview'}
              </p>
              <div className='mb-5 rounded-lg border border-border-light dark:border-border-dark p-3 text-sm'>
                <p className='font-medium'>
                  {report.visibility === 'restricted'
                    ? 'Not intended for public search'
                    : report.visibility === 'unknown'
                      ? 'Public search visibility is unknown'
                      : report.publicationState === 'draft'
                        ? 'Intended for public search after publishing'
                        : 'A public setting does not confirm indexing'}
                </p>
                <p className='mt-1'>
                  Visibility is separate from content quality. Search engines
                  decide whether to index a public page.
                </p>
              </div>
              {sections.map((section) => (
                <section
                  key={section.key}
                  aria-label={section.label}
                  className='mb-6'
                >
                  <h3 className='text-lg font-medium'>{section.label}</h3>
                  <p className='mt-1 text-sm'>{section.description}</p>
                  {section.key === 'seo' && (
                    <div className='my-3 rounded-lg bg-foreground-light dark:bg-foreground-dark p-3'>
                      <p className='font-medium'>Monkeys readiness estimate</p>
                      <p className='mt-1 text-xl font-medium'>
                        {report.seoScore === null
                          ? 'No automated estimate available'
                          : `${report.seoScore}/100`}
                      </p>
                      <p className='mt-1 text-sm'>
                        {report.passedCount} of {report.applicableKnownCount}{' '}
                        automated checks passed
                      </p>
                      {partial && (
                        <p className='mt-2 font-medium'>Partial check</p>
                      )}
                      <p className='mt-2 text-sm'>
                        This automated SEO estimate covers known applicable
                        checks only. Unknown, human review and not applicable
                        items are excluded.
                      </p>
                      <p className='mt-2 text-sm'>
                        It does not predict search ranking, indexing, traffic,
                        registrations or AI citations.
                      </p>
                      {report.coverageReasons.length > 0 && (
                        <ul className='mt-2 list-disc space-y-1 pl-5 text-sm'>
                          {report.coverageReasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                  <ul className='mt-3 space-y-3'>
                    {report.checks
                      .filter((check) => check.section === section.key)
                      .map((check) => (
                        <li
                          key={check.id}
                          className='rounded-lg border border-border-light dark:border-border-dark p-3'
                        >
                          <div className='flex flex-wrap items-baseline justify-between gap-2'>
                            <h4 className='font-medium'>{check.label}</h4>
                            <span className='text-sm font-medium'>
                              {statusLabels[check.status]}
                            </span>
                          </div>
                          <p className='mt-2 text-sm whitespace-pre-wrap'>
                            {check.finding}
                          </p>
                          <p className='mt-1 text-sm whitespace-pre-wrap'>
                            {check.reason}
                          </p>
                          {onGoToField &&
                            check.fieldKey &&
                            check.status !== 'pass' &&
                            check.status !== 'not-applicable' && (
                              <Button
                                type='button'
                                variant='outline'
                                className={`${buttonClass} mt-3`}
                                aria-label={`Go to field: ${check.label}`}
                                onClick={() => {
                                  goToField.current = check.fieldKey!;
                                  onOpenChange(false);
                                }}
                              >
                                Go to field
                              </Button>
                            )}
                        </li>
                      ))}
                  </ul>
                  {!report.checks.some(
                    (check) => check.section === section.key
                  ) && (
                    <p className='mt-3 text-sm'>
                      No findings available for this section. Review the content
                      yourself.
                    </p>
                  )}
                </section>
              ))}
              <section aria-label='Search-result preview' className='mb-4'>
                <h3 className='text-lg font-medium'>Search-result preview</h3>
                <p className='mt-1 text-sm'>
                  A preview of supplied page information. Search services may
                  display different text.
                </p>
                {preview ? (
                  <div className='mt-3 rounded-lg border border-border-light dark:border-border-dark p-3'>
                    {previewUrl && <p className='text-sm'>{previewUrl}</p>}
                    <p className='mt-1 font-medium whitespace-pre-wrap'>
                      {preview.title}
                    </p>
                    <p className='mt-1 text-sm whitespace-pre-wrap'>
                      {preview.description}
                    </p>
                  </div>
                ) : (
                  <p className='mt-3 text-sm'>
                    Search preview is unavailable for this content or its
                    current coverage and visibility.
                  </p>
                )}
              </section>
            </>
          )}
        </div>
        <div className='shrink-0 border-t border-border-light dark:border-border-dark p-4 pb-[max(1rem,env(safe-area-inset-bottom))]'>
          <Button
            type='button'
            variant='brand'
            className={`${buttonClass} w-full`}
            onClick={onCheckAgain}
          >
            Check again
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
export default ReadinessPanel;
