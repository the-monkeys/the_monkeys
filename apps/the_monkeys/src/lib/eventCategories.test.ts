import { describe, expect, it } from 'vitest';

import {
  EVENT_CATEGORIES,
  mergeCategoryTags,
  partitionTags,
} from './eventCategories';

describe('EVENT_CATEGORIES', () => {
  it('uses the discover slugs', () => {
    expect(EVENT_CATEGORIES.map((c) => c.tag)).toEqual([
      'networking',
      'tech',
      'writing',
      'outdoor',
      'sports',
    ]);
  });
});

describe('mergeCategoryTags', () => {
  it('dedupes, lowercases, and keeps extras', () => {
    expect(
      mergeCategoryTags(['Writing', 'tech'], ['chai', 'tech', '  '])
    ).toEqual(['writing', 'tech', 'chai']);
  });
});

describe('partitionTags', () => {
  it('splits known chips from extra slugs', () => {
    expect(partitionTags(['Writing', 'chai', 'tech'])).toEqual({
      selected: ['writing', 'tech'],
      extra: 'chai',
    });
  });
});
