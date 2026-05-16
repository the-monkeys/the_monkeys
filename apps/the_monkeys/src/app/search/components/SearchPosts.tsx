'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import {
  PaginationNextButton,
  PaginationPrevButton,
} from '@/components/buttons/paginationButton';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { SEARCH_POSTS_PER_PAGE } from '@/constants/posts';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import { useSearchBlogsV2 } from '@/hooks/search/useSearchV2';
import { SearchBlogHit } from '@/services/search/searchTypes';
import { sanitizeHighlight } from '@/utils/searchHighlight';

/**
 * SearchHitCard renders a single v2 search hit. We deliberately do NOT
 * reuse FeedBlogCard here because:
 *   1. The v2 response is a flat projection (no banner image, no
 *      bookmark/like state).
 *   2. The acceptance criteria require matched terms to be bolded —
 *      that needs `dangerouslySetInnerHTML` with sanitised `<mark>`
 *      fragments, which FeedBlogCard doesn't support.
 *
 * Highlight HTML is sanitised by `sanitizeHighlight` (DOMPurify allow-list:
 * only `<mark>`, no attributes) so XSS in author-controlled fields is
 * impossible even if the gateway were ever compromised.
 */
const SearchHitCard = ({ hit }: { hit: SearchBlogHit }) => {
  const title = hit.title ?? '';
  const summary = hit.summary ?? '';
  const slug = hit.slug || generateSlug(title);
  const safeTitle = sanitizeHighlight(hit.highlight?.title, title);
  const safeSummary = sanitizeHighlight(hit.highlight?.summary, summary);
  const author = hit.author_display_name || hit.author_username || '';
  const published = hit.published_time
    ? new Date(hit.published_time).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <article className='p-3 rounded-md border border-border-light dark:border-border-dark border-opacity-40 hover:border-opacity-100 transition'>
      <Link
        href={`${BLOG_ROUTE}/${slug}-${hit.blog_id}`}
        className='group block space-y-1'
      >
        <h3
          className='text-lg font-medium group-hover:underline leading-snug line-clamp-2'
          // sanitised above; only `<mark>` survives the allow-list.
          dangerouslySetInnerHTML={{ __html: safeTitle }}
        />

        {summary && (
          <p
            className='text-sm opacity-90 line-clamp-3'
            dangerouslySetInnerHTML={{ __html: safeSummary }}
          />
        )}
      </Link>

      {(author || published) && (
        <div className='mt-2 flex items-center gap-2 text-xs opacity-75'>
          {hit.author_username ? (
            <Link href={`/${hit.author_username}`} className='hover:underline'>
              {author}
            </Link>
          ) : (
            <span>{author}</span>
          )}
          {author && published && <span aria-hidden>·</span>}
          {published && <time dateTime={hit.published_time}>{published}</time>}
        </div>
      )}
    </article>
  );
};

export const SearchPosts = ({ query }: { query: string }) => {
  // Cursor pagination: the v2 endpoint returns `next_cursor` (opaque
  // base64 of [_score, blog_id]). We maintain a stack of previously
  // visited cursors so the Prev button can pop back without re-querying
  // from scratch.
  const searchParams = useSearchParams();
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [prevStack, setPrevStack] = useState<(string | undefined)[]>([]);

  // Reset pagination whenever the query changes — otherwise the user
  // would carry a cursor from the previous search term and get an
  // empty page (cursors are query-scoped on the server).
  useEffect(() => {
    setCursor(undefined);
    setPrevStack([]);
  }, [query, searchParams]);

  const { hits, nextCursor, isLoading, isError, isFetching } = useSearchBlogsV2(
    {
      query,
      cursor,
      limit: SEARCH_POSTS_PER_PAGE,
    }
  );

  const hasNextPage = Boolean(nextCursor);
  const hasPrevPage = prevStack.length > 0;

  const handleNext = () => {
    if (!nextCursor) return;
    setPrevStack((stack) => [...stack, cursor]);
    setCursor(nextCursor);
  };

  const handlePrev = () => {
    setPrevStack((stack) => {
      if (stack.length === 0) return stack;
      const next = stack.slice(0, -1);
      setCursor(stack[stack.length - 1]);
      return next;
    });
  };

  if (isError) {
    return (
      <div className='min-h-[800px]'>
        <p className='w-full text-sm opacity-80 text-center'>
          Failed to load search results.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <FeedBlogCardListSkeleton count={SEARCH_POSTS_PER_PAGE} />;
  }

  if (!hits || hits.length === 0) {
    return (
      <p className='w-full opacity-90 text-center'>
        No posts found for your search.
      </p>
    );
  }

  return (
    <div className='flex flex-col gap-4' aria-busy={isFetching}>
      {hits.map((hit) => (
        <SearchHitCard hit={hit} key={hit.blog_id} />
      ))}

      {(hasPrevPage || hasNextPage) && (
        <div className='flex justify-start gap-[10px] mt-4'>
          {hasPrevPage && (
            <PaginationPrevButton onClick={handlePrev} disable={!hasPrevPage} />
          )}
          {hasNextPage && (
            <PaginationNextButton onClick={handleNext} disable={!hasNextPage} />
          )}
        </div>
      )}
    </div>
  );
};
