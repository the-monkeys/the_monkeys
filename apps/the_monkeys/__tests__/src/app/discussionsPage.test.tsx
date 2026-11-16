// @vitest-environment node
import DiscussionsPage from '@/app/discussions/page';
import { loadSiteDiscussions } from '@/lib/discussionPageData';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, expect, it, vi } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: () => ({ toString: () => 'session=reader' }),
}));
vi.mock('@/lib/discussionPageData', async (original) => ({
  ...(await original<typeof import('@/lib/discussionPageData')>()),
  loadSiteDiscussions: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
  usePathname: () => '/discussions',
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('@/hooks/auth/useAuth', () => ({ default: () => ({ data: null }) }));
vi.mock('@/hooks/user/useUser', () => ({
  default: () => ({ user: undefined }),
}));
vi.mock('@/hooks/groups/useGroupQueries', () => ({
  useGroupDetail: () => ({ data: undefined }),
}));

beforeEach(() => vi.mocked(loadSiteDiscussions).mockReset());

it('server renders the requested older page on the existing route with the reader cookie', async () => {
  vi.mocked(loadSiteDiscussions).mockResolvedValue({
    discussions: [
      { public_id: 'old', body: 'Older public thread', status: 'visible' },
    ],
  });
  const page = await DiscussionsPage({
    searchParams: { before_id: 'older/id' },
  });
  expect(renderToStaticMarkup(page)).toContain('Older public thread');
  expect(loadSiteDiscussions).toHaveBeenCalledWith(
    'older/id',
    'session=reader'
  );
});

it('includes the older anchor with existing control styling in server HTML', async () => {
  vi.mocked(loadSiteDiscussions).mockResolvedValue({
    discussions: Array.from({ length: 20 }, (_, i) => ({
      public_id: `p${i}`,
      body: `Thread ${i}`,
      status: 'visible',
    })),
    nextBeforeId: 'p19',
  });
  const html = renderToStaticMarkup(await DiscussionsPage({}));
  expect(html).toMatch(
    /<a[^>]*href="\/discussions\?before_id=p19"[^>]*>Older discussions<\/a>/
  );
  expect(html).toContain('h-8');
  expect(html).toContain('border-2');
  expect(html).toContain('/discussions/p0#replies');
});

it.each([['duplicate', 'cursor'], 'bad cursor', 'x'.repeat(201)])(
  'does not forward malformed query cursors: %s',
  async (before_id) => {
    vi.mocked(loadSiteDiscussions).mockResolvedValue({ discussions: [] });
    await DiscussionsPage({ searchParams: { before_id } });
    expect(loadSiteDiscussions).toHaveBeenCalledWith(
      undefined,
      'session=reader'
    );
  }
);
