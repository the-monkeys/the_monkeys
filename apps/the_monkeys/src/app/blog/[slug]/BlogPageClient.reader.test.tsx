import { BLOG_DETAIL_QUERY_KEY } from '@/hooks/blog/useGetPublishedBlogDetailByBlogId';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import BlogPageClient from './BlogPageClient';

vi.mock('next/navigation', () => ({ useRouter: () => ({}) }));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: { account_id: 'author' } }),
}));
vi.mock('@/hooks/user/useGetProfileInfoByUserId', () => ({
  default: () => ({}),
}));
// Keep the real hydrated blog query, article canvas and body. Isolate unrelated
// controls whose requests are outside this reader regression's boundary.
vi.mock('@/components/blog/actions/EditBlogDialog', () => ({
  EditBlogDialog: () => <button>Edit</button>,
}));
vi.mock('@/components/buttons/backButton', () => ({
  BackButton: () => <button>Back</button>,
}));
vi.mock('@/components/user/userInfo', () => ({
  UserInfoCardBlogPage: () => null,
}));
vi.mock('@/components/social/SocialSnapshot', () => ({
  SocialSnapshotCard: () => <div>Social snapshot</div>,
}));
vi.mock('@/components/topics/topicsContainer', () => ({
  TopicLinksContainerCompact: () => null,
}));
vi.mock('../components/BlogRecommendations', () => ({
  BlogRecommendations: () => null,
}));
vi.mock('../components/BlogScopeLine', () => ({ BlogScopeLine: () => null }));
vi.mock('../components/BlogReactions', () => ({
  BlogReactionsContainer: ({ showShare }: { showShare: boolean }) => (
    <div>{showShare && <button>Share</button>}</div>
  ),
}));

function article(blocks: unknown[], audience = 'public') {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  client.setQueryData([BLOG_DETAIL_QUERY_KEY, 'fixture'], {
    blog_id: 'fixture',
    owner_account_id: 'author',
    is_draft: false,
    published_time: '2026-11-17T00:00:00Z',
    tags: [],
    audience,
    blog: { time: 1, blocks },
  });
  return (
    <QueryClientProvider client={client}>
      <BlogPageClient urlBlogId='fixture' fullSlug='fixture' />
    </QueryClientProvider>
  );
}

afterEach(cleanup);

