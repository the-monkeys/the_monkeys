export type ImageAccess = { allowed: boolean; protected: boolean };
const storagePath =
  /^(?:\/api(?:\/v[12])?)?\/storage\/(?:posts|assets|events|groups)\//;
const oldPostPath = /^\/api\/v1(?:\.1)?\/files\/post\//;
export function imageSessionHeaders(input: Headers): Headers {
  const result = new Headers();
  const mat = (input.get('cookie') || '')
    .split(/;\s*/)
    .find((value) => value.startsWith('mat='));
  if (mat) result.set('cookie', mat);
  const authorization = input.get('authorization');
  if (authorization) result.set('authorization', authorization);
  return result;
}
export async function imageAccessPolicy(
  source: string,
  origin: string,
  apiBase: string | undefined,
  credentials: Headers,
  fetcher: typeof fetch = fetch
): Promise<ImageAccess> {
  try {
    const image = new URL(source, origin);
    if (
      !['http:', 'https:'].includes(image.protocol) ||
      image.username ||
      image.password
    )
      return { allowed: false, protected: true };
    const path = decodeURIComponent(image.pathname);
    if (/[\\\u0000-\u001f]/.test(path))
      return { allowed: false, protected: true };
    // Export proxies are served directly, not through a second shared optimizer.
    // Their redirects cannot be classified from an already cached optimizer URL.
    if (path === '/api/proxy-image') return { allowed: false, protected: true };
    if (!storagePath.test(path) && !oldPostPath.test(path))
      return { allowed: true, protected: false };
    if (!apiBase) return { allowed: false, protected: true };
    const endpoint = new URL(apiBase);
    if (!['http:', 'https:'].includes(endpoint.protocol))
      return { allowed: false, protected: true };
    endpoint.pathname = '/api/v1/moderation/media';
    endpoint.search = '';
    endpoint.hash = '';
    endpoint.searchParams.set(
      'path',
      storagePath.test(path)
        ? path.replace(/^(?:\/api(?:\/v[12])?)?\/storage\//, '/api/v2/storage/')
        : path
    );
    const response = await fetcher(endpoint.toString(), {
      method: 'GET',
      headers: imageSessionHeaders(credentials),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return { allowed: false, protected: true };
    const data: unknown = await response.json();
    return {
      allowed:
        !!data &&
        typeof data === 'object' &&
        'allowed' in data &&
        data.allowed === true,
      protected: true,
    };
  } catch {
    return { allowed: false, protected: true };
  }
}
