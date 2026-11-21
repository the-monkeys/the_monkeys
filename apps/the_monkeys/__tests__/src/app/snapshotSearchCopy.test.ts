import { STUDIO_HELP } from '@/app/snapshot/new/StudioHelp';
import { generateMetadata } from '@/app/snapshot/new/page';
import { describe, expect, it } from 'vitest';

describe('X search copy', () => {
  it('matches the observed X screenshot query without changing the canonical URL', async () => {
    const meta = await generateMetadata({ searchParams: { view: 'x' } });
    expect(meta.title).toEqual({
      absolute: 'Free X Screenshot Generator (Twitter) | Monkeys',
    });
    expect(meta.alternates?.canonical).toBe(
      'https://monkeys.com.co/snapshot/new?view=x'
    );
    expect(meta.description).toContain('PNG');
    expect(meta.description).not.toContain('JPEG');
  });
  it('answers supported links and mobile saving questions in the existing help', () => {
    expect(
      STUDIO_HELP.x.faqs.some(
        (f) => f.question === 'Can I use both Twitter and X links?'
      )
    ).toBe(true);
    expect(
      STUDIO_HELP.x.faqs.some(
        (f) => f.question === 'Can I save a tweet image on my phone?'
      )
    ).toBe(true);
  });
});
