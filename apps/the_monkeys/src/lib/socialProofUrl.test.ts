import { describe, expect, it } from 'vitest';

import { socialProofUrlError } from './socialProofUrl';

describe('socialProofUrlError', () => {
  it('accepts public http(s) profile links', () => {
    expect(socialProofUrlError('https://linkedin.com/in/ada')).toBeNull();
    expect(socialProofUrlError(' http://instagram.com/ada ')).toBeNull();
  });

  it('rejects empty and non-http URLs', () => {
    expect(socialProofUrlError('')).toMatch(/profile link/i);
    expect(socialProofUrlError('javascript:alert(1)')).toMatch(/http/i);
    expect(socialProofUrlError('not a url')).toMatch(/http/i);
  });
});
