'use client';

import { useEffect, useId, useRef, useState } from 'react';

import Icon from '@/components/icon';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@the-monkeys/ui/atoms/drawer';

import { ScoreExplanation } from './ScoreExplanation';
import type { CheckStatus, ReadinessReport, ReadinessState } from './types';

export interface ReadinessPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  state: ReadinessState;
  report: ReadinessReport | null;
  onCheckAgain: () => void;
  onGoToField?: (fieldKey: string) => void;
  returnFocusTo?: HTMLElement | null;
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
    label: 'Publishing basics',
    description: 'Checks of the text and structure supplied in this draft.',
  },
  {
    key: 'answers',
    label: 'Reader clarity',
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
  returnFocusTo,
}: ReadinessPanelProps) {
  const opener = useRef<HTMLElement | null>(null);
  const goToField = useRef<string | null>(null);
  const [showScoreHelp, setShowScoreHelp] = useState(false);
  const scoreHelpId = useId();
  const scoreHelp = useRef<HTMLHeadingElement | null>(null);
  const details = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const help = scoreHelp.current;
    const body = details.current;
    if (open && showScoreHelp && help && body) {
      // Focusing a help section taller than the viewport can scroll even an
      // overflow-hidden ancestor, hiding the drawer's header and footer.
      help.focus({ preventScroll: true });
      body.scrollTop +=
        help.getBoundingClientRect().top - body.getBoundingClientRect().top;
    }
  }, [open, showScoreHelp]);
  const preview =
    report?.visibility === 'public' && report.coverage === 'complete'
      ? report.preview
      : null;
  const previewUrl = publicPreviewUrl(preview?.url);
  const partial =
    report?.coverage === 'partial' ||
    report?.checks.some((check) => check.status === 'unknown');
  const manualCount =
    report?.checks.filter((check) => check.status === 'manual').length ?? 0;
  const unknownCount =
    report?.checks.filter((check) => check.status === 'unknown').length ?? 0;
  const message =
    state === 'stale'
      ? 'Content changed. Check again.'
      : state === 'pending'
        ? 'Checking publishing readiness…'
        : state === 'error'
          ? 'Could not check readiness. Try Check again. Editing, saving and publishing remain available.'
          : state === 'idle' || !report
            ? 'Add content, then check readiness to see publishing suggestions. You can keep writing and save normally.'
            : null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} autoFocus>
      <DrawerContent
        data-shortcut-scope='chrome'
        className='mx-auto w-full max-w-3xl max-h-[90dvh] data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:max-h-[90dvh] overflow-clip text-text-light dark:text-text-dark font-dm_sans'
        onOpenAutoFocus={() => {
          // The authoring entry owns the trigger outside this Drawer root.
          opener.current =
            returnFocusTo ??
            (document.activeElement instanceof HTMLElement
              ? document.activeElement
              : null);
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
        <DrawerHeader className='shrink-0 px-4 py-2 text-left sm:px-6'>
          <div className='flex items-start justify-between gap-3'>
            <DrawerTitle className='font-newsreader text-2xl font-semibold leading-tight'>
              Publishing readiness
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                type='button'
                variant='ghost'
                className={buttonClass}
                aria-label='Close readiness report'
              >
                <span aria-hidden='true'>
                  <Icon name='RiClose' size={20} />
                </span>
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        <div
          ref={details}
          className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 sm:px-6 [overflow-wrap:anywhere]'
          tabIndex={0}
          role='region'
          aria-label='Readiness report details'
          aria-busy={state === 'pending'}
        >
          <DrawerDescription className='mb-4 text-sm leading-relaxed text-gray-500 dark:text-gray-400'>
            Review your title, structure and sources before publishing.
            Optional, free guidance for your content. Suggestions never block
            saving or publishing.
          </DrawerDescription>
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
              <div className='mb-5 border-l-2 border-border-light pl-3 text-sm dark:border-border-dark'>
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
                  <h3 className='text-base font-semibold'>{section.label}</h3>
                  <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                    {section.description}
                  </p>
                  {section.key === 'seo' && (
                    <div className='my-3 rounded-lg border border-border-light bg-foreground-light/40 p-4 dark:border-border-dark dark:bg-foreground-dark/40'>
                      <p className='font-medium'>Automated checklist</p>
                      <p className='mt-2 font-newsreader text-3xl font-semibold'>
                        {report.applicableKnownCount === 0
                          ? 'No automated result available'
                          : `${report.passedCount} of ${report.applicableKnownCount} automated checks passed`}
                      </p>
                      {report.applicableKnownCount === 0 && (
                        <p className='mt-1 text-sm'>
                          {report.passedCount} of {report.applicableKnownCount}{' '}
                          automated checks passed
                        </p>
                      )}
                      {partial && (
                        <p className='mt-2 font-medium'>Partial check</p>
                      )}
                      <p className='mt-2 text-sm'>
                        This checklist covers known applicable checks only.
                        Unknown, human review and not applicable items are
                        excluded.
                      </p>
                      <p className='mt-2 text-sm'>
                        {manualCount} {manualCount === 1 ? 'item' : 'items'}{' '}
                        marked for human review. {unknownCount}{' '}
                        {unknownCount === 1 ? 'item' : 'items'} could not be
                        checked.
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
                  <ul className='mt-3 divide-y divide-border-light dark:divide-border-dark'>
                    {report.checks
                      .filter((check) => check.section === section.key)
                      .map((check) => (
                        <li key={check.id} className='py-4'>
                          <div className='flex flex-wrap items-baseline justify-between gap-2'>
                            <h4 className='font-medium'>{check.label}</h4>
                            <span
                              className={`inline-flex items-center gap-1.5 text-sm font-medium ${check.status === 'improve' ? 'text-text-light dark:text-text-dark' : 'text-gray-500 dark:text-gray-400'}`}
                            >
                              {check.status === 'improve' && (
                                <span
                                  aria-hidden='true'
                                  className='size-1.5 rounded-full bg-brand-orange'
                                />
                              )}
                              {statusLabels[check.status]}
                            </span>
                          </div>
                          <p className='mt-2 text-sm whitespace-pre-wrap'>
                            {check.finding}
                          </p>
                          <p className='mt-1 text-sm whitespace-pre-wrap text-gray-500 dark:text-gray-400'>
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
                <h3 className='text-base font-semibold'>
                  Search-result preview
                </h3>
                <p className='mt-1 text-sm'>
                  A preview of supplied page information. Search services may
                  display different text.
                </p>
                {preview ? (
                  <div className='mt-3 rounded-lg border border-border-light dark:border-border-dark p-3'>
                    {previewUrl && <p className='text-sm'>{previewUrl}</p>}
                    <p className='mt-1 font-newsreader text-xl font-semibold whitespace-pre-wrap'>
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
          {showScoreHelp && (
            <section
              id={scoreHelpId}
              aria-label='How these checks work'
              className='mt-5 rounded-lg border border-border-light p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange dark:border-border-dark'
            >
              <h3
                ref={scoreHelp}
                tabIndex={-1}
                className='mb-3 font-newsreader text-xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange'
              >
                How these checks work
              </h3>
              <ScoreExplanation report={report} />
            </section>
          )}
        </div>
        <div className='shrink-0 border-t border-border-light dark:border-border-dark px-4 py-2 sm:px-6 pb-[max(0.5rem,env(safe-area-inset-bottom))]'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <DrawerClose asChild>
              <Button type='button' variant='ghost' className={buttonClass}>
                Back to writing
              </Button>
            </DrawerClose>
            <Button
              type='button'
              variant='brand'
              className={`${buttonClass} rounded-full`}
              onClick={onCheckAgain}
            >
              Check again
            </Button>
          </div>
          <Button
            type='button'
            variant='link'
            className={`${buttonClass} mx-auto flex text-sm text-gray-500 dark:text-gray-400`}
            aria-expanded={showScoreHelp}
            aria-controls={scoreHelpId}
            onClick={() => setShowScoreHelp((value) => !value)}
          >
            How these checks work
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
export default ReadinessPanel;
