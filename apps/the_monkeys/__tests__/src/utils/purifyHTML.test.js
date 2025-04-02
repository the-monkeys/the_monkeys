import { purifyHTMLString } from '@/utils/purifyHTML';
import { describe, expect, it } from 'vitest';

describe('purifyHTMLString', () => {
  it('returns the same string if it is clean', () => {
    const cleanString = 'Hello, world!';

    const result = purifyHTMLString(cleanString);

    expect(result).toBe(cleanString);
  });

  it('removes malicious scripts from the string', () => {
    const dirtyString = '<script>alert("hacked!")</script>';

    const result = purifyHTMLString(dirtyString);

    expect(result).toBe('');
  });

  it('handles an empty string gracefully', () => {
    const emptyString = '';

    const result = purifyHTMLString(emptyString);

    expect(result).toBe('');
  });
});
