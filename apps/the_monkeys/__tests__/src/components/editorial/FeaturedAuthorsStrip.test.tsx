import type { PropsWithChildren } from 'react';

import FeaturedAuthorAvatar from '@/components/editorial/FeaturedAuthorAvatar';
import FeaturedAuthorsStrip from '@/components/editorial/FeaturedAuthorsStrip';
import { queryKeys } from '@/lib/queryKeys';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { AxiosError } from 'axios';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/services/api/axiosInstanceV2', () => ({
  default: { get: vi.fn() },
}));
vi.mock('@/services/user/user', () => ({ uploadProfileImage: vi.fn() }));
vi.mock('@the-monkeys/ui/hooks/use-toast', () => ({ toast: vi.fn() }));

const pinned = ['k_young', 'innovation_hub', 'euro_centric'];
const deferred = () => {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
};
const decodes = new Map<string, ReturnType<typeof deferred>>();
const objectUrls = new WeakMap<Blob, string>();
const clients: QueryClient[] = [];
const avatar = (username: string) => {
  const blob = new Blob([username], { type: 'image/png' });
  objectUrls.set(blob, `blob:${username}`);
  return blob;
};
const setup = (
  details = [{ username: 'recent_host', first_name: 'Recent' }]
) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  clients.push(client);
  client.setQueryData(queryKeys.profile.activeUsers('24h'), {
    user_details: details,
  });
  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, Wrapper };
};
const seedImages = (
  client: QueryClient,
  names = [...pinned, 'recent_host']
) => {
  for (const name of names)
    client.setQueryData(queryKeys.profile.image(name), avatar(name));
};
const decode = async (username: string, error?: Error) => {
  await waitFor(() => expect(decodes.has(`blob:${username}`)).toBe(true));
  await act(async () => {
    const pending = decodes.get(`blob:${username}`)!;
    if (error) pending.reject(error);
    else pending.resolve();
  });
};

beforeEach(() => {
  vi.resetAllMocks();
  decodes.clear();
  vi.stubGlobal(
    'Image',
    class {
      src = '';
      decode() {
        const pending = deferred();
        decodes.set(this.src, pending);
        return pending.promise;
      }
    }
  );
  vi.stubGlobal(
    'URL',
    class extends URL {
      static createObjectURL = vi.fn((blob: Blob) => objectUrls.get(blob)!);
      static revokeObjectURL = vi.fn();
    }
  );
  vi.mocked(axiosInstanceV2.get).mockImplementation(
    () => new Promise(() => {})
  );
});
afterEach(() => {
  cleanup();
  clients.forEach((client) => client.clear());
  clients.length = 0;
  vi.unstubAllGlobals();
});

