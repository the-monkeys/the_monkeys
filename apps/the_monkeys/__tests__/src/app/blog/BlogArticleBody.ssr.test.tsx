// @vitest-environment node
import {
  ArticleBodyFallback,
  BlogArticleBody,
} from '@/app/blog/components/BlogArticleBody';
import type { OutputData } from '@themonkeys/monkeys-editor';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

function documentData(
  blocks: { type: string; data: Record<string, unknown> }[]
) {
  return { blocks } as OutputData;
}

function html(blocks: { type: string; data: Record<string, unknown> }[]) {
  return renderToStaticMarkup(
    <ArticleBodyFallback data={documentData(blocks)} />
  );
}

afterEach(() => vi.unstubAllGlobals());

describe('article body server rendering', () => {
  it('renders through the real Next dynamic SSR loading path without requests or a browser', () => {
    const fetchMock = vi.fn(() => {
      throw new Error('Unexpected request');
    });
    vi.stubGlobal('fetch', fetchMock);
    const result = renderToStaticMarkup(
      <BlogArticleBody
        data={documentData([
          { type: 'paragraph', data: { text: 'नमस्ते <b>世界</b> مرحبا' } },
          { type: 'header', data: { level: 2, text: 'Start here' } },
        ])}
      />
    );

    expect(result).toContain('नमस्ते <b>世界</b> مرحبا');
    expect(result).toContain('<h2 class="ce-header">Start here</h2>');
    expect(result).not.toContain('<script');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sanitizes inline HTML across paragraphs, lists, quotes, tables and captions', () => {
    const attack =
      '<script>alert(1)</script><img src=x onerror="alert(2)"><svg onload="alert(3)"></svg><a href="javascript:alert(4)">bad link</a><strong>Safe</strong>';
    const result = html([
      { type: 'paragraph', data: { text: attack } },
      {
        type: 'list',
        data: { items: [attack, { content: attack, items: [] }] },
      },
      { type: 'quote', data: { text: attack, caption: attack } },
      {
        type: 'table',
        data: { withHeadings: true, content: [[attack], ['Cell']] },
      },
      {
        type: 'image',
        data: { caption: attack, file: { url: 'javascript:alert(5)' } },
      },
    ]);

    expect(result).toContain('<strong>Safe</strong>');
    expect(result).toContain('<th>');
    expect(result).toContain('<td>Cell</td>');
    expect(result).not.toMatch(
      /<script|<img|<svg|onerror|onload|javascript:|alert\(/i
    );
  });

  it('preserves safe links while dropping editor-supplied attributes and markup', () => {
    const result = html([
      {
        type: 'paragraph',
        data: {
          text: '<a href="/topics/go" target="_blank" onclick="evil()" style="color:red">Go</a><iframe src="https://example.test"></iframe>',
        },
      },
    ]);
    expect(result).toContain('<a href="/topics/go">Go</a>');
    expect(result).not.toMatch(/onclick|target=|style=|iframe/);
  });

  it('keeps both legacy string lists and nested structured lists readable', () => {
    const result = html([
      {
        type: 'list',
        data: {
          style: 'ordered',
          items: [
            'First',
            {
              content: '<i>Second</i>',
              items: [{ content: 'Nested', items: [] }],
            },
          ],
        },
      },
    ]);
    expect(result).toContain('<ol class="cdx-list">');
    expect(result).toContain('<i>Second</i>');
    expect(result).toContain('<ol class="cdx-list__sublist">');
    expect(result).toContain('Nested');
  });

  it('escapes code, Markdown and research text instead of treating it as executable HTML', () => {
    const result = html([
      { type: 'code', data: { code: '<script>run()</script>\nif a < b {}' } },
      {
        type: 'markdown',
        data: { markdown: '# 世界\n<script>run()</script>' },
      },
      {
        type: 'citation',
        data: {
          title: '<img src=x onerror=run()>',
          citationText: 'Published research',
        },
      },
    ]);
    expect(result).toContain('&lt;script&gt;run()&lt;/script&gt;');
    expect(result).toContain('if a &lt; b {}');
    expect(result).toContain('# 世界');
    expect(result).toContain('Published research');
    expect(result).not.toMatch(/<script|<img/);
  });

  it('rejects unsafe image and embed URLs while preserving safe existing URLs', () => {
    const result = html([
      {
        type: 'image',
        data: {
          file: { url: 'https://example.test/photo.png' },
          caption: 'Photo',
        },
      },
      { type: 'image', data: { file: { url: 'data:image/svg+xml,evil' } } },
      { type: 'image', data: { file: { url: '//example.test/photo.png' } } },
      { type: 'embed', data: { url: 'javascript:evil()' } },
      { type: 'embed', data: { url: '/existing-link' } },
    ]);
    expect(result).toContain('src="https://example.test/photo.png"');
    expect(result).toContain(
      '<figcaption class="image-tool__caption">Photo</figcaption>'
    );
    expect(result).toContain('<a href="/existing-link">/existing-link</a>');
    expect(result.match(/<img /g)).toHaveLength(1);
    expect(result).not.toMatch(/javascript:|data:image|src="\/\//);
  });

  it('handles absent data and malformed optional block fields without throwing', () => {
    expect(renderToStaticMarkup(<BlogArticleBody />)).toBe('');
    expect(
      renderToStaticMarkup(<ArticleBodyFallback data={documentData([])} />)
    ).toBe('');
    const result = html([
      { type: 'header', data: { level: '<script>', text: 'Heading' } },
      { type: 'list', data: { items: [null, 1, { items: 'invalid' }] } },
      { type: 'table', data: { content: [null, ['Valid cell']] } },
      { type: 'unknown', data: { text: 'Readable legacy text' } },
    ]);
    expect(result).toContain('<h2 class="ce-header">Heading</h2>');
    expect(result).toContain('Valid cell');
    expect(result).toContain('Readable legacy text');
  });
});
