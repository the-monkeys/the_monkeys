import { GrowthBook } from '@growthbook/growthbook-react';

export function isAbsoluteHttpUrl(url?: string): boolean {
  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function createGrowthbook(attributes?: Record<string, any>) {
  const apiHost = process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST;
  const clientKey = process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY;
  const isValidApiHost = isAbsoluteHttpUrl(apiHost);

  const gb = new GrowthBook({
    ...(isValidApiHost
      ? {
          apiHost,
          clientKey,
        }
      : {}),
    attributes: {
      environment: process.env.NEXT_PUBLIC_GROWTHBOOK_ENV || 'production',
      ...attributes,
    },
  });

  if (!isValidApiHost) {
    gb.init = async () => ({
      success: false,
      source: 'cache' as const,
    });
  }

  return gb;
}
