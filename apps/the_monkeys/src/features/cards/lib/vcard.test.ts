import { describe, expect, it } from 'vitest';

import { CardContact } from '../types';
import { generateVCard, getVCardFilename } from './vcard';

describe('vcard generator & sanitization', () => {
  it('strips carriage return \\r and normalizes \\r\\n line breaks properly', () => {
    const contact: CardContact = {
      firstName: 'John\r',
      lastName: 'Doe',
      address: 'Line 1\r\nLine 2\rLine 3',
    };
    const vcard = generateVCard(contact);
    expect(vcard).not.toContain('\r\\n');
    expect(vcard).not.toContain('\r;');
    expect(vcard).toContain('ADR;TYPE=WORK:;;Line 1\\nLine 2\\nLine 3;;;;');
  });

  it('generates valid vcard download filenames with fallbacks for non-ASCII or missing names', () => {
    expect(getVCardFilename({ firstName: 'John', lastName: 'Doe' })).toBe(
      'john-doe.vcf'
    );
    expect(getVCardFilename({ firstName: '', lastName: '' })).toBe(
      'business-card.vcf'
    );
    expect(getVCardFilename({ firstName: '   ', lastName: '   ' })).toBe(
      'business-card.vcf'
    );
    expect(getVCardFilename({ firstName: 'René', lastName: 'Müller' })).toBe(
      'rene-muller.vcf'
    );
    expect(getVCardFilename({ firstName: '王伟', lastName: '' })).toBe(
      'business-card.vcf'
    );
  });
});
