import { EventForm } from '@/components/events/EventForm';
import { GroupEventForm } from '@/components/groups/GroupEventForm';
import { createCreationAttempt } from '@/lib/creationAttempt';
import { geocodeAddress } from '@/lib/geoSearch';
import axiosInstance from '@/services/api/axiosInstance';
import { createEvent } from '@/services/events/eventsApi';
import { createGroupEvent } from '@/services/groups/groupsApi';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../utils';

vi.mock('@/hooks/auth/useAuth', () => ({ default: () => ({ data: null }) }));
vi.mock('@/hooks/groups/useGroupQueries', () => ({
  useUserGroups: () => ({ data: { groups: [] } }),
}));
vi.mock('@/hooks/useIPLocation', () => ({ useIPLocation: () => ({}) }));
vi.mock('@/lib/geoSearch', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/geoSearch')>()),
  geocodeAddress: vi.fn(),
}));

const originalAdapter = axiosInstance.defaults.adapter;
let posts: { body: string; key: unknown }[];
beforeEach(() => {
  posts = [];
  vi.mocked(geocodeAddress)
    .mockReset()
    .mockResolvedValueOnce(null)
    .mockResolvedValue({ latitude: 12.91, longitude: 77.64 });
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  axiosInstance.defaults.adapter = async (config) => {
    posts.push({
      body: config.data,
      key: config.headers.get('Idempotency-Key'),
    });
    if (posts.length === 1) throw new Error('Response lost');
    return {
      config,
      data: { event: { slug: 'created-event' } },
      headers: {},
      status: 200,
      statusText: 'OK',
    };
  };
});
afterEach(() => {
  cleanup();
  axiosInstance.defaults.adapter = originalAdapter;
  vi.unstubAllGlobals();
});

it.each([
  ['event', 'type'],
  ['event', 'visibility'],
  ['group-event', 'type'],
  ['group-event', 'visibility'],
])(
  '%s retains byte-identical payload and retry key when reselecting current %s after an uncertain create',
  async (kind, control) => {
    const attempt = createCreationAttempt();
    let settled = 0;
    const submit = async (
      body: import('@/services/events/eventTypes').EventBody
    ) => {
      await attempt
        .run(body, (key) =>
          kind === 'event'
            ? createEvent(body, key)
            : createGroupEvent(
                'club',
                body as import('@/services/groups/groupsTypes').GroupEventBody,
                key
              )
        )
        .catch(() => {});
      settled++;
    };
    renderWithProviders(
      kind === 'event' ? (
        <EventForm submitLabel='Create' onSubmit={submit} />
      ) : (
        <GroupEventForm submitLabel='Create' onSubmit={submit} />
      )
    );
    fireEvent.click(screen.getByRole('button', { name: 'In person' }));
    if (kind === 'event')
      fireEvent.click(screen.getByText('More event options'));
    for (const [name, value] of [
      ['title', 'Retry meetup'],
      ['start', '2099-11-12T19:00'],
      ['end', '2099-11-12T20:00'],
      ['location', 'Bengaluru'],
    ]) {
      fireEvent.change(document.querySelector(`[name="${name}"]`)!, {
        target: { value },
      });
    }
    const form = screen
      .getByRole('button', { name: 'Create' })
      .closest('form')!;
    fireEvent.submit(form);
    await waitFor(() => expect(settled).toBe(1));
    fireEvent.click(
      screen.getByRole('button', {
        name: control === 'type' ? 'In person' : /^Public/,
      })
    );
    fireEvent.submit(form);
    await waitFor(() => expect(settled).toBe(2));
    expect(posts).toHaveLength(2);
    expect(posts[1].body).toBe(posts[0].body);
    expect(posts[0].key).toEqual(expect.any(String));
    expect(posts[1].key).toBe(posts[0].key);
    expect(geocodeAddress).toHaveBeenCalledTimes(1);
  }
);
