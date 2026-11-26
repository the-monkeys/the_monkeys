import { activeMention, insertMention } from '@/lib/discussionMentions';
import { describe, expect, it } from 'vitest';

describe('activeMention', () => {
  it.each([
    ['hi @da', 6, { start: 3, query: 'da' }],
    ['@chimp', 6, { start: 0, query: 'chimp' }],
    ['hi @da there', 6, { start: 3, query: 'da' }],
    ['line\n@dave.k', 12, { start: 5, query: 'dave.k' }],
  ])('finds the mention in %j at %i', (value, caret, expected) => {
    expect(activeMention(value, caret)).toEqual(expected);
  });

  it.each([
    ['hi @', 4],
    ['mail dave@x', 11],
    ['see https://x.com/@ab', 21],
    ['hi @da there', 12],
  ])('ignores %j at %i', (value, caret) => {
    expect(activeMention(value, caret)).toBeNull();
  });
});

describe('insertMention', () => {
  it('replaces the typed query and adds a space at the end', () => {
    expect(insertMention('hi @da', { start: 3, query: 'da' }, 'dave')).toEqual({
      value: 'hi @dave ',
      caret: 9,
    });
  });

  it('reuses the following space in the middle of text', () => {
    expect(
      insertMention('hi @da there', { start: 3, query: 'da' }, 'dave')
    ).toEqual({ value: 'hi @dave there', caret: 9 });
  });
});
