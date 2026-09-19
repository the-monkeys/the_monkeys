import { describe, expect, it } from 'vitest';

import {
  LEGAL_PUBLISHER_ID,
  LEGAL_PUBLISHER_NAME,
  MONKEYS_BRAND_ID,
  MONKEYS_WEBSITE_ID,
  monkeysBrand,
  monkeysWebsite,
  noIndexFollowRobots,
  normalizeSeoText,
  publisherOrg,
} from './seo';

describe('SEO primitives', () => {
  it('connects the Monkeys brand and website to the legal publisher', () => {
    expect(LEGAL_PUBLISHER_NAME).toBe('Buddhicintaka (OPC) Pvt. Ltd.');
    expect(LEGAL_PUBLISHER_ID).toBe('https://buddhicintaka.com/#organization');
    expect(MONKEYS_BRAND_ID).toBe('https://monkeys.com.co/#brand');
    expect(MONKEYS_WEBSITE_ID).toBe('https://monkeys.com.co/#website');
    expect(publisherOrg()).toMatchObject({
      '@id': LEGAL_PUBLISHER_ID,
      name: LEGAL_PUBLISHER_NAME,
    });
    expect(monkeysBrand()).toMatchObject({
      '@id': MONKEYS_BRAND_ID,
      parentOrganization: { '@id': LEGAL_PUBLISHER_ID },
    });
    expect(monkeysWebsite()).toMatchObject({
      '@id': MONKEYS_WEBSITE_ID,
      publisher: { '@id': LEGAL_PUBLISHER_ID },
      about: { '@id': MONKEYS_BRAND_ID },
    });
  });

  it('normalizes markup, whitespace, unsafe punctuation, and length', () => {
    expect(normalizeSeoText('<b>Hello</b>   world', 160)).toBe('Hello world');
    expect(normalizeSeoText('Posts \u2014 events', 160)).toBe('Posts, events');
    expect(normalizeSeoText('one two three four', 13)).toBe('one two three');
  });

  it('allows discovery links to be followed on noindex search pages', () => {
    expect(noIndexFollowRobots).toMatchObject({
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    });
  });
});
