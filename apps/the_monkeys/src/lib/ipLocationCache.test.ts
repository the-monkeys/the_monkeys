import { afterEach, describe, expect, it } from 'vitest';

import {
  IP_LOCATION_STORAGE_KEY,
  readCachedIpLocation,
} from './ipLocationCache';

describe('readCachedIpLocation', () => {
  afterEach(() => {
    sessionStorage.removeItem(IP_LOCATION_STORAGE_KEY);
  });

  it('returns null when nothing is stored', () => {
    expect(readCachedIpLocation()).toBeNull();
  });

  it('returns a usable pin from sessionStorage', () => {
    sessionStorage.setItem(
      IP_LOCATION_STORAGE_KEY,
      JSON.stringify({
        city: 'Bengaluru',
        country: 'IN',
        countryName: 'India',
        latitude: 12.97623,
        longitude: 77.60329,
      })
    );
    expect(readCachedIpLocation()).toEqual({
      city: 'Bengaluru',
      country: 'IN',
      countryName: 'India',
      latitude: 12.97623,
      longitude: 77.60329,
    });
  });

  it('returns null for corrupt JSON', () => {
    sessionStorage.setItem(IP_LOCATION_STORAGE_KEY, '{not json');
    expect(readCachedIpLocation()).toBeNull();
  });
});
