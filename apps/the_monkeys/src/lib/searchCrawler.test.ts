// @vitest-environment node
import { createHmac } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { crawlerForwardHeaders, nsfwSeoEnabled } from './searchCrawler';

const key = 'test-only-crawler-signing-key-123456789';
const ingress = 'independent-test-ingress-secret-123456';
function request() {
  return new Headers({
    'user-agent': 'Googlebot/2.1',
    accept: 'text/html',
    'x-monkeys-crawler-request-kind': 'document',
    'x-monkeys-client-ip': '66.249.66.1',
    'x-monkeys-ingress-proof': ingress,
  });
}
describe('server crawler assertions', () => {
  beforeEach(() => {
    vi.stubEnv('NSFW_SEO_ENABLED', '1');
    vi.stubEnv('SEO_CRAWLER_SIGNING_KEY', key);
    vi.stubEnv('SEO_CRAWLER_INGRESS_SECRET', ingress);
  });
  afterEach(() => vi.unstubAllEnvs());
  it('signs only authenticated document provenance with the exact target', () => {
    const out = crawlerForwardHeaders(
      request(),
      '/api/v2/blog/restricted',
      1800000000
    )!;
    expect(out).toBeDefined();
    const canonical =
      'v1\nGET\n/api/v2/blog/restricted\n66.249.66.1\nGooglebot/2.1\n1800000000';
    expect(out['X-Monkeys-Crawler-Proof']).toBe(
      createHmac('sha256', key).update(canonical).digest('hex')
    );
    expect(JSON.stringify(out)).not.toContain(ingress);
  });
  it.each([
    'cookie',
    'authorization',
    'rsc',
    'next-router-state-tree',
    'next-router-prefetch',
    'next-action',
  ])('never signs %s requests', (name) => {
    const h = request();
    h.set(name, '1');
    expect(crawlerForwardHeaders(h, '/api/v2/blog/restricted')).toBeUndefined();
  });
  it.each([
    'ChatGPT-User/1.0',
    'GPTBot/1.0',
    'Perplexity-User/1.0',
    'Mozilla/5.0',
  ])('rejects user agents without search privileges: %s', (agent) => {
    const h = request();
    h.set('user-agent', agent);
    expect(crawlerForwardHeaders(h, '/api/v2/blog/restricted')).toBeUndefined();
  });
  it('ignores spoofable forwarding headers without the ingress proof', () => {
    const h = request();
    h.delete('x-monkeys-ingress-proof');
    h.set('x-forwarded-for', '66.249.66.1');
    expect(crawlerForwardHeaders(h, '/api/v2/blog/restricted')).toBeUndefined();
  });
  it.each(['', 'short'])(
    'keeps feature off for missing/short server key',
    (value) => {
      vi.stubEnv('SEO_CRAWLER_SIGNING_KEY', value);
      expect(nsfwSeoEnabled()).toBe(false);
      expect(
        crawlerForwardHeaders(request(), '/api/v2/blog/restricted')
      ).toBeUndefined();
    }
  );
  it.each(['subrequest', ''])(
    'requires the raw document classification: %s',
    (kind) => {
      const h = request();
      h.set('x-monkeys-crawler-request-kind', kind);
      expect(
        crawlerForwardHeaders(h, '/api/v2/blog/restricted')
      ).toBeUndefined();
    }
  );

  it('supports verified Search Console inspection through the same private document path', () => {
    const h = request();
    h.set('user-agent', 'Google-InspectionTool/1.0');
    expect(crawlerForwardHeaders(h, '/api/v2/blog/restricted')).toBeDefined();
  });
  it('requires independent ingress and internal keys', () => {
    vi.stubEnv('SEO_CRAWLER_INGRESS_SECRET', key);
    expect(nsfwSeoEnabled()).toBe(false);
  });
  it('rejects malformed targets and prefetch variants', () => {
    for (const path of [
      '/api/v2/blog/meta-feed',
      '/api/v2/blog/x/stats',
      '/api/v2/blog/x?reveal=1',
    ]) {
      expect(crawlerForwardHeaders(request(), path)).toBeUndefined();
    }
    const h = request();
    h.set('purpose', 'prefetch');
    expect(crawlerForwardHeaders(h, '/api/v2/blog/restricted')).toBeUndefined();
  });
});
