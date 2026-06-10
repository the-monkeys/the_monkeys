import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const syndicationToken = (id: string): string =>
  ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, '');

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  if (!id || !/^\d{5,}$/.test(id)) {
    return Response.json({ error: 'Invalid tweet id' }, { status: 400 });
  }

  const token = syndicationToken(id);
  const url = new URL('https://cdn.syndication.twimg.com/tweet-result');
  url.searchParams.set('id', id);
  url.searchParams.set('lang', 'en');
  url.searchParams.set('token', token);
  url.searchParams.set('tpz', '1');

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MonkeysSnapshot/1.0)',
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      return Response.json(
        { error: `Syndication ${res.status}` },
        { status: res.status === 404 ? 404 : 502 }
      );
    }
    const raw = await res.json();
    const data = {
      ...raw,
      text: raw.text ?? raw.full_text ?? '',
      favorite_count: raw.favorite_count ?? raw.favorites_count,
      retweet_count: raw.retweet_count ?? raw.retweets_count,
      reply_count: raw.reply_count ?? raw.replies_count,
      views_count: raw.views_count ?? raw.view_count,
    };
    return Response.json(data, {
      headers: { 'Cache-Control': 'private, max-age=300' },
    });
  } catch {
    return Response.json({ error: 'Failed to load tweet' }, { status: 502 });
  }
}
