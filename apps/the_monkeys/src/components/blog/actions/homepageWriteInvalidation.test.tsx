import type { PropsWithChildren } from 'react';

import ScheduledBlogCard from '@/components/cards/blog/ScheduledBlogCard';
import axiosInstance from '@/services/api/axiosInstance';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import { homepageBlogQuery } from '@/services/blog/homepageApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DeleteBlogDialog } from './DeleteBlogDialog';
import { EditBlogDialog } from './EditBlogDialog';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: { username: 'author' } }),
}));
vi.mock('@/components/icon', () => ({ default: () => null }));
vi.mock('@/components/loader', () => ({ Loader: () => null }));
vi.mock('@/components/blog/getBlogContent', () => ({
  BlogImage: () => null,
  BlogPlaceholderImage: () => null,
}));
vi.mock('@the-monkeys/ui/hooks/use-toast', () => ({ toast: vi.fn() }));
vi.mock('@/services/api/axiosInstance', () => ({
  default: { delete: vi.fn() },
}));
vi.mock('@/services/api/axiosInstanceV2', () => ({
  default: { post: vi.fn() },
}));
beforeEach(() => {
  vi.mocked(axiosInstance.delete).mockResolvedValue({ status: 200 });
  vi.mocked(axiosInstanceV2.post).mockResolvedValue({ status: 200 });
  vi.stubGlobal('confirm', () => true);
});
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
  vi.unstubAllGlobals();
});
function setup() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const homes = [
    homepageBlogQuery().queryKey,
    homepageBlogQuery({ sort: 'trending', offset: 12 }).queryKey,
  ];
  for (const key of homes) qc.setQueryData(key, { blogs: [] });
  qc.setQueryData(['meta-feed-blogs', 12], { blogs: ['ordinary'] });
  qc.setQueryData(['trending-blogs'], { blogs: ['ordinary'] });
  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  const assertRefreshed = async () => {
    await waitFor(() => {
      for (const key of homes)
        expect(qc.getQueryState(key)?.isInvalidated).toBe(true);
    });
    expect(qc.getQueryState(['meta-feed-blogs', 12])?.isInvalidated).toBe(
      false
    );
    expect(qc.getQueryState(['trending-blogs'])?.isInvalidated).toBe(false);
  };
  return { qc, homes, Wrapper, assertRefreshed };
}
describe('homepage refreshes after article withdrawal writes', () => {
  it.each([false, true])(
    'refreshes after deleting an article (draft=%s)',
    async (isDraft) => {
      const { Wrapper, assertRefreshed } = setup();
      render(<DeleteBlogDialog blogId='article' isDraft={isDraft} />, {
        wrapper: Wrapper,
      });
      fireEvent.click(screen.getByTitle('Delete Blog'));
      fireEvent.click(
        screen.getByRole('button', {
          name: isDraft ? 'Yes, Remove' : 'Yes, Delete',
        })
      );
      await assertRefreshed();
    }
  );
  it.each(['Move', 'Move & Edit'])(
    'refreshes after %s to drafts',
    async (name) => {
      const { Wrapper, assertRefreshed } = setup();
      render(<EditBlogDialog blogId='article' />, { wrapper: Wrapper });
      fireEvent.click(screen.getByTitle('Convert to Draft'));
      fireEvent.click(screen.getByRole('button', { name }));
      await assertRefreshed();
    }
  );
  it('refreshes after cancelling a scheduled article back to drafts', async () => {
    const { Wrapper, assertRefreshed } = setup();
    render(
      <ScheduledBlogCard
        blog={{ blog_id: 'article', title: 'Article', first_image: '' } as any}
      />,
      { wrapper: Wrapper }
    );
    fireEvent.click(screen.getByRole('button', { name: 'To Drafts' }));
    await assertRefreshed();
  });
  it('leaves homepage caches intact when deletion fails', async () => {
    const { qc, homes, Wrapper } = setup();
    vi.mocked(axiosInstance.delete).mockRejectedValue(
      new Error('Write failed')
    );
    render(<DeleteBlogDialog blogId='article' />, { wrapper: Wrapper });
    fireEvent.click(screen.getByTitle('Delete Blog'));
    const button = screen.getByRole('button', { name: 'Yes, Delete' });
    fireEvent.click(button);
    await waitFor(() => expect(button.hasAttribute('disabled')).toBe(false));
    for (const key of homes)
      expect(qc.getQueryState(key)?.isInvalidated).toBe(false);
  });
});
