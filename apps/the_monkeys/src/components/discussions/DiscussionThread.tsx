import { DiscussionActions } from '@/components/discussions/DiscussionActions';
import { DiscussionCard } from '@/components/discussions/DiscussionCard';
import { ReplyForm } from '@/components/discussions/ReplyForm';
import { discussionAuthorName } from '@/lib/discussionSeo';
import type {
  Discussion,
  DiscussionReply,
} from '@/services/discussions/discussionsTypes';

function ReplyItem({ reply }: { reply: DiscussionReply }) {
  return (
    <article id={`reply-${reply.public_id}`} className='min-w-0'>
      <p className='font-inter text-base leading-relaxed'>
        {discussionAuthorName(reply.author_username, reply.author_gone)}
      </p>
      <p className='font-inter whitespace-pre-wrap text-base leading-relaxed'>
        {reply.body}
      </p>
    </article>
  );
}

export function DiscussionThread({ post }: { post: Discussion }) {
  const replies = (post.replies ?? []).filter(
    (reply) => reply.status === 'visible'
  );
  const topLevel = replies.filter((reply) => !reply.parent_public_id);
  const childrenOf = new Map<string, DiscussionReply[]>();
  for (const reply of replies) {
    if (!reply.parent_public_id) continue;
    const siblings = childrenOf.get(reply.parent_public_id) ?? [];
    siblings.push(reply);
    childrenOf.set(reply.parent_public_id, siblings);
  }

  return (
    <div className='mx-auto w-full min-w-0 max-w-2xl pb-24 lg:pb-0'>
      <DiscussionCard post={post} linked={false} />
      <DiscussionActions post={post} />
      <ReplyForm id={post.public_id} />
      <div className='mt-6 flex min-w-0 flex-col gap-6'>
        {topLevel.map((reply) => (
          <div key={reply.public_id} className='min-w-0'>
            <ReplyItem reply={reply} />
            <div className='ml-6 mt-3 flex min-w-0 flex-col gap-3'>
              {(childrenOf.get(reply.public_id) ?? []).map((child) => (
                <ReplyItem key={child.public_id} reply={child} />
              ))}
              <ReplyForm id={post.public_id} parentId={reply.public_id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
