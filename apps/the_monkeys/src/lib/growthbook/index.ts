import { GrowthBook } from '@growthbook/growthbook-react';

export function createGrowthbook(attributes?: Record<string, any>) {
  return new GrowthBook({
    apiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST!,
    clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY!,
    attributes: {
      environment: process.env.NEXT_PUBLIC_GROWTHBOOK_ENV || 'production',
      ...attributes,
    },
  });
}
