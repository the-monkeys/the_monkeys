import { API_URL, API_URL_V2, LIVE_URL } from '@/constants/api';
import { SITE_URL } from '@/lib/seo';
import type { OutputData } from '@themonkeys/monkeys-editor';

/** Revealed first-party storage uses the cookie-authenticated same-origin proxy.
 * Third-party media stays external and outside Monkeys' storage access policy.
 */
export function authenticatedArticleImageUrl(value: string): string {
  try {
    const url = new URL(value, SITE_URL);
    const configuredOrigins = [SITE_URL, API_URL, API_URL_V2, LIVE_URL].flatMap(
      (origin) => {
        try {
          return origin ? [new URL(origin, SITE_URL).origin] : [];
        } catch {
          return [];
        }
      }
    );
    const knownStorageHost =
      url.protocol === 'https:' &&
      [
        'monkeys.support',
        'dev.monkeys.support',
        'dev.themonkeys.site',
      ].includes(url.hostname);
    if (!configuredOrigins.includes(url.origin) && !knownStorageHost)
      return value;
    const storage = url.pathname.match(
      /^(?:\/api(?:\/v[12])?)?\/storage(\/.*)$/
    );
    if (storage) return '/api/v2/storage' + storage[1] + url.search;
  } catch {
    /* Invalid URLs retain the reader's existing URL validation. */
  }
  return value;
}

export function authenticatedArticleMedia(
  data?: OutputData
): OutputData | undefined {
  if (!data?.blocks?.length) return data;
  let changed = false;
  const blocks = data.blocks.map((block) => {
    if (block.type !== 'image' || typeof block.data?.file?.url !== 'string')
      return block;
    const url = authenticatedArticleImageUrl(block.data.file.url);
    if (url === block.data.file.url) return block;
    changed = true;
    return {
      ...block,
      data: { ...block.data, file: { ...block.data.file, url } },
    };
  });
  return changed ? { ...data, blocks } : data;
}