describe('FeaturedAuthorsStrip', () => {
  it('uses identical neutral SSR markup even when the browser has cached avatars or absences', () => {
    const server = setup([{ username: 'Dave', first_name: 'Dave' }]);
    const browser = setup([{ username: 'Dave', first_name: 'Dave' }]);
    seedImages(browser.client, pinned);
    browser.client.setQueryData(queryKeys.profile.image('Dave'), null);
    const serverHtml = renderToString(
      <server.Wrapper>
        <FeaturedAuthorsStrip variant='compact' />
      </server.Wrapper>
    );
    const browserHtml = renderToString(
      <browser.Wrapper>
        <FeaturedAuthorsStrip variant='compact' />
      </browser.Wrapper>
    );

    expect(serverHtml).toBe(browserHtml);
    expect(serverHtml).not.toContain('Dave');
    expect(serverHtml).not.toContain('<a');
  });

  it('reveals the complete roster together after decoding and never renders a missing host', async () => {
    const { client, Wrapper } = setup([
      { username: 'Dave', first_name: 'Dave' },
    ]);
    seedImages(client, pinned);
    client.setQueryData(queryKeys.profile.image('Dave'), null);
    render(<FeaturedAuthorsStrip title='Live & hosts' variant='compact' />, {
      wrapper: Wrapper,
    });

    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(screen.getByRole('region').getAttribute('aria-busy')).toBe('true');
    await decode('k_young');
    await decode('innovation_hub');
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    await decode('euro_centric');

    expect(
      screen.getAllByRole('link').map((link) => link.getAttribute('href'))
    ).toEqual(['/k_young', '/innovation_hub', '/euro_centric']);
    expect(screen.getByRole('region').getAttribute('aria-busy')).toBe('false');
    expect(screen.queryByText('Dave')).toBeNull();
  });

  it('waits for active users and their image fetch before settling the strip', async () => {
    const { client, Wrapper } = setup([]);
    client.removeQueries({ queryKey: queryKeys.profile.activeUsers('24h') });
    seedImages(client, pinned);
    let finishUsers!: (value: any) => void;
    let finishImage!: (value: any) => void;
    vi.mocked(axiosInstanceV2.get).mockImplementation(
      (url) =>
        new Promise((resolve) => {
          if (url === '/user/active-users') finishUsers = resolve;
          else if (url === '/storage/profiles/recent_host/profile')
            finishImage = resolve;
        })
    );
    render(<FeaturedAuthorsStrip />, { wrapper: Wrapper });
    for (const username of pinned) await decode(username);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    await act(async () =>
      finishUsers({
        data: {
          user_details: [{ username: 'recent_host', first_name: 'Recent' }],
        },
      })
    );
    await waitFor(() => expect(finishImage).toBeTypeOf('function'));
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    await act(async () => finishImage({ data: avatar('recent_host') }));
    await decode('recent_host');
    expect(screen.getAllByRole('link')).toHaveLength(4);
  });

  it.each([false, true])(
    'settles browsers without Image.decode using load/error (failed=%s)',
    async (failed) => {
      const images: Array<{
        src: string;
        onload: (() => void) | null;
        onerror: (() => void) | null;
      }> = [];
      vi.stubGlobal(
        'Image',
        class {
          src = '';
          onload: (() => void) | null = null;
          onerror: (() => void) | null = null;
          constructor() {
            images.push(this);
          }
        }
      );
      const { client, Wrapper } = setup();
      seedImages(client);
      render(<FeaturedAuthorsStrip />, { wrapper: Wrapper });
      await waitFor(() => expect(images).toHaveLength(4));
      act(() => {
        for (const image of images.slice(0, 3)) image.onload?.();
      });
      expect(screen.queryAllByRole('link')).toHaveLength(0);
      act(() => {
        if (failed) images[3].onerror?.();
        else images[3].onload?.();
      });
      expect(screen.getAllByRole('link')).toHaveLength(failed ? 3 : 4);
      expect(screen.getByRole('region').getAttribute('aria-busy')).toBe(
        'false'
      );
    }
  );

  it('omits decoding failures without blocking successful avatars', async () => {
    const { client, Wrapper } = setup();
    seedImages(client);
    render(<FeaturedAuthorsStrip />, { wrapper: Wrapper });
    for (const username of pinned) await decode(username);
    await decode('recent_host', new Error('Invalid image'));
    expect(screen.getAllByRole('link')).toHaveLength(3);
    expect(screen.queryByText('Recent')).toBeNull();
  });

  it.each([404, 403])(
    'settles a failed avatar request (%s) without blocking the row',
    async (status) => {
      const { client, Wrapper } = setup();
      seedImages(client, pinned);
      vi.mocked(axiosInstanceV2.get).mockRejectedValue(
        new AxiosError('Unavailable', undefined, undefined, undefined, {
          status,
        } as any)
      );
      render(<FeaturedAuthorsStrip />, { wrapper: Wrapper });
      for (const username of pinned) await decode(username);
      await waitFor(() => expect(screen.getAllByRole('link')).toHaveLength(3));
      expect(screen.getByRole('region').getAttribute('aria-busy')).toBe(
        'false'
      );
      expect(screen.queryByText('Recent')).toBeNull();
      expect(
        client.getQueryState(queryKeys.profile.image('recent_host'))?.status
      ).toBe(status === 404 ? 'success' : 'error');
    }
  );

  it('ignores decoding that finishes after an avatar is removed', async () => {
    const { client, Wrapper } = setup();
    seedImages(client);
    render(<FeaturedAuthorsStrip />, { wrapper: Wrapper });
    await waitFor(() => expect(decodes.has('blob:recent_host')).toBe(true));
    act(() => {
      client.setQueryData(queryKeys.profile.activeUsers('24h'), {
        user_details: [],
      });
    });
    for (const username of pinned) await decode(username);
    expect(screen.getAllByRole('link')).toHaveLength(3);
    await decode('recent_host');
    expect(screen.getAllByRole('link')).toHaveLength(3);
    expect(screen.queryByText('Recent')).toBeNull();
  });

  it('waits for a returning host to decode instead of reusing its old readiness', async () => {
    const { client, Wrapper } = setup();
    seedImages(client);
    render(<FeaturedAuthorsStrip />, { wrapper: Wrapper });
    for (const username of [...pinned, 'recent_host']) await decode(username);
    act(() => {
      client.setQueryData(queryKeys.profile.activeUsers('24h'), {
        user_details: [],
      });
    });
    await waitFor(() => expect(screen.getAllByRole('link')).toHaveLength(3));
    decodes.delete('blob:recent_host');
    act(() => {
      client.setQueryData(queryKeys.profile.activeUsers('24h'), {
        user_details: [{ username: 'recent_host', first_name: 'Recent' }],
      });
    });
    await waitFor(() => expect(decodes.has('blob:recent_host')).toBe(true));
    expect(screen.queryAllByRole('link')).toHaveLength(0);
    await decode('recent_host');
    expect(screen.getAllByRole('link')).toHaveLength(4);
  });

  it('renders compact hosts in one horizontally scrollable row with accessible links', async () => {
    const { client, Wrapper } = setup();
    seedImages(client);
    render(<FeaturedAuthorsStrip title='Live & hosts' variant='compact' />, {
      wrapper: Wrapper,
    });
    const scroller = screen.getByRole('region').querySelector('.snap-x')!;
    Object.defineProperties(scroller, {
      clientWidth: { value: 140 },
      scrollWidth: { get: () => scroller.querySelectorAll('a').length * 70 },
    });
    const scrollTo = vi.fn();
    scroller.scrollTo = scrollTo;
    expect(screen.queryByRole('button', { name: 'Scroll right' })).toBeNull();
    for (const username of [...pinned, 'recent_host']) await decode(username);
    fireEvent.click(screen.getByRole('button', { name: 'Scroll right' }));
    expect(scrollTo).toHaveBeenCalledWith({ left: 240, behavior: 'smooth' });
    scroller.scrollLeft = 140;
    fireEvent.scroll(scroller);
    expect(screen.getByRole('button', { name: 'Scroll left' })).not.toBeNull();
    expect(screen.queryByRole('button', { name: 'Scroll right' })).toBeNull();

    const region = screen.getByRole('region', { name: 'Live & hosts' });
    const recentHost = screen.getByRole('link', { name: 'Recent Recent' });
    expect(region.className).toContain('flex');
    expect(region.className).toContain('border-b');
    expect(region.className).not.toContain('border-y');
    expect(
      screen.getByRole('heading', { name: 'Live & hosts' }).className
    ).toContain('shrink-0');
    expect(recentHost.getAttribute('href')).toBe('/recent_host');
    expect(recentHost.className).toContain('snap-start');
    expect(recentHost.className).toContain('focus-visible:ring-2');
    expect(recentHost.querySelector('.h-12')).not.toBeNull();
    expect(screen.getByText('Innovation').getAttribute('title')).toBe(
      'Innovation'
    );
    expect(region.querySelector('.snap-x.overflow-x-auto')).not.toBeNull();
  });

  it('retains standalone avatar routes and default sizing after decode', async () => {
    const { client, Wrapper } = setup([]);
    seedImages(client, ['writer']);
    render(
      <FeaturedAuthorAvatar
        username='writer'
        firstName='Writer'
        href='/people/writer'
      />,
      { wrapper: Wrapper }
    );
    await decode('writer');
    const link = screen.getByRole('link', { name: 'Writer Writer' });
    expect(link.getAttribute('href')).toBe('/people/writer');
    expect(link.querySelector('.h-20.w-20')).not.toBeNull();
    expect(screen.getByAltText('Writer').getAttribute('src')).toBe(
      'blob:writer'
    );
  });
});
