import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

function isDisallowedHost(hostname: string): boolean {
  // Strip enclosing brackets for IPv6
  const cleanHost = hostname.replace(/^\[|\]$/g, '').toLowerCase();

  // Reject localhost, loopback, unspecified
  if (
    cleanHost === 'localhost' ||
    cleanHost.endsWith('.localhost') ||
    cleanHost === '::1' ||
    cleanHost === '::' ||
    cleanHost === '0.0.0.0'
  ) {
    return true;
  }

  // Reject IPv6 link-local, unique-local, or IPv4-mapped IPv6
  if (
    cleanHost.startsWith('fe80:') ||
    cleanHost.startsWith('fc') ||
    cleanHost.startsWith('fd') ||
    cleanHost.startsWith('::ffff:')
  ) {
    return true;
  }

  // IPv4 dotted-decimal validation
  const ipv4Match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(
    cleanHost
  );
  if (ipv4Match) {
    const [, a, b, c, d] = ipv4Match.map(Number);
    if ([a, b, c, d].some((octet) => octet < 0 || octet > 255)) {
      return true;
    }
    // 0.0.0.0/8 (0.0.0.0)
    if (a === 0) return true;
    // 10.0.0.0/8 (10.0.0.0 - 10.255.255.255)
    if (a === 10) return true;
    // 127.0.0.0/8 (127.0.0.1)
    if (a === 127) return true;
    // 169.254.0.0/16 (169.254.169.254 cloud metadata & link-local)
    if (a === 169 && b === 254) return true;
    // 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)
    if (a === 172 && b >= 16 && b <= 31) return true;
    // 192.168.0.0/16 (192.168.0.0 - 192.168.255.255)
    if (a === 192 && b === 168) return true;
  }

  return false;
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return new Response('Missing image URL', { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return new Response('Invalid image URL', { status: 400 });
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return new Response(
      'Invalid URL protocol. Only HTTP and HTTPS are allowed.',
      { status: 400 }
    );
  }

  if (isDisallowedHost(parsedUrl.hostname)) {
    return new Response('Access to this host is forbidden', { status: 400 });
  }

  try {
    const res = await fetch(parsedUrl.toString());
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
