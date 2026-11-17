// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { generateSlug } from './generateSlug';

describe('multilingual article slugs', () => {
  it.each([
    ['भारत में तकनीक', 'भारत-में-तकनीक'],
    ['हिंदी AI 2026', 'हिंदी-ai-2026'],
    ['ಕನ್ನಡ ಭಾಷೆ', 'ಕನ್ನಡ-ಭಾಷೆ'],
    ['தமிழ் மொழி', 'தமிழ்-மொழி'],
    ['বাংলা ভাষা', 'বাংলা-ভাষা'],
    ['العِلْم اليوم', 'العِلْم-اليوم'],
    ['日本語の記事', '日本語の記事'],
    ['中文 文章', '中文-文章'],
    ['Привет мир', 'привет-мир'],
    ['Über moderne Städte', 'über-moderne-städte'],
    ['Café déjà vu', 'café-déjà-vu'],
    ['क्\u200dष', 'क्ष'],
  ])('preserves letters and marks in %s', (title, expected) => {
    expect(generateSlug(title)).toBe(expected);
  });
  it.each([
    ['Hello World', 'hello-world'],
    ["A creator’s guide to John's work", 'a-creator-guide-to-john-work'],
    ['C++ / C# & AI', 'c-c-ai'],
    ['  Already---a_slug 2026! ', 'already-a-slug-2026'],
  ])('preserves the previous ASCII result for %s', (title, expected) => {
    expect(generateSlug(title)).toBe(expected);
  });
  it('uses one composed Unicode representation without changing visible title data', () => {
    const decomposed = 'Cafe\u0301';
    expect(generateSlug(decomposed)).toBe(generateSlug('Café'));
    expect(decomposed).toBe('Cafe\u0301');
  });
  it.each(['', '   ', '!!!', '👩\u200d💻', '\u0301', '\ud800'])(
    'has a readable fallback for %j',
    (title) => {
      expect(generateSlug(title)).toBe('untitled-post');
      expect(() => encodeURIComponent(generateSlug(title))).not.toThrow();
    }
  );
});
