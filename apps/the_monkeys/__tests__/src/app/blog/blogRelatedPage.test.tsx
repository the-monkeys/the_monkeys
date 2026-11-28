import {
  loadBlogForViewer,
  loadPublicBlogForSeo,
} from '@/app/blog/[slug]/blogData';
import BlogPage from '@/app/blog/[slug]/page';
import { loadPublicRelatedPosts } from '@/lib/relatedPosts';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/app/blog/[slug]/blogData', () => ({
  loadBlogForViewer: vi.fn(),
  loadPublicBlogForSeo: vi.fn(),
  loadPublicAuthorForSeo: vi.fn(),
}));
vi.mock('@/lib/relatedPosts', () => ({ loadPublicRelatedPosts: vi.fn() }));
vi.mock('@/app/blog/[slug]/BlogPageClient', () => ({ default: () => null }));
vi.mock('@/utils/get-query-client', () => ({
  getQueryClient: () => ({ setQueryData: vi.fn() }),
}));
vi.mock('@tanstack/react-query', async (original) => ({
  ...(await original()),
  dehydrate: () => ({}),
}));
beforeEach(() => vi.clearAllMocks());
function clientProps(tree: any): any {
  const children = Array.isArray(tree.props.children)
    ? tree.props.children
    : [tree.props.children];
  return children.find((child: any) => child?.props?.urlBlogId)?.props;
}
describe('article server recommendation integration', () => {
  it('uses the anonymous DTO for JSON-LD even when the viewer revealed a raw article', async () => {
    const viewer = {
      blog_id: '123',
      owner_account_id: '',
      is_draft: false,
      tags: [],
      blog: {
        time: 1,
        blocks: [{ type: 'header', data: { text: 'Private headline' } }],
      },
      content_rating: { is_nsfw: true, revealed: true },
    };
    vi.mocked(loadBlogForViewer).mockResolvedValue(viewer as never);
    vi.mocked(loadPublicBlogForSeo).mockResolvedValue({
      ...viewer,
      blog: { time: 1, blocks: [] },
      content_rating: { is_nsfw: true, revealed: false },
    } as never);
    const tree = await BlogPage({ params: { slug: 'original-123' } });
    const children = tree.props.children as any[];
    expect(children.some((child) => child?.type === 'script')).toBe(false);
    expect(loadPublicBlogForSeo).toHaveBeenCalledWith('123');
  });

  it('retains the client retry when the viewer article is temporarily unavailable', async () => {
    vi.mocked(loadBlogForViewer).mockResolvedValue(undefined);
    const tree = await BlogPage({ params: { slug: 'existing-id' } });
    expect(clientProps(tree).initialRelatedPosts).toBeUndefined();
    expect(loadPublicBlogForSeo).not.toHaveBeenCalled();
  });
  it('never queries public related content using a private article', async () => {
    vi.mocked(loadBlogForViewer).mockResolvedValue({
      blog_id: 'id',
      audience: 'group_only',
      is_draft: false,
      tags: ['Private'],
    } as never);
    const tree = await BlogPage({ params: { slug: 'existing-id' } });
    expect(clientProps(tree).initialRelatedPosts).toEqual([]);
    expect(loadPublicBlogForSeo).not.toHaveBeenCalled();
    expect(loadPublicRelatedPosts).not.toHaveBeenCalled();
  });
});
