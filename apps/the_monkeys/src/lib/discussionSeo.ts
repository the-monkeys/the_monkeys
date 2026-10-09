import type { Metadata, MetadataRoute } from 'next';

import { discussionIsoTime } from '@/lib/discussionTime';
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

// The gateway omits empty and false fields, so both can arrive undefined.
export function discussionAuthorName(
  username?: string,
  gone?: boolean
): string {
  const name = (username ?? '').trim();
  if (gone || !name) return 'Deleted account';
  return name;
}

export function discussionPath(id: string): string {
  return `/discussions/${encodeURIComponent(id)}`;
}

export function discussionsSitemap(
  ids: string[],
  siteUrl: string
): MetadataRoute.Sitemap {
  return ids.map((id) => ({
    url: `${siteUrl}${discussionPath(id)}`,
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));
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
    .map((reply) => {
      const dateCreated = discussionIsoTime(reply.created_at);
      return {
        '@type': 'Comment',
        text: reply.body,
        url: `${url}#reply-${reply.public_id}`,
        author: {
          '@type': 'Person',
          name: discussionAuthorName(reply.author_username, reply.author_gone),
        },
        ...(dateCreated ? { dateCreated } : {}),
      };
    });
  const datePublished = discussionIsoTime(post.created_at);

  return {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    headline: discussionHeadline(post.body),
    articleBody: post.body,
    url,
    mainEntityOfPage: url,
    ...(datePublished ? { datePublished } : {}),
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
        userInteractionCount: post.like_count ?? 0,
      },
      {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/CommentAction',
        userInteractionCount: post.reply_count ?? 0,
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
