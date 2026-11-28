// @vitest-environment node
import { NextRequest } from 'next/server';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { middleware } from './middleware';

afterEach(() => vi.unstubAllEnvs());
describe('crawler document classification before Next strips headers', () => {
  it('leaves rollout-off requests unchanged', () => {
    vi.stubEnv('NSFW_SEO_ENABLED', '0');
    const out = middleware(new NextRequest('http://localhost/blog/post-id'));
    expect(out.headers.get('x-middleware-override-headers')).toBeNull();
  });
  it('marks plain GET documents', () => {
    vi.stubEnv('NSFW_SEO_ENABLED', '1');
    const out = middleware(new NextRequest('http://localhost/blog/post-id'));
    expect(
      out.headers.get('x-middleware-request-x-monkeys-crawler-request-kind')
    ).toBe('document');
  });
  it.each([
    'RSC',
    'Next-Router-Prefetch',
    'Next-Router-State-Tree',
    'Next-Action',
    'Next-Url',
    'Purpose',
    'Sec-Purpose',
  ])('does not trust client document assertions on %s requests', (header) => {
    vi.stubEnv('NSFW_SEO_ENABLED', '1');
    const h = new Headers({ 'x-monkeys-crawler-request-kind': 'document' });
    h.set(header, header.toLowerCase().includes('purpose') ? 'prefetch' : '1');
    const out = middleware(
      new NextRequest('http://localhost/blog/post-id', { headers: h })
    );
    expect(
      out.headers.get('x-middleware-request-x-monkeys-crawler-request-kind')
    ).toBe('subrequest');
  });
  it('does not classify POST as a crawler document', () => {
    vi.stubEnv('NSFW_SEO_ENABLED', '1');
    const out = middleware(
      new NextRequest('http://localhost/blog/post-id', { method: 'POST' })
    );
    expect(
      out.headers.get('x-middleware-request-x-monkeys-crawler-request-kind')
    ).toBe('subrequest');
  });
});
