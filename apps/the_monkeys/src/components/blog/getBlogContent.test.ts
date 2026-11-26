import type { OutputBlockData } from '@themonkeys/monkeys-editor';
import { describe, expect, it } from 'vitest';

import { isDocumentTitleBlock, withoutPostTitle } from './getBlogContent';

type TextBlock = OutputBlockData<string, { text: string; level?: number }>;

describe('isDocumentTitleBlock', () => {
  it('accepts a TitleBlock leftover from older drafts', () => {
    const block: TextBlock = { type: 'title', data: { text: 'Hello' } };
    expect(isDocumentTitleBlock(block)).toBe(true);
  });

  it('accepts Heading 1 like main create post', () => {
    const block: TextBlock = {
      type: 'header',
      data: { text: 'Hello', level: 1 },
    };
    expect(isDocumentTitleBlock(block)).toBe(true);
  });

  it('rejects Heading 2 as the post title', () => {
    const block: TextBlock = {
      type: 'header',
      data: { text: 'Section', level: 2 },
    };
    expect(isDocumentTitleBlock(block)).toBe(false);
  });
});

describe('withoutPostTitle', () => {
  it('strips the first Heading 1 so the article body does not repeat the title', () => {
    const data = {
      time: 1,
      blocks: [
        { id: 'title', type: 'header', data: { text: 'Hello', level: 1 } },
        { type: 'paragraph', data: { text: 'Body' } },
      ],
    };
    expect(withoutPostTitle(data)?.blocks).toEqual([
      { type: 'paragraph', data: { text: 'Body' } },
    ]);
  });

  it('keeps later section headings after the title header is removed', () => {
    const data = {
      time: 1,
      blocks: [
        { id: 'title', type: 'header', data: { text: 'Hello', level: 1 } },
        { type: 'header', data: { text: 'Section', level: 2 } },
      ],
    };
    expect(withoutPostTitle(data)?.blocks).toEqual([
      { type: 'header', data: { text: 'Section', level: 2 } },
    ]);
  });

  it('strips a leftover TitleBlock so it is not a second heading in the body', () => {
    const data = {
      time: 1,
      blocks: [
        { id: 'title', type: 'title', data: { text: 'Untitled Post' } },
        { type: 'header', data: { text: 'Real Title', level: 1 } },
      ],
    };
    expect(withoutPostTitle(data)?.blocks).toEqual([
      { type: 'header', data: { text: 'Real Title', level: 1 } },
    ]);
  });
});
