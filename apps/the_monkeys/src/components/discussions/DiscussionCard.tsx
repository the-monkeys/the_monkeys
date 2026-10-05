import Link from 'next/link';

import { discussionAuthorName, discussionPath } from '@/lib/discussionSeo';
import { discussionTimeLabel } from '@/lib/discussionTime';
import type { Discussion } from '@/services/discussions/discussionsTypes';

export function DiscussionCard({
  post,
  linked,
}: {
  post: Discussion;
  linked: boolean;
}) {
  const author = discussionAuthorName(post.author_username, post.author_gone);
  const timeLabel = discussionTimeLabel(post.created_at);
  const body = (
    <p className='font-inter whitespace-pre-wrap text-base leading-relaxed'>
      {post.body}
    </p>
  );

  return (
    <article className='min-w-0'>
      <div className='font-inter text-base leading-relaxed'>
        {post.author_gone || !post.author_username.trim() ? (
          <span>{author}</span>
        ) : (
          <Link href={`/${post.author_username.trim()}`}>{author}</Link>
        )}
        {timeLabel ? (
          <time className='ml-2' dateTime={post.created_at}>
            {timeLabel}
          </time>
        ) : null}
      </div>
      {linked ? (
        <Link
          className='font-inter block min-w-0 text-base leading-relaxed'
          href={discussionPath(post.public_id)}
        >
          {body}
        </Link>
      ) : (
        body
      )}
      <p className='font-inter text-base leading-relaxed'>
        {post.like_count} {post.like_count === 1 ? 'like' : 'likes'}
      </p>
    </article>
  );
}
