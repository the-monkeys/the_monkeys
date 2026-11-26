import type { PropsWithChildren } from 'react';

import ProfileImage from '@/components/profileImage';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import { uploadProfileImage } from '@/services/user/user';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import { AxiosError } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import useProfileImage, { useUploadProfileImage } from './useProfileImage';

vi.mock('@/services/api/axiosInstanceV2', () => ({
  default: { get: vi.fn() },
}));
vi.mock('@/services/user/user', () => ({ uploadProfileImage: vi.fn() }));
vi.mock('@the-monkeys/ui/hooks/use-toast', () => ({ toast: vi.fn() }));
vi.mock('next/image', () => ({
  default: ({ unoptimized, quality, ...props }: any) => <img {...props} />,
}));
const clients: QueryClient[] = [];
const wrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  clients.push(client);
  return {
    client,
    Wrapper: ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  };
};
const missing = () =>
  new AxiosError('missing', 'ERR_BAD_REQUEST', undefined, undefined, {
    status: 404,
  } as any);
beforeEach(() => {
  vi.resetAllMocks();
  URL.createObjectURL = vi
    .fn()
    .mockImplementation((blob: Blob) => `blob:${blob.size}`);
  URL.revokeObjectURL = vi.fn();
});
afterEach(() => {
  cleanup();
  clients.forEach((client) => client.clear());
  clients.length = 0;
  focusManager.setFocused(undefined);
});

