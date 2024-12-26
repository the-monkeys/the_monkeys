import { purifyHTMLString } from '@/utils/purifyHTML';
import { describe, expect, it } from 'vitest';

describe('purifyHTMLString', () => {
  it('returns the same string if it is clean', () => {
    const cleanString = 'Hello, world!';
    expect(purifyHTMLString(cleanString)).toBe(cleanString);
  });

  it('removes malicious scripts from the string', () => {
    const dirtyString = '<script>alert("hacked!")</script>';
    expect(purifyHTMLString(dirtyString)).toBe('');
  });

  it('handles an empty string gracefully', () => {
    expect(purifyHTMLString('')).toBe('');
  });

  it('throws an error for non-string inputs', () => {
    // @ts-expect-error Testing non-string input
    expect(() => purifyHTMLString(null)).toThrow();
  });
});