describe('published article reader', () => {
  it('retains readable fields and links from unknown historical tools', () => {
    const root = body([
      {
        type: 'historical-tool',
        data: {
          heading: 'Historical custom heading',
          content: ['Historical custom body'],
          resource: { url: 'https://example.test/archive' },
        },
      },
    ]);
    expect(root.textContent).toContain('Historical custom heading');
    expect(root.textContent).toContain('Historical custom body');
    expect(root.querySelector('a')?.getAttribute('href')).toBe(
      'https://example.test/archive'
    );
  });
  function body(blocks: unknown[]) {
    const root = document.createElement('div');
    root.innerHTML = renderToString(
      article([{ type: 'title', data: { text: 'Fixture' } }, ...blocks])
    );
    return root.querySelector('[data-post-canvas]')!;
  }

  it.each([
    { type: 'title', data: { text: 'Legacy heading' } },
    { type: 'header', data: { text: 'Legacy heading', level: 1 } },
    { type: 'header', data: { text: 'Legacy heading', level: 2 } },
    { id: 'title', type: 'paragraph', data: { text: 'Legacy heading' } },
  ])('does not duplicate historical title shape $type/$data.level', (title) => {
    const root = document.createElement('div');
    root.innerHTML = renderToString(
      article([
        title,
        { type: 'paragraph', data: { text: 'Body after title' } },
      ])
    );
    expect(root.textContent?.match(/Legacy heading/g)).toHaveLength(1);
    expect(root.querySelector('[data-post-canvas]')?.textContent).toContain(
      'Body after title'
    );
  });

  it('preserves both string lists and nested object lists, inline mentions and table headings', () => {
    const root = body([
      {
        type: 'list',
        data: { style: 'unordered', items: ['Old <i>item</i>', 'Second'] },
      },
      {
        type: 'list',
        data: {
          style: 'ordered',
          items: [{ content: 'Parent', items: [{ content: 'Child' }] }],
        },
      },
      {
        type: 'paragraph',
        data: {
          text: '<a class="mention-user" data-id="123" data-username="writer" href="/profile/writer">@writer</a>',
        },
      },
      {
        type: 'table',
        data: {
          withHeadings: true,
          content: [
            ['Column', 'Other'],
            ['Value', '<b>Cell</b>'],
          ],
        },
      },
      {
        type: 'quote',
        data: {
          text: 'A quotation',
          caption: 'Attribution',
          alignment: 'center',
        },
      },
      { type: 'header', data: { text: 'Section heading', level: 3 } },
      { type: 'delimiter', data: {} },
    ]);
    expect(root.querySelector('ul li i')?.textContent).toBe('item');
    expect(root.querySelector('ol ol li')?.textContent).toBe('Child');
    expect(
      root.querySelector('a[data-username="writer"]')?.getAttribute('href')
    ).toBe('/profile/writer');
    expect(root.querySelector('th')?.textContent).toBe('Column');
    expect(root.querySelector('td b')?.textContent).toBe('Cell');
    expect(root.querySelector('blockquote')?.textContent).toContain(
      'Attribution'
    );
    expect(root.querySelector('h3')?.textContent).toBe('Section heading');
    expect(root.querySelector('[role="separator"], hr')).toBeTruthy();
  });

  it('preserves file and legacy URL images and their presentation flags', () => {
    const root = body([
      {
        type: 'image',
        data: {
          file: { url: '/fixture.jpg' },
          caption: 'File caption',
          stretched: true,
          withBorder: true,
          withBackground: true,
        },
      },
      {
        type: 'image',
        data: { url: 'https://example.test/old.jpg', caption: 'Old caption' },
      },
    ]);
    expect(root.querySelector('img')?.getAttribute('src')).toBe('/fixture.jpg');
    expect(root.querySelectorAll('img')).toHaveLength(2);
    expect(
      root.querySelector(
        '.image-tool--stretched.image-tool--withBorder.image-tool--withBackground'
      )
    ).toBeTruthy();
  });

  it('preserves inline mention avatars without executable attributes or unsafe image URLs', () => {
    const root = body([
      {
        type: 'paragraph',
        data: {
          text: '<a class="mention-card" href="/profile/writer"><span class="mention-card-avatar"><img src="/avatar.png" alt="writer" onerror="bad()"></span><span>@writer</span></a><img src="javascript:bad()">',
        },
      },
    ]);
    expect(
      root.querySelector('.mention-card-avatar img')?.getAttribute('src')
    ).toBe('/avatar.png');
    expect(root.querySelector('[onerror], [src^="javascript:"]')).toBeNull();
  });

  it('sanitizes active HTML, hostile links, image URLs and attributes while keeping formatting', () => {
    const root = body([
      {
        type: 'paragraph',
        data: {
          text: '<script>alert(1)</script><b>Safe bold</b><em>Safe emphasis</em><a href="javascript:alert(1)" onclick="alert(1)">Bad link</a><a href="https://example.test" target="_blank">Good link</a><img src="x" onerror="alert(1)"><svg onload="alert(1)"></svg><iframe srcdoc="bad"></iframe>',
        },
      },
      {
        type: 'image',
        data: {
          file: { url: 'javascript:alert(1)' },
          caption: '<img src=x onerror=alert(1)>',
        },
      },
      {
        type: 'list',
        data: {
          items: ['<img src=x onerror=alert(1)>List text'],
          style: 'unordered',
        },
      },
      {
        type: 'citation',
        data: {
          title: 'Citation title',
          citationText: '<b>Safe citation</b><script>bad()</script>',
        },
      },
      {
        type: 'markdown',
        data: {
          markdown:
            '**Safe Markdown** <img src=x onerror=alert(1)> [bad](javascript:alert(1))',
        },
      },
    ]);
    expect(root.textContent).toContain('Safe bold');
    expect(root.querySelector('b')?.textContent).toBe('Safe bold');
    expect(root.querySelector('em')?.textContent).toBe('Safe emphasis');
    expect(root.textContent).toContain('Safe citation');
    expect(root.textContent).toContain('Safe Markdown');
    expect(
      root.querySelector(
        'script, iframe, svg, [onclick], [onerror], [onload], [href^="javascript:"], [src^="javascript:"]'
      )
    ).toBeNull();
    expect(
      root.querySelector('a[href="https://example.test"]')?.getAttribute('rel')
    ).toContain('noopener');
  });

  it('renders rich research blocks and Markdown as initial content without edit inputs', () => {
    const root = body([
      {
        type: 'chart',
        data: {
          title: 'Study chart',
          type: 'bar',
          labels: ['Jan', 'Feb'],
          series: [{ name: 'Readers', values: [1, 2] }],
          showLegend: true,
        },
      },
      {
        type: 'trend',
        data: { periodLabels: ['Jan', 'Feb'], values: [100, 120] },
      },
      {
        type: 'formula',
        data: {
          expression: 'E = mc^2',
          description: 'Energy equation',
          mode: 'display',
        },
      },
      {
        type: 'methodology',
        data: { studyDesign: 'A cohort study', limitations: 'Small sample' },
      },
      {
        type: 'dataset',
        data: {
          title: 'Cohort data',
          sampleSize: '200',
          notes: 'Historical notes',
        },
      },
      {
        type: 'citation',
        data: { title: 'Research paper', authors: 'A. Writer', year: '2025' },
      },
      {
        type: 'markdown',
        data: {
          markdown:
            '## Markdown section\n\nText with **emphasis** and [source](https://example.test/source)',
        },
      },
    ]);
    for (const text of [
      'Study chart',
      'Readers',
      '20%',
      'Energy equation',
      'A cohort study',
      'Small sample',
      'Cohort data',
      '200',
      'Historical notes',
      'Research paper',
      'A. Writer',
      'Markdown section',
    ])
      expect(root.textContent).toContain(text);
    expect(root.querySelector('svg')).toBeTruthy();
    expect(root.querySelector('.katex')).toBeTruthy();
    expect(
      root.querySelector('[data-markdown-preview] strong')?.textContent
    ).toBe('emphasis');
    expect(
      root.querySelector('input, textarea, [contenteditable="true"]')
    ).toBeNull();
  });

  it('does not execute chart labels interpolated into SVG', () => {
    const root = body([
      {
        type: 'chart',
        data: {
          labels: ['</text><script>bad()</script><text>'],
          series: [{ name: 'Safe series', values: [1] }],
        },
      },
    ]);
    expect(root.querySelector('svg')).toBeTruthy();
    expect(root.querySelector('script')).toBeNull();
  });

  it('keeps current and historical embeds safe and useful before hydration', () => {
    const root = body([
      {
        type: 'embed',
        data: { service: 'youtube', url: 'https://youtu.be/abcdefghijk?t=5' },
      },
      {
        type: 'embed',
        data: {
          service: 'youtube',
          source: 'https://www.youtube.com/watch?v=123456789ab',
          embed: 'https://www.youtube.com/embed/123456789ab',
          caption: 'Older video',
        },
      },
      {
        type: 'embed',
        data: { service: 'twitter', url: 'https://x.com/writer/status/123' },
      },
      {
        type: 'embed',
        data: {
          service: 'instagram',
          url: 'https://www.instagram.com/p/example/',
        },
      },
      {
        type: 'embed',
        data: {
          service: 'facebook',
          url: 'https://www.facebook.com/writer/posts/123',
        },
      },
      {
        type: 'embed',
        data: { service: 'unknown', url: 'https://example.test/resource' },
      },
      {
        type: 'embed',
        data: {
          service: 'youtube',
          url: 'https://evil.test/?v=abcdefghijk',
          embed: 'https://evil.test/frame',
        },
      },
      {
        type: 'embed',
        data: { service: 'twitter', url: 'javascript:alert(1)' },
      },
    ]);
    expect(root.querySelectorAll('iframe')).toHaveLength(2);
    expect(root.querySelector('iframe')?.getAttribute('src')).toBe(
      'https://www.youtube.com/embed/abcdefghijk'
    );
    expect(root.querySelectorAll('a')).toHaveLength(5);
    expect(
      root.querySelector('[href^="javascript:"], [src*="evil.test"]')
    ).toBeNull();
    expect(root.textContent).toContain('Older video');
  });

  it('escapes code and preserves its copy action', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    render(
      article([
        {
          type: 'code',
          data: { code: '<script>literal code</script>', language: 'html' },
        },
      ])
    );
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === 'CODE' &&
          element.textContent === '<script>literal code</script>'
      )
    ).toBeTruthy();
    expect(document.querySelector('code script')).toBeNull();
    await act(async () =>
      screen.getByRole('button', { name: 'Copy code to clipboard' }).click()
    );
    expect(writeText).toHaveBeenCalledWith('<script>literal code</script>');
  });

  it('retains syntax highlighting in initial code blocks', () => {
    const root = body([
      {
        type: 'code',
        data: { code: 'const value = 1;', language: 'javascript' },
      },
    ]);
    expect(root.querySelector('.token.keyword')?.textContent).toBe('const');
    expect(root.querySelector('code')?.textContent).toBe('const value = 1;');
  });

  it('includes the visible body once in the initial HTML, inside the current canvas', () => {
    const html = renderToString(
      article([
        { type: 'title', data: { text: 'Historical title' } },
        { type: 'paragraph', data: { text: 'Searchable article <b>body</b>' } },
      ])
    );
    const root = document.createElement('div');
    root.innerHTML = html;
    expect(root.querySelector('[data-post-canvas]')?.textContent).toContain(
      'Searchable article body'
    );
    expect(root.querySelectorAll('b')).toHaveLength(1);
    expect(root.querySelectorAll('h1')).toHaveLength(1);
    expect(root.textContent?.match(/Historical title/g)).toHaveLength(1);
    expect(
      root.querySelector(
        '[data-post-canvas] [hidden], [data-post-canvas] .sr-only'
      )
    ).toBeNull();
  });

  it('keeps the hydrated body single and retains author and audience controls', () => {
    render(
      article(
        [
          { type: 'header', data: { text: 'Members article', level: 1 } },
          { type: 'paragraph', data: { text: 'Members body' } },
        ],
        'group_only'
      )
    );
    expect(screen.getAllByText('Members body')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Edit' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Share' })).toBeNull();
    expect(screen.queryByText('Social snapshot')).toBeNull();
  });
});
