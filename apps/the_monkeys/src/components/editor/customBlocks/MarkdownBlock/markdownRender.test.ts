import { describe, expect, it } from 'vitest';

import { renderMarkdownHtml } from './markdownRender';

describe('renderMarkdownHtml', () => {
  it('renders a heading', async () => {
    const html = await renderMarkdownHtml('# Hello');
    expect(html).toContain('<h1>');
    expect(html).toContain('Hello');
  });

  it('strips script tags and javascript URLs', async () => {
    const html = await renderMarkdownHtml(
      '<script>alert(1)</script>\n[x](javascript:alert(1))'
    );
    expect(html.toLowerCase()).not.toContain('<script');
    expect(html.toLowerCase()).not.toContain('javascript:');
  });

  it('does not emit img for markdown images', async () => {
    const html = await renderMarkdownHtml('![x](https://example.com/a.png)');
    expect(html.toLowerCase()).not.toContain('<img');
  });

  it('renders h4 as h3', async () => {
    const html = await renderMarkdownHtml('#### Deep');
    expect(html).toContain('<h3>');
    expect(html).not.toContain('<h4>');
  });
});
