import { describe, expect, it } from 'vitest';

import { readEditorDocument } from './readEditorDocument';

describe('editor snapshot structure', () => {
  it('retries if a new block appears while saving instead of deleting its text', async () => {
    const body = {
      id: 'body',
      type: 'paragraph',
      data: { text: 'New typing' },
    };
    const live = [{ id: 'old', name: 'paragraph', isEmpty: true }];
    let saves = 0;
    const doc = await readEditorDocument({
      save: async () => {
        if (++saves === 1) {
          live.push({ id: 'body', name: 'paragraph', isEmpty: false });
          return { blocks: [] };
        }
        return { blocks: [body] };
      },
      blocks: {
        getBlocksCount: () => live.length,
        getBlockByIndex: (i) => live[i],
      },
    });
    expect(doc.blocks).toContainEqual(body);
    expect(saves).toBe(2);
  });
  it('retains empty text blocks that the library saver filters out', async () => {
    const title = {
      id: 'title',
      type: 'header',
      data: { text: 'Title', level: 1 },
    };
    const live = [
      { id: 'title', name: 'header', isEmpty: false },
      { id: 'empty', name: 'paragraph', isEmpty: true },
    ];
    const doc = await readEditorDocument({
      save: async () => ({ blocks: [title] }),
      blocks: { getBlocksCount: () => 2, getBlockByIndex: (i) => live[i] },
    });
    expect(doc.blocks).toEqual([
      title,
      { id: 'empty', type: 'paragraph', data: { text: '' } },
    ]);
  });
  it('does not bypass validation for nonempty rejected tool content', async () => {
    const doc = await readEditorDocument({
      save: async () => ({ blocks: [] }),
      blocks: {
        getBlocksCount: () => 1,
        getBlockByIndex: () => ({
          id: 'bad',
          name: 'paragraph',
          isEmpty: false,
        }),
      },
    });
    expect(doc.blocks).toEqual([]);
  });
});
