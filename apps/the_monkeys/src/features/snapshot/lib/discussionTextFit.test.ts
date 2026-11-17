import { expect, it } from 'vitest';

import {
  discussionQuoteFontSize,
  estimateDiscussionLines,
} from './discussionTextFit';

it.each([
  '漢'.repeat(250),
  '漢'.repeat(500),
  '🌍'.repeat(250),
  'W'.repeat(500),
  'आ'.repeat(250),
  'line\n'.repeat(100),
  'नमस्ते 🌍 '.repeat(50),
])('fits wide and multilingual text into a square quote', (text) => {
  const font = discussionQuoteFontSize(text, 920, 500);
  expect(
    estimateDiscussionLines(text, font, 920) * font * 1.2
  ).toBeLessThanOrEqual(500);
});
it('keeps short quotes large and readable', () => {
  expect(discussionQuoteFontSize('A short discussion', 920, 500)).toBe(68);
});
