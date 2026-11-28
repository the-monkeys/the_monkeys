import { cookies, headers } from 'next/headers';

import { API_URL, API_URL_V2 } from '@/constants/api';
import { canIndexRestricted } from '@/lib/nsfwSeoPolicy';
import { requestCache } from '@/lib/requestCache';
import { crawlerForwardHeaders, nsfwSeoEnabled } from '@/lib/searchCrawler';
import { Blog } from '@/services/blog/blogTypes';
import { GetProfileInfoByIdResponse } from '@/services/profile/userApiTypes';

export const loadBlogForViewer = requestCache(
  async (id: string): Promise<Blog | null | undefined> => {
    if (!id) return null;
    if (!API_URL_V2) return undefined;

    try {
      const token = cookies().get('mat')?.value;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(
        `${API_URL_V2}/blog/${encodeURIComponent(id)}`,
        { cache: 'no-store', headers }
      );
      if (response.status === 404) return null;
      if (!response.ok) return undefined;
      const value = (await response.json()) as Blog;
      return value?.blog_id && value.blog?.blocks ? value : undefined;
    } catch {
      return undefined;
    }
  }
);

export const loadPublicBlogForSeo = requestCache(
  async (id: string): Promise<Blog | null | undefined> => {
    if (!id) return null;
    if (!API_URL_V2) return undefined;
    try {
      const response = await fetch(
        `${API_URL_V2}/blog/${encodeURIComponent(id)}`,
        {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        }
      );
      if (response.status === 404) return null;
      if (!response.ok) return undefined;
      const value = (await response.json()) as Blog;
      return value?.blog_id && value.blog?.blocks ? value : undefined;
    } catch {
      return undefined;
    }
  }
);

export const loadPublicAuthorForSeo = requestCache(
  async (
    accountId: string
  ): Promise<GetProfileInfoByIdResponse | null | undefined> => {
    if (!accountId) return null;
    if (!API_URL) return undefined;
    try {
      const response = await fetch(
        `${API_URL}/user/public/account/${encodeURIComponent(accountId)}`,
        { next: { revalidate: 300 } }
      );
      if (response.status === 404) return null;
      if (!response.ok) return undefined;
      const value = (await response.json()) as GetProfileInfoByIdResponse;
      return value?.user?.username ? value : undefined;
    } catch {
      return undefined;
    }
  }
);

export const loadCrawlerBlogForSeo = requestCache(
  async (id: string): Promise<Blog | null> => {
    if (!id || !API_URL_V2 || !nsfwSeoEnabled()) return null;
    try {
      const url = new URL(API_URL_V2 + '/blog/' + encodeURIComponent(id));
      const proof = crawlerForwardHeaders(headers() as Headers, url.pathname);
      if (!proof) return null;
      const response = await fetch(url.toString(), {
        headers: { ...proof, 'Content-Type': 'application/json' },
        cache: 'no-store',
        signal: AbortSignal.timeout(7000),
      });
      if (!response.ok) return null;
      const value = (await response.json()) as Blog;
      if (
        value?.blog_id !== id ||
        value.seo_crawler !== true ||
        value.is_nsfw !== true ||
        !canIndexRestricted(value, { indexRestricted: true }) ||
        !Array.isArray(value.blog?.blocks)
      )
        return null;
      return value;
    } catch {
      return null;
    }
  }
);
