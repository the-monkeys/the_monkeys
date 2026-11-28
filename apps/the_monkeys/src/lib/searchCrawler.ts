// Server-only: private runtime settings and Node crypto must not enter a client bundle.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';

const indexingAgent =
  /(?:^|[ ;(])(?:Googlebot(?:-News|-Image|-Video)?|Google-InspectionTool|OAI-SearchBot|PerplexityBot)\/[0-9]/i;
const detailPath = /^\/api\/v2\/blog\/[A-Za-z0-9_]+$/;
const reserved = new Set(['homepage', 'feed', 'search', 'trending']);
export function nsfwSeoEnabled(): boolean {
  const key = process.env.SEO_CRAWLER_SIGNING_KEY || '';
  const ingress = process.env.SEO_CRAWLER_INGRESS_SECRET || '';
  return (
    process.env.NSFW_SEO_ENABLED === '1' &&
    key.length >= 32 &&
    ingress.length >= 32 &&
    key !== ingress
  );
}
function equalSecret(value: string, expected: string): boolean {
  const left = Buffer.from(value),
    right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}
export function crawlerForwardHeaders(
  incoming: Headers,
  apiPath: string,
  now = Math.floor(Date.now() / 1000)
): Record<string, string> | undefined {
  if (
    incoming.get('x-monkeys-crawler-request-kind') !== 'document' ||
    !nsfwSeoEnabled() ||
    !detailPath.test(apiPath) ||
    reserved.has(apiPath.split('/').pop() || '')
  )
    return;
  if (
    !equalSecret(
      incoming.get('x-monkeys-ingress-proof') || '',
      process.env.SEO_CRAWLER_INGRESS_SECRET!
    )
  )
    return;
  for (const name of [
    'cookie',
    'authorization',
    'rsc',
    'next-router-state-tree',
    'next-router-prefetch',
    'next-action',
  ]) {
    if (incoming.has(name)) return;
  }
  if (
    /prefetch/i.test(
      (incoming.get('purpose') || '') +
        ' ' +
        (incoming.get('sec-purpose') || '')
    )
  )
    return;
  const accept = incoming.get('accept') || '';
  if (accept && !accept.includes('text/html') && accept !== '*/*') return;
  const ip = incoming.get('x-monkeys-client-ip') || '';
  const agent = incoming.get('user-agent') || '';
  if (!isIP(ip) || agent.length > 512 || !indexingAgent.test(agent)) return;
  const at = String(now);
  const proof = createHmac('sha256', process.env.SEO_CRAWLER_SIGNING_KEY!)
    .update('v1\nGET\n' + apiPath + '\n' + ip + '\n' + agent + '\n' + at)
    .digest('hex');
  return {
    'X-Monkeys-Crawler-IP': ip,
    'X-Monkeys-Crawler-Agent': agent,
    'X-Monkeys-Crawler-Time': at,
    'X-Monkeys-Crawler-Proof': proof,
  };
}
