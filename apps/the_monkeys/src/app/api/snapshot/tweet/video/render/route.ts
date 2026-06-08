import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 600;

const gatewayBase = () =>
  process.env.SNAPSHOT_GATEWAY_URL ??
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') ??
  'http://127.0.0.1:8081';

export async function POST(req: NextRequest) {
  const body = await req.text();
  let upstream: Response;
  try {
    upstream = await fetch(`${gatewayBase()}/api/snapshot/tweet/video/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      cache: 'no-store',
    });
  } catch {
    return Response.json(
      { error: 'Gateway unreachable for video render' },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return Response.json(
      { error: (err as { error?: string }).error ?? 'Video render failed' },
      { status: upstream.status }
    );
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'video/mp4',
      'Content-Disposition':
        upstream.headers.get('content-disposition') ??
        'attachment; filename="x-post-branded.mp4"',
      'Cache-Control': 'private, no-store',
    },
  });
}
