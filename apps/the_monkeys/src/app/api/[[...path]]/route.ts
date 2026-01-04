import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { API_URL } from '@/constants/api';

export const dynamic = 'force-dynamic';

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'content-encoding',
  'content-length',
  'host',
]);

async function proxyRequest(
  req: NextRequest,
  context?: { params: { path?: string[] } }
) {
  try {
    const apiBaseUrl = new URL(API_URL!).origin;
    if (!apiBaseUrl) {
      throw new Error('API_URL environment variable is not defined');
    }

    const clientUrl = new URL(req.url);

    // Determine the target path
    let upstreamPath = '';

    // (/api/v2/blog/...)
    if (context?.params?.path) {
      upstreamPath = `/api${context.params.path.length > 0 ? '/' + context.params.path.join('/') : ''}`;
    } else {
      // Fallback pathname
      upstreamPath = clientUrl.pathname;
    }

    // Construct final URL
    const upstreamUrl = new URL(
      `${upstreamPath}${clientUrl.search}`,
      apiBaseUrl
    );

    // Request Headers
    const requestHeaders = new Headers();

    // Copy valid headers from the incoming request
    req.headers.forEach((value, key) => {
      if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
        requestHeaders.set(key, value);
      }
    });

    // set the cookies
    const cookieStore = cookies();
    const authToken = cookieStore.get('mat');

    if (authToken) {
      requestHeaders.set('Authorization', `Bearer ${authToken.value}`);
    }

    // Configure Fetch Options (Streaming Enabled)
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: requestHeaders,
      cache: 'no-store',
      redirect: 'manual',
    };

    // Attach Body for non-GET/HEAD requests
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = req.body;

      // @ts-ignore: Required for Node.js fetch to stream the body
      fetchOptions.duplex = 'half';
    }

    // Execute Upstream Request
    const upstreamResponse = await fetch(upstreamUrl.toString(), fetchOptions);

    const responseHeaders = new Headers();

    upstreamResponse.headers.forEach((value, key) => {
      if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    });

    // Handle Set-Cookie Correctly (Split multiple cookies)
    // This ensures cookies like 'RefreshToken' and 'SessionId' are both set.
    if (typeof upstreamResponse.headers.getSetCookie === 'function') {
      const setCookies = upstreamResponse.headers.getSetCookie();
      for (const cookie of setCookies) {
        responseHeaders.append('Set-Cookie', cookie);
      }
    } else {
      // Fallback for older runtimes
      const rawCookie = upstreamResponse.headers.get('Set-Cookie');
      if (rawCookie) {
        responseHeaders.set('Set-Cookie', rawCookie);
      }
    }

    // We clone the stream so we can "spy" on it without breaking the response to the user
    const [logStream, responseStream] = upstreamResponse.body
      ? upstreamResponse.body.tee()
      : [null, null];

    if (logStream) {
      // Run this in the background (don't await it) to see chunks flowing
      (async () => {
        const reader = logStream.getReader();
        let totalBytes = 0;
        let chunkCount = 0;
        const startTime = Date.now();

        console.log('🌊 Stream started...');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          chunkCount++;
          totalBytes += value.length;
          const elapsed = Date.now() - startTime;

          // This log proves data is arriving in pieces over time!
          console.log(
            `📦 Chunk #${chunkCount}: ${value.length} bytes at ${elapsed}ms`
          );
        }
        console.log(
          `✅ Stream finished. Total: ${totalBytes} bytes in ${chunkCount} chunks.`
        );
      })();
    }

    // Stream Response Back to Client
    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy Streaming Error:', error);
    return NextResponse.json(
      {
        error: 'Internal Proxy Error',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 502 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  return proxyRequest(req, { params });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  return proxyRequest(req, { params });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  return proxyRequest(req, { params });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  return proxyRequest(req, { params });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { path?: string[] } }
) {
  return proxyRequest(req, { params });
}
