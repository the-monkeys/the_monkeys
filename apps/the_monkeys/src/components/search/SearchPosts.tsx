import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import { useSearchBlogsV2 } from '@/hooks/search/useSearchV2';
import { SearchBlogHit } from '@/services/search/searchTypes';
import { sanitizeHighlight } from '@/utils/searchHighlight';

import { SearchResultsPostSkeleton } from '../skeletons/searchSkeleton';

// Renders one search hit in the navbar dropdown. We bold the matched
// terms by piping the gateway-supplied highlight HTML through DOMPurify
// (only `<mark>` is allowed — see utils/searchHighlight).
const SearchBlogTitle = ({
  hit,
  onClose,
}: {
  hit: SearchBlogHit;
  onClose?: () => void;
}) => {
  const title = hit.title ?? '';
  const slug = hit.slug || generateSlug(title);
  const safeTitle = sanitizeHighlight(hit.highlight?.title, title);

  return (
    <Link
      target='_blank'
      href={`${BLOG_ROUTE}/${slug}-${hit.blog_id}`}
      className='group p-1'
      onClick={onClose}
    >
      <span
        className='block font-medium group-hover:underline leading-[1.4] line-clamp-2'
        // safeTitle is sanitised by sanitizeHighlight before reaching here.
        dangerouslySetInnerHTML={{ __html: safeTitle }}
      />
    </Link>
  );
};

export const SearchPosts = ({
  query,
  onClose,
  limit = 3,
}: {
  query: string;
  onClose?: () => void;
  limit?: number;
}) => {
  // Search-v2: server returns ranked, highlighted, recency-boosted hits.
  // We ask for exactly the number we render so there's no client-side
  // slice and no over-fetch.
  const { hits, isLoading, isError } = useSearchBlogsV2({ query, limit });

  if (isLoading) {
    return <SearchResultsPostSkeleton />;
  }

  if (isError) {
    return (
      <p className='text-sm opacity-90 text-center'>
        Failed to load search results.
      </p>
    );
  }

  if (hits.length === 0) {
    return (
      <p className='py-2 text-sm opacity-90 text-center'>
        No posts found for your search
      </p>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      {hits.map((hit) => (
        <SearchBlogTitle hit={hit} onClose={onClose} key={hit.blog_id} />
      ))}
    </div>
  );
};
