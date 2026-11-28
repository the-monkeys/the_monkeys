import { describe, expect, it } from 'vitest';

import { createDocumentHistory } from './documentHistory';

const titleDraft = {
  blocks: [{ id: 'title', type: 'title', data: { text: 'Hello' } }],
};

const typed = {
  blocks: [
    { id: 'title', type: 'title', data: { text: 'Hello there' } },
    { id: 'p1', type: 'paragraph', data: { text: 'Body' } },
  ],
};

const emptyPost = {
  blocks: [
    {
      id: 'title',
      type: 'header',
      data: { text: 'Untitled Post', level: 1 },
    },
  ],
};

describe('DocumentHistory', () => {
  it('isolates nested image and list data in undo snapshots', () => {
    const doc = {
      blocks: [
        {
          id: 'image',
          type: 'image',
          data: { file: { url: '/image.png' }, items: ['one'] },
        },
      ],
    };
    const history = createDocumentHistory(doc);
    doc.blocks[0].data.file.url = '/changed.png';
    doc.blocks[0].data.items.push('two');
    expect(history.current().blocks[0].data).toEqual({
      file: { url: '/image.png' },
      items: ['one'],
    });
  });
  it('undo of a clear restores the previous document in one step', () => {
    const history = createDocumentHistory(typed);
    history.push(emptyPost);
    expect(history.undo()?.blocks).toEqual(typed.blocks);
    expect(history.redo()?.blocks).toEqual(emptyPost.blocks);
  });

  it('keeps a legacy title block type across clear and undo', () => {
    const history = createDocumentHistory(titleDraft);
    history.push(emptyPost);
    expect(history.undo()?.blocks[0]?.type).toBe('title');
    expect(history.undo()).toBeNull();
  });

  it('starts a new undo step after a pause', () => {
    const history = createDocumentHistory(titleDraft);
    history.coalesce({
      blocks: [{ id: 'title', type: 'title', data: { text: 'Hel' } }],
    });
    history.closeBurst();
    history.coalesce({
      blocks: [{ id: 'title', type: 'title', data: { text: 'Hello there' } }],
    });
    expect(history.undo()?.blocks[0]?.data).toEqual({ text: 'Hel' });
    expect(history.undo()?.blocks[0]?.data).toEqual({ text: 'Hello' });
    expect(history.canUndo()).toBe(false);
  });

  it('coalesces typing into one undo step', () => {
    const history = createDocumentHistory(titleDraft);
    history.coalesce({
      blocks: [{ id: 'title', type: 'title', data: { text: 'H' } }],
    });
    history.coalesce({
      blocks: [{ id: 'title', type: 'title', data: { text: 'He' } }],
    });
    expect(history.undo()?.blocks).toEqual(titleDraft.blocks);
    expect(history.canUndo()).toBe(false);
    expect(history.canRedo()).toBe(true);
  });

  it('does not mutate the caller when the stack changes', () => {
    const history = createDocumentHistory(titleDraft);
    history.push(emptyPost);
    titleDraft.blocks[0].data.text = 'changed outside';
    expect(history.undo()?.blocks[0]?.data).toEqual({ text: 'Hello' });
  });
});
