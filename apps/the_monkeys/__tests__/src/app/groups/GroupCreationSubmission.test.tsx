import NewGroupEventPage from '@/app/groups/[slug]/events/new/page';
import NewGroupPage from '@/app/groups/new/page';
import { IP_LOCATION_STORAGE_KEY } from '@/lib/ipLocationCache';
import axiosInstance from '@/services/api/axiosInstance';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace: vi.fn() }),
}));
vi.mock('@/hooks/groups/useGroupQueries', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/hooks/groups/useGroupQueries')>()),
  useGroupDetail: () => ({
    data: {
      group: {
        slug: 'club',
        name: 'Club',
        visibility: 'public',
        viewer_role: 'organizer',
      },
    },
    isLoading: false,
  }),
}));

const original = axiosInstance.defaults.adapter;
let client: QueryClient;
let creates: unknown[];
let finishUpload: (() => void) | undefined;
let uploadFails = false;

beforeEach(() => {
  push.mockReset();
  creates = [];
  finishUpload = undefined;
  uploadFails = false;
  client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  client.setQueryData(['auth'], { account_id: 'host', username: 'host' });
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
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  vi.stubGlobal(
    'URL',
    class extends URL {
      static createObjectURL = () => 'blob:group-logo';
      static revokeObjectURL = () => {};
    }
  );
  axiosInstance.defaults.adapter = async (config) => {
    let data: unknown = {};
    if (config.url === '/groups' && config.method === 'post') {
      creates.push(config.headers.get('Idempotency-Key'));
      data = { group: { slug: 'new-club' } };
    } else if (
      config.url === '/groups/club/events' &&
      config.method === 'post'
    ) {
      creates.push(config.headers.get('Idempotency-Key'));
      data = { event: { slug: 'new-meetup' } };
    } else if (config.url === '/groups/new-club/images/logo') {
      await new Promise<void>((resolve) => {
        finishUpload = resolve;
      });
      if (uploadFails) throw new Error('Upload failed');
      data = { url: '/groups/new-club/logo.png' };
    } else if (config.url !== '/groups/new-club' || config.method !== 'put') {
      throw new Error(`Unexpected request: ${config.method} ${config.url}`);
    }
    return { config, data, headers: {}, status: 200, statusText: 'OK' };
  };
});
afterEach(() => {
  cleanup();
  client.clear();
  axiosInstance.defaults.adapter = original;
  sessionStorage.removeItem(IP_LOCATION_STORAGE_KEY);
  vi.unstubAllGlobals();
});

it.each([false, true])(
  'keeps creation locked through image upload, including upload failure=%s',
  async (failure) => {
    uploadFails = failure;
    render(
      <QueryClientProvider client={client}>
        <NewGroupPage />
      </QueryClientProvider>
    );
    fireEvent.change(document.querySelector('[name="name"]')!, {
      target: { value: 'New club' },
    });
    fireEvent.change(document.querySelector('input[type="file"]')!, {
      target: {
        files: [new File(['image'], 'logo.png', { type: 'image/png' })],
      },
    });
    const button = screen.getByRole('button', { name: 'Create draft' });
    const form = button.closest('form')!;
    act(() => {
      fireEvent.submit(form);
      fireEvent.submit(form);
    });
    await waitFor(() => expect(finishUpload).toBeTypeOf('function'));
    expect(creates).toHaveLength(1);
    expect(creates[0]).toEqual(expect.any(String));
    expect(
      (form.querySelector('[type="submit"]') as HTMLButtonElement).disabled
    ).toBe(true);
    fireEvent.submit(form);
    expect(creates).toHaveLength(1);
    await act(async () => {
      finishUpload!();
    });
    await waitFor(() =>
      expect(push).toHaveBeenCalledWith('/groups/new-club/manage')
    );
    expect(creates).toHaveLength(1);
  }
);

it.each(['group', 'group-event'])(
  'keeps successful %s creation locked while navigation holds the page mounted',
  async (kind) => {
    let finishNavigation!: () => void;
    push.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        finishNavigation = resolve;
      })
    );
    render(
      <QueryClientProvider client={client}>
        {kind === 'group' ? (
          <NewGroupPage />
        ) : (
          <NewGroupEventPage params={{ slug: 'club' }} />
        )}
      </QueryClientProvider>
    );
    const fields =
      kind === 'group'
        ? [['name', 'Navigation club']]
        : [
            ['title', 'Navigation meetup'],
            ['start', '2099-11-12T19:00'],
            ['end', '2099-11-12T20:00'],
          ];
    for (const [name, value] of fields)
      fireEvent.change(document.querySelector(`[name="${name}"]`)!, {
        target: { value },
      });
    const form = screen
      .getByRole('button', {
        name: kind === 'group' ? 'Create draft' : 'Create event',
      })
      .closest('form')!;
    fireEvent.submit(form);
    await waitFor(() => expect(push).toHaveBeenCalled());
    await act(async () => {
      await Promise.resolve();
    });
    expect(
      (form.querySelector('[type="submit"]') as HTMLButtonElement).disabled
    ).toBe(true);
    fireEvent.submit(form);
    await act(async () => {
      finishNavigation();
    });
    fireEvent.submit(form);
    await act(async () => {
      await Promise.resolve();
    });
    expect(creates).toHaveLength(1);
  }
);
