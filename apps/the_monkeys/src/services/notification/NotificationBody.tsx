'use client';

import { type ReactNode } from 'react';

import Link from 'next/link';

import { LIVE_URL } from '@/constants/api';

import { FRNNotification } from './notificationTypes';

// Variables that represent a username — rendered as @username links.
const USERNAME_KEYS = new Set([
  'follower_name',
  'liker_name',
  'inviter_name',
  'coauthor_name',
  'remover_name',
  'publisher_name',
]);

// Variables that represent a blog reference — rendered as clickable blog links.
const BLOG_LINK_KEYS = new Set(['blog_title', 'blog_id']);

const PLACEHOLDER_RE = /\{\{\s*\.?\s*(\w+)\s*\}\}/g;

/**
 * Renders a notification body with clickable @username and blog links.
 * Parses raw template placeholders from content.body and substitutes
 * them with appropriate Link components.
 */
export function NotificationBody({ notif }: { notif: FRNNotification }) {
  const body = notif.content?.body || notif.content?.title || '';
  const data = notif.content?.data;

  if (!data || !body) return <span>{body}</span>;

  const baseUrl = LIVE_URL || '';
  const blogId = data.blog_id ? String(data.blog_id) : '';

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset regex state
  PLACEHOLDER_RE.lastIndex = 0;

  while ((match = PLACEHOLDER_RE.exec(body)) !== null) {
    const key = match[1];
    const val = data[key] != null ? String(data[key]) : '';

    // Push the static text before this placeholder
    if (match.index > lastIndex) {
      parts.push(body.slice(lastIndex, match.index));
    }

    if (USERNAME_KEYS.has(key) && val) {
      parts.push(
        <Link
          key={`${key}-${match.index}`}
          href={`${baseUrl}/${val}`}
          className='font-semibold hover:underline'
          onClick={(e) => e.stopPropagation()}
        >
          @{val}
        </Link>
      );
    } else if (BLOG_LINK_KEYS.has(key) && (blogId || val)) {
      const id = blogId || val;
      parts.push(
        <Link
          key={`${key}-${match.index}`}
          href={`${baseUrl}/blog/${id}`}
          className='font-semibold hover:underline'
          onClick={(e) => e.stopPropagation()}
        >
          {val || id}
        </Link>
      );
    } else {
      // Fallback: plain resolved text
      parts.push(val);
    }

    lastIndex = match.index + match[0].length;
  }

  // Push any trailing static text
  if (lastIndex < body.length) {
    parts.push(body.slice(lastIndex));
  }

  return <span>{parts}</span>;
}
