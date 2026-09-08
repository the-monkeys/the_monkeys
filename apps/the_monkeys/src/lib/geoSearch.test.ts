import {
  DEFAULT_SEARCH_RADIUS_KM,
  MAX_SEARCH_RADIUS_KM,
  MIN_SEARCH_RADIUS_KM,
  clampSearchRadius,
  defaultRadiusStepIndex,
  geoRadiusSteps,
  geocodeAddress,
  nearMeQuery,
} from '@/lib/geoSearch';
import { describe, expect, it } from 'vitest';

describe('clampSearchRadius', () => {
  it('treats omitted, zero, and negative as no geo filter', () => {
    expect(clampSearchRadius(0)).toEqual({ km: 0, apply: false });
    expect(clampSearchRadius(-5)).toEqual({ km: 0, apply: false });
  });

  it('clamps below min up to 2 km', () => {
    expect(clampSearchRadius(1)).toEqual({
      km: MIN_SEARCH_RADIUS_KM,
      apply: true,
    });
  });

  it('keeps values inside 2–100', () => {
    expect(clampSearchRadius(2)).toEqual({ km: 2, apply: true });
    expect(clampSearchRadius(DEFAULT_SEARCH_RADIUS_KM)).toEqual({
      km: 25,
      apply: true,
    });
    expect(clampSearchRadius(100)).toEqual({ km: 100, apply: true });
  });

  it('caps above 100 km', () => {
    expect(clampSearchRadius(250)).toEqual({
      km: MAX_SEARCH_RADIUS_KM,
      apply: true,
    });
  });
});

describe('geoRadiusSteps', () => {
  it('stays inside 2–100 and includes the 25 km default', () => {
    const steps = geoRadiusSteps('IN');
    expect(steps).toEqual([10, 25, 50, 100]);
    expect(steps[defaultRadiusStepIndex()]).toBe(DEFAULT_SEARCH_RADIUS_KM);
    expect(Math.max(...steps)).toBeLessThanOrEqual(MAX_SEARCH_RADIUS_KM);
  });
});

describe('nearMeQuery', () => {
  it('omits pin and radius for nationwide or missing coords', () => {
    expect(
      nearMeQuery({ lat: 12.97, lng: 77.59, radiusKm: 25, nationwide: true })
    ).toEqual({});
    expect(nearMeQuery({ lat: 0, lng: 0, radiusKm: 25 })).toEqual({});
    expect(nearMeQuery({ lat: 12.97, lng: 77.59, radiusKm: 0 })).toEqual({});
  });

  it('sends a clamped radius with a real pin', () => {
    expect(nearMeQuery({ lat: 12.97, lng: 77.59, radiusKm: 250 })).toEqual({
      user_lat: 12.97,
      user_lng: 77.59,
      radius: 100,
    });
  });
});

describe('geocodeAddress', () => {
  it('returns null for a blank query', async () => {
    expect(await geocodeAddress('  ')).toBeNull();
  });
});
