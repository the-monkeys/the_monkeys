import Link from 'next/link';

import { splitBody } from '@/lib/discussionLinks';

// Links sit above the feed card's full-card link so they stay clickable.
const linkClass =
  'relative z-10 text-brand-orange [overflow-wrap:anywhere] hover:underline';

export function DiscussionBody({
  body,
  className,
}: {
  body: string;
  className?: string;
}) {
  return (
    <p className={className}>
      {splitBody(body).map((segment, i) => {
        if (segment.kind === 'text') return segment.text;
        if (segment.kind === 'mention') {
          return (
            <Link className={linkClass} href={`/${segment.username}`} key={i}>
              {segment.text}
            </Link>
          );
        }
        if (segment.internal) {
          return (
            <Link className={linkClass} href={segment.href} key={i}>
              {segment.text}
            </Link>
          );
        }
        return (
          <a
            className={linkClass}
            href={segment.href}
            key={i}
            rel='ugc nofollow noopener noreferrer'
            target='_blank'
          >
            {segment.text}
          </a>
        );
      })}
    </p>
  );
}
