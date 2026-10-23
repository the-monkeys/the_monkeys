import { describe, expect, it } from 'vitest';

import { applyEditsToList, planBlockEdits } from './planBlockEdits';

const title = (text: string) => ({
  id: 'title',
  type: 'header',
  data: { text, level: 1 },
});

const paragraph = (text: string) => ({
  id: 'p1',
  type: 'paragraph',
  data: { text },
});

describe('planBlockEdits', () => {
  it('updates text without deleting the block', () => {
    const current = [title('Hello')];
    const next = [title('Hello there')];
    const edits = planBlockEdits(current, next);
    expect(edits).toEqual([
      { op: 'update', id: 'title', data: { text: 'Hello there', level: 1 } },
    ]);
    expect(applyEditsToList(current, edits)).toEqual(next);
  });

  it('inserts a paragraph and leaves the title block in place', () => {
    const current = [title('Hello')];
    const next = [title('Hello'), paragraph('Body')];
    const edits = planBlockEdits(current, next);
    expect(edits.map((edit) => edit.op)).toEqual(['insert']);
    expect(applyEditsToList(current, edits)).toEqual(next);
  });

  it('removes a paragraph without touching the title text', () => {
    const current = [title('Hello'), paragraph('Body')];
    const next = [title('Hello')];
    const edits = planBlockEdits(current, next);
    expect(edits).toEqual([{ op: 'delete', index: 1 }]);
    expect(applyEditsToList(current, edits)).toEqual(next);
  });

  it('never deletes the last block before inserting a replacement title', () => {
    const current = [{ id: 'body', type: 'paragraph', data: { text: 'Body' } }];
    const next = [title('')];
    const edits = planBlockEdits(current, next);
    let count = current.length;
    for (const edit of edits) {
      if (edit.op === 'delete') count--;
      if (edit.op === 'insert') count++;
      expect(count).toBeGreaterThan(0);
    }
    expect(applyEditsToList(current, edits)).toEqual(next);
  });
});
