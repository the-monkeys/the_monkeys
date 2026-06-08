import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const allowedHosts = new Set(['video.twimg.com', 'pbs.twimg.com']);

const sanitizeFilename = (filename: string | null) => {
  const base =
    filename
      ?.replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'x-post-video.mp4';

  return base.toLowerCase().endsWith('.mp4') ? base : `${base}.mp4`;
};

export async function GET(req: NextRequest) {
  const rawUrl = req.nextUrl.searchParams.get('url');
  if (!rawUrl) {
    return Response.json({ error: 'Missing video URL' }, { status: 400 });
  }

  let videoUrl: URL;
  try {
    videoUrl = new URL(rawUrl);
  } catch {
    return Response.json({ error: 'Invalid video URL' }, { status: 400 });
  }

  if (
    videoUrl.protocol !== 'https:' ||
    !allowedHosts.has(videoUrl.hostname) ||
    !videoUrl.pathname.endsWith('.mp4')
  ) {
    return Response.json({ error: 'Unsupported video URL' }, { status: 400 });
  }

  try {
    const upstream = await fetch(videoUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MonkeysSnapshot/1.0)',
      },
      cache: 'no-store',
    });

    if (!upstream.ok || !upstream.body) {
      return Response.json(
        { error: `Video download failed (${upstream.status})` },
        { status: 502 }
      );
    }

    const filename = sanitizeFilename(req.nextUrl.searchParams.get('filename'));
    const headers = new Headers({
      'Content-Type': upstream.headers.get('content-type') ?? 'video/mp4',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, max-age=300',
    });
    const contentLength = upstream.headers.get('content-length');
    if (contentLength) headers.set('Content-Length', contentLength);

    return new Response(upstream.body, { headers });
  } catch {
    return Response.json(
      { error: 'Failed to download video' },
      { status: 502 }
    );
  }
}
