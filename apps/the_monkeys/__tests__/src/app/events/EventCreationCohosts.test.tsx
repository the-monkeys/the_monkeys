import NewEventPage from '@/app/events/new/page';
import { IP_LOCATION_STORAGE_KEY } from '@/lib/ipLocationCache';
import axiosInstance from '@/services/api/axiosInstance';
import axiosInstanceNoAuth from '@/services/api/axiosInstanceNoAuth';
import axiosInstanceNoAuthV2 from '@/services/api/axiosInstanceNoAuthV2';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import { EventBody } from '@/services/events/eventTypes';
import { getQueryClient } from '@/utils/get-query-client';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosAdapter } from 'axios';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const { push, replace } = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push, replace }) }));

const apis = [
  axiosInstance,
  axiosInstanceNoAuth,
  axiosInstanceNoAuthV2,
  axiosInstanceV2,
];
const adapters = apis.map((api) => api.defaults.adapter);
const client = getQueryClient();
const defaultOptions = client.getDefaultOptions();
let posts: { path: string; body: EventBody }[];

beforeEach(() => {
  vi.clearAllMocks();
  posts = [];
  client.clear();
  client.setDefaultOptions({
    queries: { retry: false, gcTime: Infinity, staleTime: 60_000 },
  });
  client.setQueryData(['auth'], {
    username: 'organizer',
    account_id: 'local-organizer',
    email: 'organizer@example.test',
  });
  // Keep the real IP/profile hooks offline using their normal cached inputs.
  sessionStorage.setItem(
    IP_LOCATION_STORAGE_KEY,
    JSON.stringify({
      city: '',
      country: '',
      countryName: '',
      latitude: 0,
      longitude: 0,
    })
  );
  client.setQueryData(['profile-image', 'cohost1'], null);
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  // Replace only HTTP transport. The page, form, picker, hooks, services and
  // Axios JSON serialization all run unchanged.
  const adapter: AxiosAdapter = async (config) => {
    let data: unknown;
    if (
      config.method === 'get' &&
      config.url?.startsWith('/groups/user/organizer')
    ) {
      data = { groups: [], total: 0 };
    } else if (
      config.method === 'get' &&
      config.url?.startsWith('user/search?')
    ) {
      const query = new URLSearchParams(config.url.split('?')[1]);
      expect(query.get('search_term')).toBe('@cohost1');
      data = {
        users: [
          {
            account_id: 'local-cohost1',
            username: 'cohost1',
            first_name: 'Local',
            last_name: 'Co-host',
            bio: '',
            avatar_url: '',
          },
        ],
        limit: 6,
        offset: 0,
      };
    } else if (
      config.method === 'post' &&
      ['/events', '/events/series'].includes(config.url || '')
    ) {
      posts.push({ path: config.url!, body: JSON.parse(config.data) });
      data = {
        event: {
          id: 1,
          slug: 'local-created-event',
          title: 'Local meetup',
          event_type: 'virtual',
          status: 'draft',
        },
      };
    } else {
      throw new Error(
        `Unexpected offline API request: ${config.method} ${config.url}`
      );
    }
    return { config, data, headers: {}, status: 200, statusText: 'OK' };
  };
  for (const api of apis) api.defaults.adapter = adapter;
});

afterEach(() => {
  cleanup();
  client.clear();
  apis.forEach((api, i) => {
    api.defaults.adapter = adapters[i];
  });
  client.setDefaultOptions(defaultOptions);
  sessionStorage.removeItem(IP_LOCATION_STORAGE_KEY);
  vi.unstubAllGlobals();
});

it.each([
  ['Weekly', '/events/series'],
  ['One-time', '/events'],
])(
  'forwards the selected co-host list from the real picker to the %s create request',
  async (repeat, path) => {
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={client}>
        <NewEventPage />
      </QueryClientProvider>
    );
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Event timezone' }),
      'UTC'
    );
    fireEvent.change(document.querySelector('[name="title"]')!, {
      target: { value: 'Local meetup' },
    });
    fireEvent.change(document.querySelector('[name="start"]')!, {
      target: { value: '2099-11-12T19:00' },
    });
    fireEvent.change(document.querySelector('[name="end"]')!, {
      target: { value: '2099-11-12T20:00' },
    });
    await user.click(screen.getByText('More event options'));
    await user.click(screen.getByRole('radio', { name: repeat }));
    await user.type(
      screen.getByRole('textbox', { name: 'Search people to add as co-hosts' }),
      '@cohost1'
    );
    await user.click(await screen.findByRole('button', { name: /@cohost1/ }));
    expect(
      screen.getByRole('button', { name: 'Remove @cohost1' })
    ).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Save draft' }));
    await waitFor(() =>
      expect(push).toHaveBeenCalledWith('/events/local-created-event/manage')
    );
    expect(posts).toHaveLength(1);
    expect(posts[0].path).toBe(path);
    expect(posts[0].body.co_host_usernames).toEqual(['cohost1']);
    if (repeat === 'Weekly')
      expect(posts[0].body.recurrence?.freq).toBe('weekly');
    else expect(posts[0].body.recurrence).toBeUndefined();
    expect(replace).not.toHaveBeenCalled();
  }
);
