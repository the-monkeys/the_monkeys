import { describe, expect, it } from 'vitest';

import { isTweetUrl, parseTweetId } from './parseTweetUrl';

describe('parseTweetId', () => {
  it('parses x.com status URLs', () => {
    expect(
      parseTweetId('https://x.com/elonmusk/status/1234567890123456789')
    ).toBe('1234567890123456789');
  });

  it('parses twitter.com status URLs', () => {
    expect(parseTweetId('https://twitter.com/jack/status/20?s=20')).toBe('20');
  });

  it('accepts raw numeric ids', () => {
    expect(parseTweetId('1234567890123456789')).toBe('1234567890123456789');
  });

  it('rejects non-tweet URLs', () => {
    expect(parseTweetId('https://monkeys.com.co/blog/foo')).toBeNull();
    expect(isTweetUrl('https://monkeys.com.co')).toBe(false);
  });
});
