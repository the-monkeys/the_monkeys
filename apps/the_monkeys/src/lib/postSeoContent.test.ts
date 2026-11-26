import { describe, expect, it } from 'vitest';

import { getPostSeoContent } from './postSeoContent';

describe('shared published post SEO extraction', () => {
  it('preserves public title preference, fallback and substantial description', () => {
    const document = {
      blocks: [
        { id: 'title', type: 'title', data: { text: 'Legacy title' } },
        { type: 'header', data: { text: 'Public heading' } },
        { type: 'paragraph', data: { text: 'Short.' } },
        {
          type: 'paragraph',
          data: {
            text: 'A substantial introduction explains the content clearly to readers.',
          },
        },
      ],
    };
    const before = JSON.stringify(document);
    expect(getPostSeoContent(document)).toMatchObject({
      title: 'Public heading',
      description:
        'A substantial introduction explains the content clearly to readers.',
    });
    expect(JSON.stringify(document)).toBe(before);
  });

  it('returns the existing empty document fallbacks', () => {
    expect(getPostSeoContent(null)).toMatchObject({
      title: 'Published Post',
      description: 'Read this community post on Monkeys.',
      articleBody: '',
    });
  });
});
