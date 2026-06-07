import { getRuntimeConfigSync } from '@/lib/runtime-config';

/**
 * API Configuration
 *
 * For server-side code: Uses environment variables directly
 * For client-side code: Should use getRuntimeConfig() from @/lib/runtime-config
 *
 * These constants provide fallback values but client code should prefer
 * the runtime config for better portability across environments.
 */

const config = getRuntimeConfigSync();

export const API_URL = config.apiUrl || process.env.NEXT_PUBLIC_API_URL;
export const API_URL_V2 = config.apiUrlV2 || process.env.NEXT_PUBLIC_API_URL_V2;
export const WSS_URL = config.wssUrl || process.env.NEXT_PUBLIC_WSS_URL;
export const WSS_URL_V2 = config.wssUrlV2 || process.env.NEXT_PUBLIC_WSS_URL_V2;
export const LIVE_URL = config.liveUrl || process.env.NEXT_PUBLIC_LIVE_URL;
export const FRN_URL = config.frnUrl || process.env.NEXT_PUBLIC_FRN_URL;