describe('public avatar cache', () => {
  it('caches a missing avatar as successful null across mounts and focus', async () => {
    vi.mocked(axiosInstanceV2.get).mockRejectedValue(missing());
    const { client, Wrapper } = wrapper();
    const first = renderHook(() => useProfileImage('alice'), {
      wrapper: Wrapper,
    });
    await waitFor(() => expect(first.result.current.isLoading).toBe(false));
    expect(client.getQueryData(['profile-image', 'alice'])).toBeNull();
    expect(first.result.current.isError).toBe(false);
    first.unmount();
    const second = renderHook(() => useProfileImage('alice'), {
      wrapper: Wrapper,
    });
    await act(async () => {
      focusManager.setFocused(false);
      focusManager.setFocused(true);
    });
    expect(second.result.current.imageUrl).toBe('');
    expect(axiosInstanceV2.get).toHaveBeenCalledTimes(1);
  });
  it('reuses the stable public URL on revalidation without timestamps', async () => {
    vi.mocked(axiosInstanceV2.get).mockResolvedValue({
      data: new Blob(['old']),
    });
    const { client, Wrapper } = wrapper();
    const hook = renderHook(() => useProfileImage('alice'), {
      wrapper: Wrapper,
    });
    await waitFor(() => expect(hook.result.current.imageUrl).toBe('blob:3'));
    await act(async () => {
      await client.invalidateQueries({ queryKey: ['profile-image', 'alice'] });
    });
    expect(axiosInstanceV2.get).toHaveBeenCalledTimes(2);
    for (const [url] of vi.mocked(axiosInstanceV2.get).mock.calls)
      expect(url).toBe('/storage/profiles/alice/profile');
  });
  it.each([
    new Error('offline'),
    new AxiosError('denied', undefined, undefined, undefined, {
      status: 403,
    } as any),
  ])(
    'keeps real failures as errors with the existing fallback',
    async (error) => {
      vi.mocked(axiosInstanceV2.get).mockRejectedValue(error);
      const { client, Wrapper } = wrapper();
      render(<ProfileImage username='alice' alt='Alice' />, {
        wrapper: Wrapper,
      });
      await waitFor(() =>
        expect(client.getQueryState(['profile-image', 'alice'])?.status).toBe(
          'error'
        )
      );
      expect(screen.getByAltText('Alice').getAttribute('src')).toBe(
        '/default-profile.svg'
      );
      expect(axiosInstanceV2.get).toHaveBeenCalledTimes(1);
    }
  );
  it('releases blob URLs when replacing avatars and unmounting', async () => {
    const old = new Blob(['old']);
    const next = new Blob(['changed']);
    vi.mocked(axiosInstanceV2.get).mockResolvedValue({ data: old });
    const { client, Wrapper } = wrapper();
    const hook = renderHook(() => useProfileImage('alice'), {
      wrapper: Wrapper,
    });
    await waitFor(() => expect(hook.result.current.imageUrl).toBe('blob:3'));
    act(() => {
      client.setQueryData(['profile-image', 'alice'], next);
    });
    await waitFor(() => expect(hook.result.current.imageUrl).toBe('blob:7'));
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:3');
    hook.unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:7');
  });
  it('updates all mounted avatars after upload without a stale read replacing them', async () => {
    const old = new Blob(['old']);
    const file = new File(['uploaded'], 'avatar.png', { type: 'image/png' });
    vi.mocked(axiosInstanceV2.get).mockResolvedValue({ data: old });
    vi.mocked(uploadProfileImage).mockResolvedValue({});
    const { client, Wrapper } = wrapper();
    const hook = renderHook(
      () => ({
        first: useProfileImage('alice'),
        second: useProfileImage('alice'),
        upload: useUploadProfileImage({
          username: 'alice',
          onSuccess: vi.fn(),
          onError: vi.fn(),
        }),
      }),
      { wrapper: Wrapper }
    );
    await waitFor(() =>
      expect(hook.result.current.first.imageUrl).toBe('blob:3')
    );
    await act(async () => {
      await hook.result.current.upload.mutateAsync(file);
    });
    await waitFor(() =>
      expect(hook.result.current.first.imageUrl).toBe('blob:8')
    );
    expect(hook.result.current.second.imageUrl).toBe('blob:8');
    expect(client.getQueryData(['profile-image', 'alice'])).toBe(file);
    expect(axiosInstanceV2.get).toHaveBeenCalledTimes(1);
  });
  it('prevents an in-flight pre-upload response from replacing the uploaded file', async () => {
    const old = new Blob(['old']);
    const file = new File(['uploaded'], 'avatar.png', { type: 'image/png' });
    let finishOld!: (response: any) => void;
    vi.mocked(axiosInstanceV2.get)
      .mockResolvedValueOnce({ data: old })
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            finishOld = resolve;
          })
      );
    vi.mocked(uploadProfileImage).mockResolvedValue({});
    const { client, Wrapper } = wrapper();
    const hook = renderHook(
      () => ({
        image: useProfileImage('alice'),
        upload: useUploadProfileImage({
          username: 'alice',
          onSuccess: vi.fn(),
          onError: vi.fn(),
        }),
      }),
      { wrapper: Wrapper }
    );
    await waitFor(() =>
      expect(hook.result.current.image.imageUrl).toBe('blob:3')
    );
    let refreshing!: Promise<void>;
    act(() => {
      refreshing = client.invalidateQueries({
        queryKey: ['profile-image', 'alice'],
      });
    });
    await waitFor(() => expect(axiosInstanceV2.get).toHaveBeenCalledTimes(2));
    const readSignal = vi.mocked(axiosInstanceV2.get).mock.calls[1][1]?.signal;
    await act(async () => {
      await hook.result.current.upload.mutateAsync(file);
    });
    expect(readSignal?.aborted).toBe(true);
    await act(async () => {
      finishOld({ data: old });
      await refreshing;
    });
    await waitFor(() =>
      expect(hook.result.current.image.imageUrl).toBe('blob:8')
    );
    expect(client.getQueryData(['profile-image', 'alice'])).toBe(file);
  });
  it('recovers from a cached missing avatar immediately after upload', async () => {
    vi.mocked(axiosInstanceV2.get).mockRejectedValue(missing());
    vi.mocked(uploadProfileImage).mockResolvedValue({});
    const { Wrapper } = wrapper();
    const hook = renderHook(
      () => ({
        image: useProfileImage('alice'),
        upload: useUploadProfileImage({
          username: 'alice',
          onSuccess: vi.fn(),
          onError: vi.fn(),
        }),
      }),
      { wrapper: Wrapper }
    );
    await waitFor(() =>
      expect(hook.result.current.image.isLoading).toBe(false)
    );
    await act(async () => {
      await hook.result.current.upload.mutateAsync(
        new File(['new'], 'avatar.png', { type: 'image/png' })
      );
    });
    await waitFor(() =>
      expect(hook.result.current.image.imageUrl).toBe('blob:3')
    );
    expect(hook.result.current.image.isError).toBe(false);
    expect(axiosInstanceV2.get).toHaveBeenCalledTimes(1);
  });
  it('retains dimensions and classes and falls back if image decoding fails', async () => {
    vi.mocked(axiosInstanceV2.get).mockResolvedValue({
      data: new Blob(['bad image']),
    });
    const { Wrapper } = wrapper();
    render(<ProfileImage username='alice' alt='Alice' />, { wrapper: Wrapper });
    const fallback = screen.getByAltText('Alice');
    expect(fallback.getAttribute('width')).toBe('32');
    await waitFor(() =>
      expect(screen.getByAltText('Alice').getAttribute('src')).toBe('blob:9')
    );
    const image = screen.getByAltText('Alice');
    expect(image.getAttribute('width')).toBe('50');
    expect(image.getAttribute('height')).toBe('50');
    expect(image.className).toBe('w-full h-full object-cover rounded-full');
    fireEvent.error(image);
    expect(screen.getByAltText('Alice').getAttribute('src')).toBe(
      '/default-profile.svg'
    );
    expect(screen.getByAltText('Alice').getAttribute('width')).toBe('32');
  });
});
