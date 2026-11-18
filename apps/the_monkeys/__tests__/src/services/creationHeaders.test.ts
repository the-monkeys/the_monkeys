import axiosInstance from '@/services/api/axiosInstance';
import {
  cloneEvent,
  createEvent,
  createSeries,
} from '@/services/events/eventsApi';
import { createGroup, createGroupEvent } from '@/services/groups/groupsApi';
import { submitVerification } from '@/services/verification/verificationApi';
import { afterEach, expect, it } from 'vitest';

const originalAdapter = axiosInstance.defaults.adapter;
const eventBody = {
  title: 'A',
  start_time: '2099-01-01',
  end_time: '2099-01-02',
  event_type: 'virtual' as const,
};
afterEach(() => {
  axiosInstance.defaults.adapter = originalAdapter;
});

it.each([
  ['/events', (key?: string) => createEvent(eventBody, key)],
  ['/events/series', (key?: string) => createSeries(eventBody, key)],
  [
    '/events/a%20b/clone',
    (key?: string) =>
      cloneEvent(
        'a b',
        { start_time: '2099-01-01', end_time: '2099-01-02' },
        key
      ),
  ],
  [
    '/groups',
    (key?: string) => createGroup({ name: 'A', visibility: 'public' }, key),
  ],
  [
    '/groups/a%20b/events',
    (key?: string) =>
      createGroupEvent(
        'a b',
        {
          title: 'A',
          start_time: '2099-01-01',
          end_time: '2099-01-02',
          event_type: 'virtual',
        },
        key
      ),
  ],
  [
    '/user/verification',
    (key?: string) =>
      submitVerification({ verification_type: 'social_proof' }, key),
  ],
] as const)(
  '%s sends only the optional per-request Idempotency-Key without changing its body',
  async (path, create) => {
    const requests: { url: string | undefined; key: unknown; body: unknown }[] =
      [];
    axiosInstance.defaults.adapter = async (config) => {
      requests.push({
        url: config.url,
        key: config.headers.get('Idempotency-Key'),
        body: JSON.parse(config.data),
      });
      return {
        config,
        data: { ok: true },
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    };
    await create('test-creation-key');
    await create();
    expect(requests.map(({ url }) => url)).toEqual([path, path]);
    expect(requests[0].key).toBe('test-creation-key');
    expect(requests[1].key).toBeUndefined();
    expect(requests[0].body).toEqual(requests[1].body);
    expect(requests[0].body).not.toHaveProperty('idempotency_key');
    expect(axiosInstance.defaults.headers.common).not.toHaveProperty(
      'Idempotency-Key'
    );
  }
);
