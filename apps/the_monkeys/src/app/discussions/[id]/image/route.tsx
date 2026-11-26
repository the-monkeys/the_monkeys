import { ImageResponse } from 'next/og';

import { API_URL } from '@/constants/api';
import {
  canSnapshotDiscussion,
  fromDiscussion,
} from '@/features/snapshot/adapters/fromDiscussion';
import { quoteCard } from '@/features/snapshot/templates/QuoteCard';
import { DEFAULT_THEME_ID, getThemeById } from '@/features/snapshot/themes';
import type { SnapshotAuthor } from '@/features/snapshot/types';
import { loadDiscussion } from '@/lib/discussionPageData';
import { SITE_URL } from '@/lib/seo';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const headers = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!/^[a-zA-Z0-9_-]{1,128}$/.test(params.id))
    return new Response('Not found', { status: 404, headers });
  const found = await loadDiscussion(params.id, '');
  if (found.state === 'unavailable')
    return new Response('Temporarily unavailable', { status: 503, headers });
  if (found.state !== 'ok' || !canSnapshotDiscussion(found.discussion))
    return new Response('Not found', { status: 404, headers });
  const post = found.discussion;
  const handle = post.author_gone ? '' : post.author_username?.trim();
  const authorPromise = (async (): Promise<SnapshotAuthor | undefined> => {
    if (!handle || !API_URL) return undefined;
    try {
      const profile = await fetch(
        `${API_URL.replace(/\/$/, '')}/user/public/${encodeURIComponent(handle)}`,
        { cache: 'no-store', signal: AbortSignal.timeout(5000) }
      );
      if (profile.ok) {
        const user = await profile.json();
        // Verification comes only from the original author's public profile.
        if (user.username === handle)
          return {
            username: handle,
            displayName: `@${handle}`,
            isVerified: user.is_verified === true,
          };
      }
    } catch {
      /* A missing profile keeps the original handle without a badge. */
    }
    return undefined;
  })();
  try {
    const resourcesPromise = Promise.all(
      [
        'logo-brand.svg',
        'snapshot-verified.svg',
        'fonts/dm-sans-400.ttf',
        'fonts/dm-sans-600.ttf',
      ].map(async (file) => {
        const response = await fetch(`${SITE_URL}/${file}`, {
          cache: 'force-cache',
          signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) throw new Error('Studio asset unavailable');
        return response.arrayBuffer();
      })
    );
    const [author, resources] = await Promise.all([
      authorPromise,
      resourcesPromise,
    ]);
    const svg = (bytes: ArrayBuffer) =>
      `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new TextDecoder().decode(bytes))}`;
    const assetUrls = {
      logo: svg(resources[0]),
      verifiedBadge: svg(resources[1]),
    };
    const fonts = ([400, 600] as const).map((weight, index) => ({
      name: 'DM Sans',
      data: resources[index + 2],
      weight,
      style: 'normal' as const,
    }));
    const snapshot =
      new URL(request.url).searchParams.get('variant') === 'snapshot';
    const size = snapshot
      ? { width: 1080, height: 1080 }
      : { width: 1200, height: 630 };
    const Render = quoteCard.Render;
    return new ImageResponse(
      (
        <Render
          input={fromDiscussion(post, { origin: SITE_URL, author })}
          theme={getThemeById(DEFAULT_THEME_ID)}
          accent='#FF5542'
          renderSize={size}
          assetUrls={assetUrls}
        />
      ),
      { ...size, headers, fonts }
    );
  } catch {
    return new Response('Temporarily unavailable', { status: 503, headers });
  }
}
