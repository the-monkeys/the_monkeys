import { describe, expect, it } from 'vitest';

import { MARKDOWN_MAX_BYTES, validateMarkdownFile } from './markdownFile';

describe('validateMarkdownFile', () => {
  it('accepts a small .md file', () => {
    const file = new File(['# Hi'], 'notes.md', { type: 'text/markdown' });
    expect(validateMarkdownFile(file)).toBeNull();
  });

  it('rejects files over 256 KiB', () => {
    const file = new File([new Uint8Array(MARKDOWN_MAX_BYTES + 1)], 'big.md', {
      type: 'text/markdown',
    });
    expect(validateMarkdownFile(file)).toBe('File is too large (max 256 KB).');
  });

  it('rejects images', () => {
    const file = new File(['x'], 'pic.png', { type: 'image/png' });
    expect(validateMarkdownFile(file)).toBe('Use a .md or text file.');
  });
});
