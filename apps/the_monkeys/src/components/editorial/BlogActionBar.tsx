'use client';

import { LikesCount } from '@/components/blog/LikesCount';
import { BlogShareDialog } from '@/components/blog/actions/BlogShareDialog';
import { BookmarkButton } from '@/components/blog/buttons/BookmarkButton';
import { LikeButton } from '@/components/blog/buttons/LikeButton';
import { LIVE_URL } from '@/constants/api';
import useAuth from '@/hooks/auth/useAuth';
import { cn } from '@/lib/utils';

/**
 * Editorial action bar — like / share / bookmark for a single blog.
 *
 * Reuses the existing per-blog mutation buttons so state (liked/bookmarked
 * counts) stays in sync with the rest of the app via React Query.
 *
 * `blogURL` should be the canonical pathname (`/blog/<slug>-<id>`); we
 * prepend `LIVE_URL` so share targets receive a fully-qualified URL.
 *
 * `tone='light'` is the default (dark icons on light surfaces).
 * `tone='dark'`  inverts to white icons for overlay use on hero images.
 */
export interface BlogActionBarProps {
  blogId?: string;
  blogURL: string;
  size?: number;
  showBookmark?: boolean;
  tone?: 'light' | 'dark';
  className?: string;
  initialLikeCount?: number;
}

export const BlogActionBar = ({
  blogId,
  blogURL,
  size = 18,
  showBookmark = true,
  tone = 'light',
  className,
  initialLikeCount,
}: BlogActionBarProps) => {
  if (!blogId) return null;

  const shareURL = blogURL.startsWith('http')
    ? blogURL
    : `${LIVE_URL}${blogURL}`;

  const base =
    tone === 'dark' ? 'text-white/85' : 'text-gray-400 dark:text-gray-500';

  return (
    <div
      className={cn(
        'flex items-center gap-2 transition-colors',
        base,
        className
      )}
      // Action buttons live inside `<Link>` wrappers in some parents;
      // stop bubbling so a like-click doesn't navigate to the blog.
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className='flex items-center hover:text-brand-orange transition-colors cursor-pointer group/action'>
        <LikeButton blogId={blogId} size={size} />
        <LikesCount blogId={blogId} initialCount={initialLikeCount} />
      </div>

      <div className='hover:text-brand-orange transition-colors cursor-pointer'>
        <BlogShareDialog blogURL={shareURL} size={size} />
      </div>

      {showBookmark && (
        <div className='hover:text-brand-orange transition-colors cursor-pointer'>
          <BookmarkButton blogId={blogId} size={size} />
        </div>
      )}
    </div>
  );
};

export default BlogActionBar;
