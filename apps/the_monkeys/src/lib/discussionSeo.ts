import type { Metadata } from 'next';

import {
  MONKEYS_WEBSITE_ID,
  absoluteUrl,
  noIndexRobots,
  normalizeSeoText,
  pageMetadata,
  publisherOrg,
} from '@/lib/seo';
import { Discussion } from '@/services/discussions/discussionsTypes';

export function discussionHeadline(body: string): string {
  return normalizeSeoText(body, 70) || 'Discussion';
}

export function discussionDescription(body: string): string {
  return normalizeSeoText(body, 160) || 'A public discussion on Monkeys.';
}

export function discussionAuthorName(username: string, gone: boolean): string {
  if (gone || !username.trim()) return 'Deleted account';
  return username.trim();
}

export function discussionPath(id: string): string {
  return `/discussions/${encodeURIComponent(id)}`;
}

export function buildDiscussionMetadata(
  post: Discussion,
  indexable: boolean
): Metadata {
  const title = `${discussionHeadline(post.body)} | Monkeys`;
  const description = discussionDescription(post.body);
  if (!indexable) {
    return {
      title: { absolute: title },
      description,
      robots: noIndexRobots,
    };
  }
  return pageMetadata({
    title,
    description,
    path: discussionPath(post.public_id),
    type: 'article',
  });
}

export function buildDiscussionJsonLd(
  post: Discussion
): Record<string, unknown> {
  const url = absoluteUrl(discussionPath(post.public_id));
  const comments = (post.replies ?? [])
    .filter((reply) => reply.status === 'visible')
    .map((reply) => ({
      '@type': 'Comment',
      text: reply.body,
      url: `${url}#reply-${reply.public_id}`,
      author: {
        '@type': 'Person',
        name: discussionAuthorName(reply.author_username, reply.author_gone),
      },
      ...(reply.created_at ? { dateCreated: reply.created_at } : {}),
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    headline: discussionHeadline(post.body),
    articleBody: post.body,
    url,
    mainEntityOfPage: url,
    ...(post.created_at ? { datePublished: post.created_at } : {}),
    author: {
      '@type': 'Person',
      name: discussionAuthorName(post.author_username, post.author_gone),
    },
    publisher: publisherOrg(),
    isPartOf: post.group_slug
      ? {
          '@type': 'WebPage',
          url: absoluteUrl(`/groups/${encodeURIComponent(post.group_slug)}`),
        }
      : { '@id': MONKEYS_WEBSITE_ID },
    interactionStatistic: [
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/LikeAction',
        userInteractionCount: post.like_count,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/CommentAction',
        userInteractionCount: post.reply_count,
      },
    ],
    ...(comments.length ? { comment: comments } : {}),
  };
}

export function buildDiscussionFeedJsonLd(): Record<string, unknown> {
  const url = absoluteUrl('/discussions');
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Monkeys Discussions',
    url,
    description: 'Public discussions on Monkeys. Read a thread or start one.',
    isPartOf: { '@id': MONKEYS_WEBSITE_ID },
  };
}
