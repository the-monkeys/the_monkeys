// @vitest-environment node
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { PostReader } from './PostReader';
import { readerDocument } from './readerHtml';

describe('reader without browser globals', () => {
  it('renders content and rich blocks without the DOM-dependent editor runtime or data migration', () => {
    const document = {
      time: 123,
      blocks: [
        { id: 'title', type: 'paragraph', data: { text: 'Saved title' } },
        {
          type: 'paragraph',
          data: { text: 'Server text <strong>available</strong>' },
        },
        {
          type: 'list',
          data: {
            style: 'unordered',
            items: [
              'Old item',
              { content: 'Parent', items: ['Nested old item'] },
            ],
          },
        },
        { type: 'markdown', data: { markdown: '**Server Markdown**' } },
        { type: 'formula', data: { expression: 'x^2', mode: 'inline' } },
        {
          type: 'code',
          data: { code: 'const safe = true;', language: 'javascript' },
        },
        {
          type: 'embed',
          data: { source: 'https://www.youtube.com/watch?v=abcdefghijk' },
        },
      ],
    };
    const before = JSON.stringify(document);
    const html = renderToString(
      <PostReader blocks={readerDocument(document).blocks} />
    );
    expect(html).toContain('Server text <strong>available</strong>');
    expect(html).toContain('<strong>Server Markdown</strong>');
    expect(html).toContain('Nested old item');
    expect(html).toContain('katex');
    expect(html).toContain('token keyword');
    expect(html).toContain('https://www.youtube.com/embed/abcdefghijk');
    expect(JSON.stringify(document)).toBe(before);
    expect(typeof window).toBe('undefined');
  });
});
