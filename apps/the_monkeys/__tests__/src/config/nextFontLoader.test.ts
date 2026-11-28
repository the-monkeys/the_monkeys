// @vitest-environment node
import { createRequire } from 'node:module';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const require = createRequire(import.meta.url);
const base = 'next/dist/compiled/@next/font/dist/google/';
const cssModule = require(base + 'fetch-css-from-google-fonts');
const fileModule = require(base + 'fetch-font-file');
const loaderPath = require.resolve(base + 'loader');

describe('production Google font loading', () => {
  beforeEach(() => {
    delete require.cache[loaderPath];
  });
  afterEach(() => vi.restoreAllMocks());

  function load(url: string, buffer = Buffer.from('wOF2local-font-fixture')) {
    vi.spyOn(cssModule, 'fetchCSSFromGoogleFonts').mockResolvedValue(
      `/* latin */\n@font-face {\n  font-family: 'Inter';\n  font-weight: 400;\n  src: url(${url}) format('woff2');\n}`
    );
    vi.spyOn(fileModule, 'fetchFontFile').mockResolvedValue(buffer);
    const emitFontFile = vi.fn(() => '/_next/static/media/font.woff2');
    const result = require(loaderPath).default({
      functionName: 'Inter',
      data: [
        {
          weight: '400',
          subsets: ['latin'],
          display: 'swap',
          adjustFontFallback: false,
        },
      ],
      emitFontFile,
      isDev: false,
      isServer: true,
    });
    return { result, emitFontFile };
  }

  it.each([
    'https://fonts.gstatic.com/s/inter/font.woff2',
    'https://fonts.gstatic.com/s/inter/font.woff2?version=1',
    'https://fonts.gstatic.com/l/font?kit=local-test&skey=local-test',
  ])('self-hosts a valid font from %s', async (url) => {
    const { result, emitFontFile } = load(url);
    const font = await result;
    expect(emitFontFile).toHaveBeenCalledWith(
      expect.any(Buffer),
      'woff2',
      true,
      false
    );
    expect(font.css).toContain('url(/_next/static/media/font.woff2)');
    expect(font.css).not.toContain(url);
  });

  it('rejects an unknown response rather than emitting an invalid font', async () => {
    const { result, emitFontFile } = load(
      'https://fonts.gstatic.com/l/font?kit=bad',
      Buffer.from('<html>not a font</html>')
    );
    await expect(result).rejects.toThrow('Unsupported font file format');
    expect(emitFontFile).not.toHaveBeenCalled();
  });
});
