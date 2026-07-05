import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 600;

const gatewayBase = () =>
  process.env.SNAPSHOT_GATEWAY_URL ??
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') ??
  'http://127.0.0.1:8081';

export async function POST(req: NextRequest) {
  // Forward the raw multipart form directly to the gateway.
  // Do NOT parse the body here — just stream it through with the original
  // Content-Type (which carries the multipart boundary).
  const contentType = req.headers.get('content-type') ?? '';

  let upstream: Response;
  try {
    upstream = await fetch(`${gatewayBase()}/api/snapshot/video/brand`, {
      method: 'POST',
      headers: { 'Content-Type': contentType },
      body: req.body,
      // @ts-expect-error — Node fetch needs duplex for streaming request bodies
      duplex: 'half',
      cache: 'no-store',
    });
  } catch {
    return Response.json(
      { error: 'Gateway unreachable for video branding' },
      { status: 502 }
    );
  }

  if (!upstream.ok) {
    const err = await upstream.json().catch(() => ({}));
    return Response.json(
      { error: (err as { error?: string }).error ?? 'Video branding failed' },
      { status: upstream.status }
    );
  }

  // Stream the branded MP4 back to the client.
  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'video/mp4',
      'Content-Disposition':
        upstream.headers.get('Content-Disposition') ??
        'attachment; filename="branded-video.mp4"',
    },
  });
}
