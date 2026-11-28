import { discussionRuneCount, discussionTextError } from '@/services/discussions/discussionText';
import { describe, expect, it } from 'vitest';

describe('discussionText', () => {
  it('counts Unicode code points after trim', () => {
    expect(discussionRuneCount('  hi  ')).toBe(2);
    expect(discussionRuneCount('a😀b')).toBe(3);
  });

  it('rejects an empty body and a body over 500', () => {
    expect(discussionTextError('   ')).toBe('Write something.');
    expect(discussionTextError('a'.repeat(501))).toBe(
      'A discussion can be at most 500 characters.'
    );
    expect(discussionTextError('hello')).toBeNull();
  });
});
