/**
 * Runtime Configuration Loader
 *
 * This module provides runtime configuration that can be changed without rebuilding the Docker image.
 * It fetches configuration from the /api/config endpoint on the client side.
 */

interface RuntimeConfig {
  apiUrl: string;
  apiUrlV2: string;
  wssUrl: string;
  wssUrlV2: string;
  liveUrl: string;
  frnUrl: string;
  growthbookClientKey: string;
  growthbookApiHost: string;
}

let cachedConfig: RuntimeConfig | null = null;
let configPromise: Promise<RuntimeConfig> | null = null;

/**
 * Fetches runtime configuration from the server
 * Uses caching to avoid multiple requests
 */
export async function getRuntimeConfig(): Promise<RuntimeConfig> {
  // Return cached config if available
  if (cachedConfig) {
    return cachedConfig;
  }

  // Return existing promise if fetch is in progress
  if (configPromise) {
    return configPromise;
  }

  // Start new fetch
  configPromise = fetch('/api/config')
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch runtime config');
      }
      return res.json();
    })
    .then((config: RuntimeConfig) => {
      cachedConfig = config;
      configPromise = null;
      return config;
    })
    .catch((error) => {
      console.error('Error fetching runtime config:', error);
      configPromise = null;
      // Return fallback config with build-time values
      const fallbackConfig: RuntimeConfig = {
        apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
        apiUrlV2: process.env.NEXT_PUBLIC_API_URL_V2 || '',
        wssUrl: process.env.NEXT_PUBLIC_WSS_URL || '',
        wssUrlV2: process.env.NEXT_PUBLIC_WSS_URL_V2 || '',
        liveUrl: process.env.NEXT_PUBLIC_LIVE_URL || '',
        frnUrl: process.env.NEXT_PUBLIC_FRN_URL || '',
        growthbookClientKey:
          process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY || '',
        growthbookApiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST || '',
      };
      cachedConfig = fallbackConfig;
      return fallbackConfig;
    });

  return configPromise;
}

/**
 * Gets runtime config synchronously (for server-side use)
 * Falls back to environment variables
 */
export function getRuntimeConfigSync(): RuntimeConfig {
  return {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
    apiUrlV2: process.env.NEXT_PUBLIC_API_URL_V2 || '',
    wssUrl: process.env.NEXT_PUBLIC_WSS_URL || '',
    wssUrlV2: process.env.NEXT_PUBLIC_WSS_URL_V2 || '',
    liveUrl: process.env.NEXT_PUBLIC_LIVE_URL || '',
    frnUrl: process.env.NEXT_PUBLIC_FRN_URL || '',
    growthbookClientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY || '',
    growthbookApiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST || '',
  };
}

/**
 * Clears the cached configuration
 * Useful for testing or when config needs to be refreshed
 */
export function clearConfigCache(): void {
  cachedConfig = null;
  configPromise = null;
}
