import { queryKeys } from '@/lib/queryKeys';
import { QueryClient } from '@tanstack/react-query';
import { afterEach, expect, it } from 'vitest';

import { isCurrentLandingPolicy, readLandingPolicy } from './landingPolicyRead';

const clients: QueryClient[] = [];
afterEach(() => clients.splice(0).forEach((client) => client.clear()));
function setup() {
  const client = new QueryClient();
  clients.push(client);
  client.setQueryData(queryKeys.auth.session(), { account_id: 'a' });
  return client;
}
it('records only the exact successful network root, isolated by client and viewer', async () => {
  const client = setup();
  const root = { blogs: [{ content_rating: { revealed: true, revision: 1 } }] };
  expect(
    await readLandingPolicy(client, 'a', undefined, async () => root)
  ).toBe(root);
  expect(isCurrentLandingPolicy(client, 'a', root)).toBe(true);
  expect(isCurrentLandingPolicy(client, 'b', root)).toBe(false);
  expect(isCurrentLandingPolicy(setup(), 'a', root)).toBe(false);
  expect(isCurrentLandingPolicy(client, 'a', { ...root })).toBe(false);
  expect(isCurrentLandingPolicy(client, 'a', root.blogs[0])).toBe(false);
  expect(isCurrentLandingPolicy(client, 'a', undefined)).toBe(false);
});
it('leaves anonymous, unknown-auth and mismatched-viewer reads unchanged but uncertified', async () => {
  const client = setup();
  const root: unknown[] = [];
  for (const viewer of [undefined, null, 'b']) {
    expect(
      await readLandingPolicy(client, viewer, undefined, async () => root)
    ).toBe(root);
    expect(isCurrentLandingPolicy(client, viewer, root)).toBe(false);
  }
  client.removeQueries({ queryKey: queryKeys.auth.session() });
  expect(
    await readLandingPolicy(client, 'a', undefined, async () => root)
  ).toBe(root);
  expect(isCurrentLandingPolicy(client, 'a', root)).toBe(false);
});
it('revokes an old receipt across A/logout/A even if the same payload is retained', async () => {
  const client = setup();
  const root: unknown[] = [];
  await readLandingPolicy(client, 'a', undefined, async () => root);
  client.setQueryData(queryKeys.auth.session(), null);
  expect(isCurrentLandingPolicy(client, 'a', root)).toBe(false);
  client.setQueryData(queryKeys.auth.session(), { account_id: 'a' });
  expect(isCurrentLandingPolicy(client, 'a', root)).toBe(false);
  await readLandingPolicy(client, 'a', undefined, async () => root);
  expect(isCurrentLandingPolicy(client, 'a', root)).toBe(true);
});
it('cannot certify a late read after session validation or account changes', async () => {
  const client = setup();
  let finish!: (value: object) => void;
  const root = {};
  const pending = readLandingPolicy(
    client,
    'a',
    undefined,
    () =>
      new Promise((resolve) => {
        finish = resolve;
      })
  );
  client.setQueryData(queryKeys.auth.session(), { account_id: 'a' });
  finish(root);
  expect(await pending).toBe(root);
  expect(isCurrentLandingPolicy(client, 'a', root)).toBe(false);
});
it('does not confuse a recreated auth query with an old equal update count', async () => {
  const client = setup();
  const root = {};
  await readLandingPolicy(client, 'a', undefined, async () => root);
  client.removeQueries({ queryKey: queryKeys.auth.session() });
  client.setQueryData(queryKeys.auth.session(), { account_id: 'a' });
  expect(isCurrentLandingPolicy(client, 'a', root)).toBe(false);
});
it('rejects aborted late transport results without publishing a receipt', async () => {
  const client = setup();
  const controller = new AbortController();
  let finish!: (value: object) => void;
  const root = {};
  const pending = readLandingPolicy(
    client,
    'a',
    controller.signal,
    () =>
      new Promise((resolve) => {
        finish = resolve;
      })
  );
  const rejected = expect(pending).rejects.toMatchObject({
    name: 'AbortError',
  });
  controller.abort();
  finish(root);
  await rejected;
  expect(isCurrentLandingPolicy(client, 'a', root)).toBe(false);
});
it('never certifies a public server read even when a viewer and session were supplied', async () => {
  const client = setup();
  const root = {};
  const browserWindow = window;
  Object.defineProperty(globalThis, 'window', {
    value: undefined,
    configurable: true,
  });
  try {
    expect(
      await readLandingPolicy(client, 'a', undefined, async () => root)
    ).toBe(root);
    expect(isCurrentLandingPolicy(client, 'a', root)).toBe(false);
  } finally {
    Object.defineProperty(globalThis, 'window', {
      value: browserWindow,
      configurable: true,
    });
  }
});
it('cannot certify a read that crossed A/logout/A before completing', async () => {
  const client = setup();
  let finish!: (value: object) => void;
  const root = {};
  const pending = readLandingPolicy(
    client,
    'a',
    undefined,
    () =>
      new Promise((resolve) => {
        finish = resolve;
      })
  );
  client.setQueryData(queryKeys.auth.session(), null);
  client.setQueryData(queryKeys.auth.session(), { account_id: 'a' });
  finish(root);
  await pending;
  expect(isCurrentLandingPolicy(client, 'a', root)).toBe(false);
});
