'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import useAuth from '@/hooks/auth/useAuth';
import { loginHref } from '@/lib/authRedirect';
import {
  CONTENT_RATING_EVENT,
  type ContentRatingEvent,
  notifyContentRating,
} from '@/lib/contentRatingEvents';
import {
  birthdaySettingsHref,
  safeModerationReturn,
} from '@/lib/moderationNavigation';
import { refreshContentQueries } from '@/lib/moderationQueries';
import { cn } from '@/lib/utils';
import {
  getContentAccess,
  revealContent,
} from '@/services/moderation/moderationApi';
import {
  type ContentRating,
  type ContentTarget,
  type RatedContent,
  contentHref,
  isSensitive,
} from '@/services/moderation/moderationTypes';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';

export type ContentGateProps = {
  content?: RatedContent | null;
  target: ContentTarget;
  children: ReactNode;
  compact?: boolean;
  className?: string;
  href?: string;
};
export function ContentGate(props: ContentGateProps) {
  const [confirmed, setConfirmed] = useState<ContentRating>();
  useEffect(() => {
    const handle = (event: Event) => {
      const detail = (event as CustomEvent<ContentRatingEvent>).detail;
      if (
        detail?.target?.kind === props.target.kind &&
        detail.target.id === props.target.id &&
        detail.access?.target?.kind === props.target.kind &&
        detail.access.target.id === props.target.id
      )
        setConfirmed(detail.access);
    };
    window.addEventListener(CONTENT_RATING_EVENT, handle);
    return () => window.removeEventListener(CONTENT_RATING_EVENT, handle);
  }, [props.target.kind, props.target.id]);
  const newer =
    confirmed?.target?.kind === props.target.kind &&
    confirmed.target.id === props.target.id &&
    (confirmed.revision ?? 0) > (props.content?.content_rating?.revision ?? 0);
  const content = newer
    ? {
        ...props.content,
        is_nsfw: confirmed.is_nsfw === true,
        content_rating: confirmed,
      }
    : props.content;
  if (props.content?.content_unavailable)
    return (
      <div
        role='status'
        className={cn(
          'min-w-0 rounded-xl border border-border-light p-4 text-sm dark:border-border-dark',
          props.className
        )}
      >
        Content unavailable.
      </div>
    );
  // Safe responses keep their original render tree and make no policy request.
  if (!isSensitive(content)) return <>{props.children}</>;
  return <SensitiveGate {...props} content={content} />;
}
function SensitiveGate({
  content,
  target,
  children,
  compact,
  className,
  href,
}: ContentGateProps) {
  const label =
    target.kind === 'event'
      ? 'Sensitive event'
      : target.kind === 'group'
        ? 'Sensitive group'
        : 'Sensitive content';
  const auth = useAuth();
  const account = auth.data?.account_id;
  const router = useRouter();
  const pathname = usePathname();
  const client = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inFlight = useRef(false);
  const materialized = useRef<string>();
  const rating = content?.content_rating;
  const binding = useRef({ rating, account });
  if (binding.current.rating !== rating) binding.current = { rating, account };
  const boundToViewer = binding.current.account === account;
  const requestedRefresh = useRef<string>();
  const access = useQuery({
    queryKey: [
      'content-access',
      target.kind,
      target.id,
      account ?? null,
      rating?.revision ?? 0,
    ],
    queryFn: ({ signal }) => getContentAccess(target, signal),
    enabled: !!account,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: 'always',
  });
  useEffect(() => {
    if (account && !boundToViewer && requestedRefresh.current !== account) {
      requestedRefresh.current = account;
      router.refresh();
    }
  }, [account, boundToViewer, router]);
  useEffect(() => {
    if (
      error ||
      !account ||
      !boundToViewer ||
      !access.data?.revealed ||
      rating?.revealed
    )
      return;
    const key = `${account}:${target.kind}:${target.id}:${access.data.revision ?? 0}`;
    if (materialized.current === key) return;
    materialized.current = key;
    const currentTarget = { kind: target.kind, id: target.id };
    void refreshContentQueries(client, currentTarget)
      .then(() => {
        if (
          (safeModerationReturn(href) || contentHref(currentTarget)) ===
          pathname
        )
          router.refresh();
      })
      .catch(() => {
        materialized.current = undefined;
        setError('Unable to load this content. Please try again.');
      });
  }, [
    account,
    error,
    boundToViewer,
    access.data?.revealed,
    access.data?.revision,
    rating?.revealed,
    target.kind,
    target.id,
    client,
    href,
    pathname,
    router,
  ]);
  // Never trust a revealed DTO from a previous account or stale server render.
  const shown =
    !!account &&
    boundToViewer &&
    rating?.revealed === true &&
    access.isSuccess &&
    access.data.revealed === true;
  if (shown) return <>{children}</>;
  const result = access.data;
  const returnTo =
    safeModerationReturn(href) ||
    safeModerationReturn(pathname) ||
    contentHref(target);
  let message = 'Log in and confirm you are 18 or older to view this content.';
  let action: ReactNode = (
    <Button asChild size='sm'>
      <Link href={loginHref(returnTo)}>Log in to continue</Link>
    </Button>
  );
  if (account) {
    if (access.isPending) {
      message = 'Checking whether you can view this content.';
      action = null;
    } else if (access.isError) {
      message = 'Content checks are temporarily unavailable.';
      action = (
        <Button
          size='sm'
          variant='outline'
          onClick={() => void access.refetch()}
        >
          Try again
        </Button>
      );
    } else if (result?.reason === 'underage') {
      message = 'This content is available only to people aged 18 or older.';
      action = null;
    } else if (result?.reason === 'dob_required') {
      message =
        'Add your birthday to your profile before viewing this content.';
      action = (
        <Button asChild size='sm'>
          <Link href={birthdaySettingsHref(returnTo)}>Add your birthday</Link>
        </Button>
      );
    } else if (result?.reason === 'not_found') {
      message = 'This content is not available to your account.';
      action = null;
    } else if (result?.revealed) {
      message = 'Opening content you have already chosen to view.';
      action = error ? (
        <Button
          size='sm'
          onClick={() => {
            setError('');
            materialized.current = `${account}:${target.kind}:${target.id}:${result.revision ?? 0}`;
            void refreshContentQueries(client, target)
              .then(() => {
                if (
                  (safeModerationReturn(href) || contentHref(target)) ===
                  pathname
                )
                  router.refresh();
              })
              .catch(() => {
                materialized.current = undefined;
                setError('Unable to load this content. Please try again.');
              });
          }}
        >
          Try again
        </Button>
      ) : null;
    } else if (result?.can_reveal) {
      message =
        'This content may contain explicit material. Choose whether to view it.';
      action = (
        <Button size='sm' disabled={busy} onClick={() => void reveal()}>
          {busy ? 'Opening\u2026' : 'Show content'}
        </Button>
      );
    } else {
      message = 'This content is restricted.';
      action = null;
    }
  }
  async function reveal() {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError('');
    try {
      const confirmed = await revealContent(target);
      notifyContentRating(target, confirmed.access);
      materialized.current = `${account}:${target.kind}:${target.id}:${confirmed.access?.revision ?? 0}`;
      client.setQueryData(
        [
          'content-access',
          target.kind,
          target.id,
          account ?? null,
          rating?.revision ?? 0,
        ],
        confirmed.access
      );
      await refreshContentQueries(client, target);
      await access.refetch();
      const destination = safeModerationReturn(href) || contentHref(target);
      if (destination === pathname) router.refresh();
    } catch {
      setError('Unable to reveal this content. Please try again.');
      await access.refetch();
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  return (
    <section
      aria-label={label}
      className={cn(
        'relative isolate flex min-w-0 flex-col items-center justify-center overflow-hidden rounded-xl border border-border-light bg-white px-4 py-5 text-center dark:border-border-dark/60 dark:bg-background-dark',
        compact ? 'min-h-[150px]' : 'min-h-[240px] sm:min-h-[280px]',
        className
      )}
    >
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-4 -z-10 flex flex-col justify-center gap-3 opacity-20 blur-md'
      >
        <div className='h-16 rounded-lg bg-gray-300 dark:bg-gray-700' />
        <div className='h-3 w-4/5 rounded bg-gray-300 dark:bg-gray-700' />
        <div className='h-3 w-3/5 rounded bg-gray-300 dark:bg-gray-700' />
      </div>
      <span className='rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-medium text-brand-orange'>
        NSFW &middot; 18+
      </span>
      <p className='mt-3 font-dm_sans text-base font-semibold'>{label}</p>
      <p className='mt-2 max-w-sm text-sm leading-6 text-gray-600 dark:text-gray-300'>
        {message}
      </p>
      {action ? (
        <div className='mt-4 flex max-w-full justify-center'>{action}</div>
      ) : null}
      {error ? (
        <p role='alert' className='mt-3 text-sm text-red-600'>
          {error}
        </p>
      ) : null}
    </section>
  );
}
