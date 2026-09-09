import { describe, expect, it } from 'vitest';

import { formatPersonName } from './personName';

describe('formatPersonName', () => {
  it('joins first and last when both are present', () => {
    expect(formatPersonName('Shivam', 'Joshi')).toBe('Shivam Joshi');
  });

  it('omits a missing last name instead of printing undefined', () => {
    expect(formatPersonName('Shivam', undefined)).toBe('Shivam');
    expect(formatPersonName('Shivam', null)).toBe('Shivam');
    expect(formatPersonName('Shivam', '')).toBe('Shivam');
  });

  it('omits a missing first name', () => {
    expect(formatPersonName(undefined, 'Joshi')).toBe('Joshi');
  });

  it('does not stringify the words undefined or null as a name part', () => {
    expect(formatPersonName('Shivam', 'undefined')).toBe('Shivam');
    expect(formatPersonName('null', 'Joshi')).toBe('Joshi');
  });

  it('falls back when neither name part is usable', () => {
    expect(formatPersonName(undefined, undefined, '@shi')).toBe('@shi');
    expect(formatPersonName('', '', 'guest')).toBe('guest');
  });

  it('trims whitespace around name parts', () => {
    expect(formatPersonName('  Shivam  ', '  Joshi ')).toBe('Shivam Joshi');
  });
});
