'use client';

import Link from 'next/link';

import { BlogAudienceBadge } from '@/components/blog/BlogAudienceBadge';
import { useGroupDetail } from '@/hooks/groups/useGroupQueries';
import type { Discussion } from '@/services/discussions/discussionsTypes';

export function DiscussionGroupLine({ post }: { post: Discussion }) {
  const slug = post.group_slug?.trim() ?? '';
  const { data } = useGroupDetail(slug || undefined);
  const membersOnly = post.audience === 'group_only';
  if (!slug && !membersOnly) return null;
  const name = data?.group?.name?.trim() || slug;
  return (
    <p className='mt-1 flex min-w-0 flex-wrap items-center gap-2 font-inter text-xs text-gray-500'>
      {slug ? (
        <span className='min-w-0 truncate'>
          in{' '}
          <Link
            className='relative z-10 font-medium hover:underline'
            href={`/groups/${encodeURIComponent(slug)}`}
          >
            {name}
          </Link>
        </span>
      ) : null}
      {membersOnly ? <BlogAudienceBadge /> : null}
    </p>
  );
}
