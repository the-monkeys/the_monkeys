import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return new Response('Missing image URL', { status: 400 });
  }

  try {
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await res.arrayBuffer();

    return new Response(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        'Netlify-Vary': 'query',
      },
    });
  } catch (err) {
    return new Response('Failed to fetch image', { status: 500 });
  }
}
