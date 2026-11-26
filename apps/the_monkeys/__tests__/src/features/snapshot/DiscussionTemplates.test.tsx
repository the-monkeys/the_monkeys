import { SNAPSHOT_TEMPLATES } from '@/features/snapshot/registry';
import { DEFAULT_THEME_ID, getThemeById } from '@/features/snapshot/themes';
import type { SnapshotInput } from '@/features/snapshot/types';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

const input: SnapshotInput = {
  source: 'discussion',
  title: 'Discussion',
  description: 'Hello world',
  quote: 'Hello world',
  author: { username: 'alice', displayName: 'Alice', isVerified: true },
  sourceUrl: 'http://localhost:3000/discussions/abc',
};

describe.each(SNAPSHOT_TEMPLATES)('$id discussion export', (template) => {
  it('includes the original attribution and the template-specific source treatment', () => {
    const html = renderToStaticMarkup(
      <template.Render
        input={input}
        theme={getThemeById(DEFAULT_THEME_ID)}
        accent='#ff5544'
      />
    );
    expect(html).toContain('@alice');
    expect(html).toContain('Verified account');
    if (template.id === 'quote-card')
      expect(html).not.toContain(input.sourceUrl);
    else expect(html).toContain(input.sourceUrl);
  });
  it('does not invent a badge for unverified or legacy authors', () => {
    const html = renderToStaticMarkup(
      <template.Render
        input={{
          ...input,
          author: { username: 'alice', displayName: 'Alice' },
        }}
        theme={getThemeById(DEFAULT_THEME_ID)}
        accent='#ff5544'
      />
    );
    expect(html).not.toContain('Verified account');
  });
});

it('preserves a complete multilingual discussion in the default portrait', () => {
  const body = 'हिंदी चर्चा 🌍 '.repeat(45);
  const template = SNAPSHOT_TEMPLATES[0];
  const html = renderToStaticMarkup(
    <template.Render
      input={{ ...input, description: body }}
      theme={getThemeById(DEFAULT_THEME_ID)}
      accent='#ff5544'
    />
  );
  expect(html).toContain(body);
});

it('uses the same curved quote graphic in Studio and server-rendered snaps', () => {
  const template = SNAPSHOT_TEMPLATES.find((t) => t.id === 'quote-card')!;
  const render = (server: boolean) =>
    renderToStaticMarkup(
      <template.Render
        input={input}
        theme={getThemeById(DEFAULT_THEME_ID)}
        accent='#FF5542'
        {...(server
          ? {
              renderSize: { width: 1080, height: 1080 },
              assetUrls: {
                logo: 'data:image/svg+xml,test',
                verifiedBadge: 'data:image/svg+xml,test',
              },
            }
          : {})}
      />
    );
  const parser = new DOMParser();
  const mark = (html: string) =>
    parser
      .parseFromString(html, 'text/html')
      .querySelector('img[data-snapshot-quote]')
      ?.getAttribute('src');
  expect(mark(render(false))).toContain('data:image/svg+xml');
  expect(mark(render(true))).toBe(mark(render(false)));
});

it('exports full long discussion text in the quote-card layout without forced line overflow', () => {
  const body = 'हिंदी चर्चा 🌍 '.repeat(45);
  const template = SNAPSHOT_TEMPLATES.find((t) => t.id === 'quote-card')!;
  const html = renderToStaticMarkup(
    <template.Render
      input={{ ...input, quote: body }}
      theme={getThemeById(DEFAULT_THEME_ID)}
      accent='#ff5544'
    />
  );
  expect(
    new DOMParser().parseFromString(html, 'text/html').body.textContent
  ).toContain(body);
  expect(html).not.toContain('white-space:pre-wrap');
  expect(html).toContain('overflow-wrap:anywhere');
});
