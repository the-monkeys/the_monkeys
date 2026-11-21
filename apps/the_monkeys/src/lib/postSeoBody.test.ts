import { describe, expect, it } from 'vitest';

import { getPostSeoContent } from './postSeoContent';
import { canonicalPostDocumentTitleSlug } from './postUrl';

describe('published article body extraction', () => {
  it('reads modern nested lists and tables without changing the published title or slug', () => {
    const document = {
      blocks: [
        { type: 'header', data: { text: 'हिंदी और Go' } },
        {
          type: 'list',
          data: {
            items: [
              {
                content:
                  'Learn <b>Go</b> with working examples and practical exercises.',
                items: [{ content: 'Build a tested HTTP API.', items: [] }],
              },
            ],
          },
        },
        {
          type: 'table',
          data: {
            content: [
              ['Stage', 'Practice'],
              ['Databases', 'Use SQL transactions'],
            ],
          },
        },
      ],
    };
    const before = JSON.stringify(document);
    const slug = canonicalPostDocumentTitleSlug(document);
    const content = getPostSeoContent(document);
    expect(content.description).toBe(
      'Learn Go with working examples and practical exercises. Build a tested HTTP API.'
    );
    expect(content.articleBody).toContain(
      'Stage Practice Databases Use SQL transactions'
    );
    expect(content.articleBody).not.toContain('[object Object]');
    expect(content.title).toBe('हिंदी और Go');
    expect(canonicalPostDocumentTitleSlug(document)).toBe(slug);
    expect(JSON.stringify(document)).toBe(before);
  });

  it('retains legacy string lists while skipping malformed list and table values', () => {
    const content = getPostSeoContent({
      blocks: [
        { type: 'header', data: { text: 'Published title' } },
        {
          type: 'list',
          data: {
            items: [
              'First',
              { content: 'Second', items: [null, { content: 'Third' }] },
              42,
              {},
            ],
          },
        },
        {
          type: 'table',
          data: { content: [null, ['Useful cell', {}, false]] },
        },
      ],
    });
    expect(content.articleBody).toBe(
      'Published title First Second Third Useful cell'
    );
    expect(content.articleBody).not.toContain('[object Object]');
  });
});
