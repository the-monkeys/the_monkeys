import { describe, expect, it } from 'vitest';

import { formatTweetDisplayText } from './tweetDisplayText';

describe('formatTweetDisplayText', () => {
  it('strips t.co link when media is present', () => {
    expect(
      formatTweetDisplayText('Please explain !!! https://t.co/8u22Ot9Lhc', true)
    ).toBe('Please explain !!!');
  });

  it('keeps t.co link when there is no media', () => {
    const text = 'Read this https://t.co/abc123';
    expect(formatTweetDisplayText(text, false)).toBe(text);
  });
});
