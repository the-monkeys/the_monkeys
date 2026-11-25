import type { ReactNode } from 'react';

import Link from 'next/link';

import { BlogAudienceBadge } from '@/components/blog/BlogAudienceBadge';
import { DiscussionAvatar } from '@/components/discussions/DiscussionAvatar';
import { DiscussionBody } from '@/components/discussions/DiscussionBody';
import { DiscussionCardMenu } from '@/components/discussions/DiscussionCardMenu';
import { DiscussionGroupLine } from '@/components/discussions/DiscussionGroupLine';
import { DiscussionLinkPreview } from '@/components/discussions/DiscussionLinkPreview';
import {
  DiscussionIdentity,
  DiscussionStats,
  discussionHandle,
} from '@/components/discussions/discussionChrome';
import { ContentGate } from '@/components/moderation/ContentGate';
import { firstInternalLink } from '@/lib/discussionLinks';
import { discussionHeadline, discussionPath } from '@/lib/discussionSeo';
import { cn } from '@/lib/utils';
import type { Discussion } from '@/services/discussions/discussionsTypes';

const bodyClass =
  'mt-1 block whitespace-pre-wrap break-words font-inter text-[15px] leading-relaxed';

function DiscussionCardContent({
  post,
  linked,
  footer,
  embedded = false,
  compact = false,
}: {
  post: Discussion;
  linked: boolean;
  footer?: ReactNode;
  /** Sit inside a parent feed row instead of drawing its own divider. */
  embedded?: boolean;
  /** Short landing preview; full feeds and threads keep their existing layout. */
  compact?: boolean;
}) {
  const preview = compact ? undefined : firstInternalLink(post.body);
  const textClass = cn(
    bodyClass,
    !linked && 'mt-3 text-base leading-7',
    embedded && 'text-base',
    compact &&
      'line-clamp-2 pr-10 text-sm [overflow-wrap:anywhere] lg:line-clamp-1'
  );
  return (
    <article
      className={cn(
        'relative grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3',
        embedded
          ? 'py-0'
          : 'rounded-2xl border border-border-light bg-white p-4 dark:border-border-dark/40 dark:bg-background-dark sm:p-5'
      )}
    >
      {linked ? (
        <Link
          aria-label={discussionHeadline(post.body)}
          className='absolute inset-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange'
          href={discussionPath(post.public_id)}
        />
      ) : null}
      <DiscussionAvatar username={discussionHandle(post)} />
      <div className='min-w-0 flex-1'>
        <div
          className={cn(
            'flex min-w-0 items-start justify-between gap-2',
            compact && 'relative min-h-6'
          )}
        >
          <div className={cn('min-w-0 flex-1', compact && 'pr-11')}>
            <DiscussionIdentity author={post} createdAt={post.created_at} />
          </div>
        </div>
        {embedded ? (
          post.audience === 'group_only' ? (
            <div className='mt-1'>
              <BlogAudienceBadge />
            </div>
          ) : null
        ) : (
          <DiscussionGroupLine post={post} />
        )}
        {compact ? (
          <p className={textClass}>{post.body.replace(/\s+/g, ' ').trim()}</p>
        ) : (
          <DiscussionBody body={post.body} className={textClass} />
        )}
        {preview && !compact ? (
          <DiscussionLinkPreview href={preview.href} target={preview.target} />
        ) : null}
        {!footer ? (
          <DiscussionStats
            likes={post.like_count ?? 0}
            replies={post.reply_count ?? 0}
          />
        ) : null}
      </div>
      {footer ? <div className='relative z-10 col-span-2'>{footer}</div> : null}
    </article>
  );
}

export function DiscussionCard(
  props: Parameters<typeof DiscussionCardContent>[0] & { showMenu?: boolean }
) {
  const { post, embedded, compact, showMenu = true } = props;
  return (
    <div className='relative min-w-0'>
      {showMenu ? (
        <div
          className={cn(
            'absolute right-4 top-3 z-20 sm:right-5 sm:top-4',
            embedded && 'right-0 top-0 sm:right-0 sm:top-0'
          )}
        >
          <DiscussionCardMenu post={post} />
        </div>
      ) : null}
      <ContentGate
        content={post}
        target={{ kind: 'discussion', id: post.public_id }}
        compact={compact || props.linked}
        href={discussionPath(post.public_id)}
      >
        <DiscussionCardContent {...props} />
      </ContentGate>
    </div>
  );
}
