import { NextResponse } from 'next/server';

/**
 * Runtime configuration endpoint
 * This endpoint provides environment-specific configuration that can be changed at runtime
 * without rebuilding the Docker image
 */
export async function GET() {
  const config = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
    apiUrlV2: process.env.NEXT_PUBLIC_API_URL_V2 || '',
    wssUrl: process.env.NEXT_PUBLIC_WSS_URL || '',
    wssUrlV2: process.env.NEXT_PUBLIC_WSS_URL_V2 || '',
    liveUrl: process.env.NEXT_PUBLIC_LIVE_URL || '',
    frnUrl: process.env.NEXT_PUBLIC_FRN_URL || '',
    growthbookClientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY || '',
    growthbookApiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST || '',
  };

  return NextResponse.json(config, {
    headers: {
      'Cache-Control': 'public, max-age=60, s-maxage=60',
    },
  });
}
