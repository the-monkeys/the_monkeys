import { DiscussionAuthorLink } from '@/components/discussions/DiscussionAuthorLink';
import Icon from '@/components/icon';
import { discussionAuthorName } from '@/lib/discussionSeo';
import {
  type DiscussionInstant,
  discussionIsoTime,
  discussionTimeLabel,
} from '@/lib/discussionTime';
import type { DiscussionAuthor } from '@/services/discussions/discussionsTypes';

export const discussionRowClass =
  'border-b border-border-light/60 dark:border-border-dark/40';

export function discussionCountLabel(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`;
}

export function discussionHandle(author: DiscussionAuthor) {
  return author.author_gone ? '' : (author.author_username ?? '').trim();
}

export function DiscussionIdentity({
  author,
  createdAt,
}: {
  author: DiscussionAuthor;
  createdAt?: DiscussionInstant;
}) {
  const handle = discussionHandle(author);
  const timeLabel = discussionTimeLabel(createdAt);

  return (
    <div className='flex min-w-0 items-center gap-1.5 font-inter'>
      {handle ? (
        <DiscussionAuthorLink handle={handle} />
      ) : (
        <span className='text-sm font-medium text-gray-500'>
          {discussionAuthorName(undefined, true)}
        </span>
      )}
      {timeLabel ? (
        <>
          <span aria-hidden className='text-xs text-gray-500'>
            ·
          </span>
          <time
            className='shrink-0 text-xs text-gray-500'
            dateTime={discussionIsoTime(createdAt)}
          >
            {timeLabel}
          </time>
        </>
      ) : null}
    </div>
  );
}

export function DiscussionStats({
  likes,
  replies,
}: {
  likes: number;
  replies: number;
}) {
  const likeLabel = discussionCountLabel(likes, 'like', 'likes');
  const replyLabel = discussionCountLabel(replies, 'reply', 'replies');
  return (
    <div className='mt-2 flex items-center gap-4 font-inter text-xs text-gray-500 dark:text-gray-400'>
      <span aria-label={likeLabel} className='inline-flex items-center gap-1'>
        <Icon name='RiThumbUp' size={14} />
        <span aria-hidden className='tabular-nums'>
          {likes}
        </span>
      </span>
      <span aria-label={replyLabel} className='inline-flex items-center gap-1'>
        <Icon name='RiChat1' size={14} />
        <span aria-hidden className='tabular-nums'>
          {replies}
        </span>
      </span>
    </div>
  );
}
