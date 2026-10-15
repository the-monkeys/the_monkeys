import { afterEach, describe, expect, it } from 'vitest';

import {
  IP_LOCATION_STORAGE_KEY,
  LOCATION_CACHE_MAX_AGE_MS,
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
        state: 'Karnataka',
        country: 'IN',
        countryName: 'India',
        latitude: 12.97623,
        longitude: 77.60329,
        source: 'gps',
        updatedAt: Date.now(),
      })
    );
    expect(readCachedIpLocation()).toEqual({
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'IN',
      countryName: 'India',
      latitude: 12.97623,
      longitude: 77.60329,
      source: 'gps',
      updatedAt: expect.any(Number),
    });
  });

  it('rejects invalid coordinates and stale entries', () => {
    sessionStorage.setItem(
      IP_LOCATION_STORAGE_KEY,
      JSON.stringify({
        city: 'Wrong place',
        state: '',
        country: 'IN',
        countryName: 'India',
        latitude: 120,
        longitude: 12,
        source: 'ip',
        updatedAt: Date.now(),
      })
    );
    expect(readCachedIpLocation()).toBeNull();

    sessionStorage.setItem(
      IP_LOCATION_STORAGE_KEY,
      JSON.stringify({
        city: 'Old place',
        state: '',
        country: 'IN',
        countryName: 'India',
        latitude: 12,
        longitude: 77,
        source: 'ip',
        updatedAt: Date.now() - LOCATION_CACHE_MAX_AGE_MS - 1,
      })
    );
    expect(readCachedIpLocation()).toBeNull();
  });

  it('returns null for corrupt JSON', () => {
    sessionStorage.setItem(IP_LOCATION_STORAGE_KEY, '{not json');
    expect(readCachedIpLocation()).toBeNull();
  });
});
