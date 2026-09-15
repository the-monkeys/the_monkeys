import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { inlineImagesForExport } from './inlineImagesForExport';

describe('inlineImagesForExport', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => new Blob(['fake-image-bytes'], { type: 'image/png' }),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('awaits img.decode() after inlining image dataUrl to prevent blank captures', async () => {
    const root = document.createElement('div');
    const img = document.createElement('img');
    img.setAttribute(
      'src',
      'https://pbs.twimg.com/profile_images/123/avatar.jpg'
    );

    let decoded = false;
    img.decode = vi.fn().mockImplementation(async () => {
      // Simulate async decoding delay
      await new Promise((r) => setTimeout(r, 20));
      decoded = true;
    });

    root.appendChild(img);

    await inlineImagesForExport(root);

    expect(img.getAttribute('src')).toMatch(/^data:image\/png;base64,/);
    expect(img.decode).toHaveBeenCalled();
    expect(decoded).toBe(true);
  });
});
