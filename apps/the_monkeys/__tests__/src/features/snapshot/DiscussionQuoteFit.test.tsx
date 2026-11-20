import { quoteCard } from '@/features/snapshot/templates/QuoteCard';
import { DEFAULT_THEME_ID, getThemeById } from '@/features/snapshot/themes';
import type { SnapshotInput } from '@/features/snapshot/types';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

const input: SnapshotInput = {
  source: 'discussion',
  title: 'Discussion',
  quote: 'A discussion with a long #DigitalTransformation hashtag.',
  sourceUrl: 'http://localhost:3000/discussions/example',
  author: {
    username: 'buddhicintaka',
    displayName: 'Buddhicintaka',
    isVerified: true,
  },
};
function documentFor(value = input, compact = false) {
  const Render = quoteCard.Render;
  return new DOMParser().parseFromString(
    renderToStaticMarkup(
      <Render
        input={value}
        theme={getThemeById(DEFAULT_THEME_ID)}
        accent='#FF5542'
        {...(compact ? { renderSize: { width: 1200, height: 630 } } : {})}
      />
    ),
    'text/html'
  );
}
describe('discussion quote exports', () => {
  it('wraps long hashtags and unbroken text inside the available canvas', () => {
    for (const body of [
      'W'.repeat(500),
      '#' + 'DigitalTransformation'.repeat(20),
      'हिंदी चर्चा '.repeat(40),
      'line\n'.repeat(100),
    ]) {
      const doc = documentFor({ ...input, quote: body });
      const text = Array.from(doc.querySelectorAll('div')).find(
        (n) => n.textContent === body && n.style.flexWrap === 'wrap'
      )!;
      expect(text).toBeDefined();
      expect(text.style.width).toBe('100%');
      expect(text.style.wordBreak).toBe('break-word');
      expect(text.style.minWidth).toBe('0');
      expect(text.textContent).toBe(body);
    }
  });
  it('removes the source URL from the quote image while keeping the source input intact', () => {
    const before = JSON.stringify(input);
    expect(documentFor().body.textContent).not.toContain(input.sourceUrl);
    expect(JSON.stringify(input)).toBe(before);
  });
  it.each([false, true])(
    'makes the original handle and real verification badge readable, compact=%s',
    (compact) => {
      const doc = documentFor(input, compact);
      const handle = Array.from(doc.querySelectorAll('span')).find(
        (n) => n.textContent === '@buddhicintaka' && n.children.length === 0
      )!;
      expect(handle).toBeDefined();
      const byline = handle.parentElement!.parentElement!;
      expect(parseFloat(byline.style.fontSize)).toBeGreaterThanOrEqual(
        compact ? 28 : 36
      );
      expect(
        doc.querySelector('img[alt="Verified account"]')?.getAttribute('width')
      ).toBe(compact ? '28' : '36');
    }
  );
  it('preserves the old non-discussion quote layout and attribution', () => {
    const doc = documentFor({
      ...input,
      source: 'manual',
      author: { username: 'alice', displayName: 'Alice' },
    });
    expect(doc.body.textContent).toContain('Alice');
    expect(doc.body.textContent).toContain('@alice');
    expect(doc.querySelector('[data-snapshot-quote]')).toBeNull();
  });
});
