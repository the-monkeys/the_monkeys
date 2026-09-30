'use client';

import Link from 'next/link';

import { BlogAudienceBadge } from '@/components/blog/BlogAudienceBadge';
import { GROUPS_ROUTE } from '@/constants/routeConstants';
import { useGroupDetail } from '@/hooks/groups/useGroupQueries';
import { BlogAudience } from '@/services/blog/blogTypes';

interface BlogScopeLineProps {
  groupSlug?: string;
  audience?: BlogAudience;
}

export function BlogScopeLine({ groupSlug, audience }: BlogScopeLineProps) {
  const { data } = useGroupDetail(groupSlug);
  const groupName = data?.group?.name || groupSlug?.replace(/-/g, ' ');

  if (!groupName && audience !== 'group_only') return null;

  return (
    <div
      data-testid='blog-scope-line'
      className='flex flex-wrap items-center justify-center gap-2 text-center'
    >
      {groupSlug && groupName && (
        <Link
          href={`${GROUPS_ROUTE}/${groupSlug}`}
          className='max-w-full truncate rounded-full border border-border-light px-2.5 py-1 font-inter text-xs font-semibold capitalize transition-colors hover:border-brand-orange/40 hover:text-brand-orange dark:border-border-dark'
        >
          {groupName}
        </Link>
      )}
      {audience === 'group_only' && <BlogAudienceBadge />}
    </div>
  );
}
