import { describe, expect, it } from 'vitest';

import { withFirstBlockTitleId } from './withFirstBlockTitleId';

describe('withFirstBlockTitleId', () => {
  it('sets id title on the first block without changing its type', () => {
    const blocks = [
      { id: 'abc123', type: 'header', data: { text: 'Hello', level: 1 } },
      { id: 'p1', type: 'paragraph', data: { text: 'Body' } },
    ];
    expect(withFirstBlockTitleId(blocks)).toEqual([
      { id: 'title', type: 'header', data: { text: 'Hello', level: 1 } },
      { id: 'p1', type: 'paragraph', data: { text: 'Body' } },
    ]);
  });

  it('leaves an already-titled first block unchanged', () => {
    const blocks = [
      { id: 'title', type: 'header', data: { text: 'Hello', level: 1 } },
    ];
    expect(withFirstBlockTitleId(blocks)).toBe(blocks);
  });

  it('does not convert a leftover TitleBlock type to header', () => {
    const blocks = [{ id: 'title', type: 'title', data: { text: 'Hello' } }];
    expect(withFirstBlockTitleId(blocks)).toBe(blocks);
    expect(blocks[0].type).toBe('title');
  });

  it('stamps id title on a leftover TitleBlock without changing type', () => {
    const blocks = [{ id: 'abc', type: 'title', data: { text: 'Hello' } }];
    expect(withFirstBlockTitleId(blocks)).toEqual([
      { id: 'title', type: 'title', data: { text: 'Hello' } },
    ]);
  });
});
