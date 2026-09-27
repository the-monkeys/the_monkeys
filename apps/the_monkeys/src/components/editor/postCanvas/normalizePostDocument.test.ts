import { describe, expect, it } from 'vitest';

import { normalizePostDocument } from './normalizePostDocument';

describe('editor title compatibility', () => {
  it('assigns stable collision-free IDs to legacy body blocks before history starts', () => {
    const doc = {
      blocks: [
        { type: 'title', data: { text: 'Legacy' } },
        { type: 'paragraph', data: { text: 'Body' } },
        {
          id: 'legacy-block-1',
          type: 'paragraph',
          data: { text: 'Existing ID' },
        },
      ],
    };
    const first = normalizePostDocument(doc);
    expect(first.blocks.every((block) => Boolean(block.id))).toBe(true);
    expect(new Set(first.blocks.map((block) => block.id)).size).toBe(3);
    expect(normalizePostDocument(doc)).toEqual(first);
    expect(normalizePostDocument(first)).toEqual(first);
  });
  it('preserves legacy titles and all rich body data without mutating input', () => {
    const doc = {
      blocks: [
        { id: 'old', type: 'title', data: { text: 'Legacy title' } },
        { id: 'body', type: 'list', data: { items: ['One'] } },
      ],
    };
    const normalized = normalizePostDocument(doc);
    expect(normalized.blocks).toEqual([
      { ...doc.blocks[0], id: 'title' },
      doc.blocks[1],
    ]);
    expect(doc.blocks[0].id).toBe('old');
  });
  it('preserves formatted H1 content and existing block metadata', () => {
    const doc = {
      blocks: [
        {
          id: 'title',
          type: 'header',
          data: { text: '<b>Title</b>', level: 1 },
          tunes: { stretched: true },
        },
      ],
    };
    expect(normalizePostDocument(doc)).toEqual(doc);
  });
  it('restores a converted title to H1 without losing its text', () => {
    expect(
      normalizePostDocument({
        blocks: [{ id: 'title', type: 'paragraph', data: { text: 'Changed' } }],
      }).blocks[0]
    ).toEqual({
      id: 'title',
      type: 'header',
      data: { text: 'Changed', level: 1 },
    });
  });
  it('prepends a blank title when only body content remains', () => {
    const body = {
      id: 'body',
      type: 'paragraph',
      data: { text: 'Do not consume this body' },
    };
    expect(normalizePostDocument({ blocks: [body] }).blocks).toEqual([
      { id: 'title', type: 'header', data: { text: '', level: 1 } },
      body,
    ]);
  });
  it('restores exactly one blank H1 to an empty document', () => {
    expect(normalizePostDocument({ blocks: [] }).blocks).toEqual([
      { id: 'title', type: 'header', data: { text: '', level: 1 } },
    ]);
  });
  it('does not consume a body subheading after the title was removed', () => {
    const body = {
      id: 'subheading',
      type: 'header',
      data: { text: 'Body heading', level: 2 },
    };
    expect(normalizePostDocument({ blocks: [body] }).blocks).toEqual([
      { id: 'title', type: 'header', data: { text: '', level: 1 } },
      body,
    ]);
  });
  it('moves an existing title back to the first position without duplicating it', () => {
    const title = {
      id: 'title',
      type: 'header',
      data: { text: 'Moved title', level: 1 },
    };
    const body = { id: 'body', type: 'paragraph', data: { text: 'Body' } };
    expect(normalizePostDocument({ blocks: [body, title] }).blocks).toEqual([
      title,
      body,
    ]);
  });
});
