import type { ReactNode } from 'react';

import Link from 'next/link';

import { BlogAudienceBadge } from '@/components/blog/BlogAudienceBadge';
import { DiscussionAvatar } from '@/components/discussions/DiscussionAvatar';
import { DiscussionBody } from '@/components/discussions/DiscussionBody';
import { DiscussionGroupLine } from '@/components/discussions/DiscussionGroupLine';
import { DiscussionLinkPreview } from '@/components/discussions/DiscussionLinkPreview';
import {
  DiscussionIdentity,
  DiscussionStats,
  discussionHandle,
  discussionRowClass,
} from '@/components/discussions/discussionChrome';
import { firstInternalLink } from '@/lib/discussionLinks';
import { discussionHeadline, discussionPath } from '@/lib/discussionSeo';
import { cn } from '@/lib/utils';
import type { Discussion } from '@/services/discussions/discussionsTypes';

const bodyClass =
  'mt-1 block whitespace-pre-wrap break-words font-inter text-[15px] leading-relaxed';

export function DiscussionCard({
  post,
  linked,
  footer,
  embedded = false,
}: {
  post: Discussion;
  linked: boolean;
  footer?: ReactNode;
  /** Sit inside a parent feed row instead of drawing its own divider. */
  embedded?: boolean;
}) {
  const preview = firstInternalLink(post.body);
  return (
    <article
      className={cn(
        'relative flex min-w-0 items-start gap-3',
        embedded ? 'py-0' : cn('py-4', discussionRowClass)
      )}
    >
      {linked ? (
        <Link
          aria-label={discussionHeadline(post.body)}
          className='absolute inset-0 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-orange'
          href={discussionPath(post.public_id)}
        />
      ) : null}
      <DiscussionAvatar username={discussionHandle(post)} />
      <div className='min-w-0 flex-1'>
        <DiscussionIdentity author={post} createdAt={post.created_at} />
        {embedded ? (
          post.audience === 'group_only' ? (
            <div className='mt-1'>
              <BlogAudienceBadge />
            </div>
          ) : null
        ) : (
          <DiscussionGroupLine post={post} />
        )}
        <DiscussionBody
          body={post.body}
          className={cn(bodyClass, embedded && 'text-base')}
        />
        {preview ? (
          <DiscussionLinkPreview href={preview.href} target={preview.target} />
        ) : null}
        {footer ? (
          <div className='relative z-10'>{footer}</div>
        ) : (
          <DiscussionStats
            likes={post.like_count ?? 0}
            replies={post.reply_count ?? 0}
          />
        )}
      </div>
    </article>
  );
}
