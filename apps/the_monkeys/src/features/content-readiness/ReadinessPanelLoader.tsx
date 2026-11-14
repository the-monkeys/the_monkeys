'use client';

import {
  Component,
  type ComponentType,
  type ReactNode,
  Suspense,
  lazy,
  useMemo,
  useState,
} from 'react';

import { Button } from '@the-monkeys/ui/atoms/button';

import type { ReadinessPanelProps } from './ReadinessPanel';

interface ReadinessPanelLoaderProps extends ReadinessPanelProps {
  loadPanel?: () => Promise<{
    ReadinessPanel: ComponentType<ReadinessPanelProps>;
  }>;
}

const loadPanelModule = () => import('./ReadinessPanel');

class ReadinessPanelBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function LoadingNotice({
  failed = false,
  onRetry,
  onClose,
}: {
  failed?: boolean;
  onRetry: () => void;
  onClose: () => void;
}) {
  const buttonClass =
    'min-h-11 min-w-11 h-auto whitespace-normal px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2';
  return (
    <section
      aria-label='Readiness report'
      className='my-3 w-full rounded-lg border border-border-light bg-background-light p-4 font-dm_sans text-text-light dark:border-border-dark dark:bg-background-dark dark:text-text-dark'
    >
      <p role={failed ? 'alert' : 'status'} className='text-sm'>
        {failed
          ? 'The free readiness report could not load. Editing and saving remain available. You can retry the report when ready.'
          : 'Loading readiness report…'}
      </p>
      <div className='mt-3 flex flex-wrap gap-2'>
        {failed && (
          <Button
            type='button'
            variant='outline'
            className={buttonClass}
            onClick={onRetry}
          >
            Retry readiness report
          </Button>
        )}
        <Button
          type='button'
          variant='ghost'
          className={buttonClass}
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </section>
  );
}

export function ReadinessPanelLoader({
  loadPanel = loadPanelModule,
  ...props
}: ReadinessPanelLoaderProps) {
  const [attempt, setAttempt] = useState(0);
  // A fresh lazy instance is essential: a rejected lazy promise is cached by
  // that instance. React.lazy attaches both success and rejection handlers.
  const Panel = useMemo(
    () =>
      lazy(() => {
        try {
          return loadPanel().then((module) => ({
            default: module.ReadinessPanel,
          }));
        } catch (error) {
          // Keep synchronous factory errors on the same handled promise path.
          return Promise.reject(error);
        }
      }),
    // Retrying must discard React.lazy's cached rejection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loadPanel, attempt]
  );
  if (!props.open) return null;
  const retry = () => setAttempt((value) => value + 1);
  const close = () => props.onOpenChange(false);
  return (
    <ReadinessPanelBoundary
      key={attempt}
      fallback={<LoadingNotice failed onRetry={retry} onClose={close} />}
    >
      <Suspense fallback={<LoadingNotice onRetry={retry} onClose={close} />}>
        <Panel {...props} />
      </Suspense>
    </ReadinessPanelBoundary>
  );
}
