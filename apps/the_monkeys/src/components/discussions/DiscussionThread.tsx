'use client';

import Link from 'next/link';

import { DiscussionActions } from '@/components/discussions/DiscussionActions';
import { DiscussionAvatar } from '@/components/discussions/DiscussionAvatar';
import { DiscussionBody } from '@/components/discussions/DiscussionBody';
import { DiscussionCard } from '@/components/discussions/DiscussionCard';
import { ReplyForm, ReplyToggle } from '@/components/discussions/ReplyForm';
import {
  DiscussionIdentity,
  discussionHandle,
} from '@/components/discussions/discussionChrome';
import Icon from '@/components/icon';
import { DISCUSSIONS_ROUTE } from '@/constants/routeConstants';
import { useGroupDetail } from '@/hooks/groups/useGroupQueries';
import {
  type ReplyNode,
  buildReplyTree,
  countVisibleReplies,
  flattenReplies,
  isVisibleReply,
} from '@/lib/discussionReplies';
import { isActiveGroupMember } from '@/lib/groupPerms';
import type {
  Discussion,
  DiscussionReply,
} from '@/services/discussions/discussionsTypes';

// Deeper replies stay in the third column so threads still fit a phone screen.
const MAX_INDENT_DEPTH = 3;

const childIndent: Record<number, string> = {
  1: 'ml-[52px]',
  2: 'ml-[44px]',
};

function replyingToLabel(parent: DiscussionReply) {
  if (!isVisibleReply(parent)) return 'a removed reply';
  const handle = discussionHandle(parent);
  return handle ? `@${handle}` : 'a deleted account';
}

function ReplyItem({
  reply,
  postId,
  small,
  canReply,
  replyingTo,
}: {
  reply: DiscussionReply;
  postId: string;
  small: boolean;
  canReply: boolean;
  replyingTo?: DiscussionReply;
}) {
  const anchor = `reply-${reply.public_id}`;
  if (!isVisibleReply(reply)) {
    return (
      <p className='py-3 font-inter text-sm italic text-gray-500' id={anchor}>
        This reply was removed.
      </p>
    );
  }
  return (
    <article className='flex min-w-0 items-start gap-3 py-3' id={anchor}>
      <DiscussionAvatar small={small} username={discussionHandle(reply)} />
      <div className='min-w-0 flex-1'>
        <DiscussionIdentity author={reply} createdAt={reply.created_at} />
        {replyingTo ? (
          <p className='mt-0.5 font-inter text-xs text-gray-500'>
            Replying to{' '}
            <a
              className='text-brand-orange hover:underline'
              href={`#reply-${replyingTo.public_id}`}
            >
              {replyingToLabel(replyingTo)}
            </a>
          </p>
        ) : null}
        <DiscussionBody
          body={reply.body}
          className='mt-1 whitespace-pre-wrap break-words font-inter text-sm leading-relaxed'
        />
        {canReply ? (
          <ReplyToggle id={postId} parentId={reply.public_id} />
        ) : null}
      </div>
    </article>
  );
}

function ReplyBranch({
  node,
  depth,
  postId,
  canReply,
}: {
  node: ReplyNode;
  depth: number;
  postId: string;
  canReply: boolean;
}) {
  const atLastIndent = depth >= MAX_INDENT_DEPTH;
  return (
    <>
      <ReplyItem
        canReply={canReply}
        postId={postId}
        reply={node.reply}
        small={depth > 1}
      />
      {node.children.length > 0 && !atLastIndent ? (
        <ul className={childIndent[depth]}>
          {node.children.map((child) => (
            <li className='min-w-0' key={child.reply.public_id}>
              <ReplyBranch
                canReply={canReply}
                depth={depth + 1}
                node={child}
                postId={postId}
              />
            </li>
          ))}
        </ul>
      ) : null}
      {node.children.length > 0 && atLastIndent ? (
        <ul>
          {flattenReplies(node.children, node.reply).map((item) => (
            <li className='min-w-0' key={item.reply.public_id}>
              <ReplyItem
                canReply={canReply}
                postId={postId}
                reply={item.reply}
                replyingTo={item.parent}
                small
              />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export function DiscussionThread({ post }: { post: Discussion }) {
  const tree = buildReplyTree(post.replies ?? []);
  const shown = countVisibleReplies(tree);
  const slug = post.group_slug?.trim() ?? '';
  const { data } = useGroupDetail(slug || undefined);
  const canReply = !slug || isActiveGroupMember(data?.group);

  return (
    <div className='mx-auto w-full min-w-0 max-w-3xl'>
      <Link
        className='mb-3 inline-flex min-h-11 items-center gap-1 font-inter text-sm text-gray-500 hover:text-brand-orange'
        href={DISCUSSIONS_ROUTE}
      >
        <Icon name='RiArrowLeftS' size={16} /> Discussions
      </Link>

      <DiscussionCard
        footer={<DiscussionActions post={post} />}
        linked={false}
        post={post}
      />

      <section
        aria-labelledby='replies-heading'
        className='mt-4 scroll-mt-28 space-y-4 rounded-2xl border border-border-light bg-white p-4 dark:border-border-dark/40 dark:bg-background-dark sm:p-5'
        id='replies'
      >
        <h2
          className='font-newsreader text-2xl font-semibold'
          id='replies-heading'
        >
          {shown > 0 ? `Replies (${shown})` : 'Replies'}
        </h2>
        {canReply ? (
          <ReplyForm id={post.public_id} />
        ) : (
          <p className='font-inter text-sm text-gray-500'>
            <Link
              className='text-brand-orange hover:underline'
              href={`/groups/${encodeURIComponent(slug)}`}
            >
              Join the group
            </Link>{' '}
            to reply.
          </p>
        )}
        {tree.length > 0 ? (
          <ul className='min-w-0'>
            {tree.map((node) => (
              <li
                className='min-w-0 border-b border-border-light/60 pb-1 dark:border-border-dark/40'
                key={node.reply.public_id}
              >
                <ReplyBranch
                  canReply={canReply}
                  depth={1}
                  node={node}
                  postId={post.public_id}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </div>
  );
}
