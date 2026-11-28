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

it('reserves the whole row occupied by a wrapped word box', () => {
  expect(estimateDiscussionLines('WWWWWWWWWWWW a', 10, 100)).toBe(3);
});

it('fits mixed full-row words in the compact preview at the character limit', () => {
  const text = ('W'.repeat(80) + ' a'.repeat(10) + ' ').repeat(5).slice(0, 500);
  const font = discussionQuoteFontSize(text, 1104, 280, 48);
  expect(
    estimateDiscussionLines(text, font, 1104) * font * 1.2
  ).toBeLessThanOrEqual(280);
});
