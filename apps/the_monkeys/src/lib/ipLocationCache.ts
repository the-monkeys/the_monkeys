export const IP_LOCATION_STORAGE_KEY = 'user_ip_location';
export const LOCATION_CACHE_MAX_AGE_MS = 30 * 60 * 1000;

export type CachedIpLocation = {
  city: string;
  state: string;
  country: string;
  countryName: string;
  latitude: number;
  longitude: number;
  source: 'gps' | 'ip';
  updatedAt: number;
};

export function isValidLocationCoordinates(
  latitude: number,
  longitude: number
): boolean {
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    (latitude !== 0 || longitude !== 0)
  );
}

export function isFreshCachedLocation(
  location: CachedIpLocation,
  now = Date.now()
): boolean {
  return (
    Number.isFinite(location.updatedAt) &&
    location.updatedAt <= now &&
    now - location.updatedAt <= LOCATION_CACHE_MAX_AGE_MS
  );
}

export function readCachedIpLocation(): CachedIpLocation | null {
  if (typeof sessionStorage === 'undefined') return null;
  const raw = sessionStorage.getItem(IP_LOCATION_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CachedIpLocation>;
    if (
      typeof parsed.city !== 'string' ||
      typeof parsed.state !== 'string' ||
      typeof parsed.country !== 'string' ||
      typeof parsed.countryName !== 'string' ||
      typeof parsed.latitude !== 'number' ||
      typeof parsed.longitude !== 'number' ||
      !isValidLocationCoordinates(parsed.latitude, parsed.longitude) ||
      (parsed.source !== 'gps' && parsed.source !== 'ip') ||
      typeof parsed.updatedAt !== 'number'
    ) {
      return null;
    }
    const location = {
      city: parsed.city,
      state: parsed.state,
      country: parsed.country,
      countryName: parsed.countryName,
      latitude: parsed.latitude,
      longitude: parsed.longitude,
      source: parsed.source,
      updatedAt: parsed.updatedAt,
    } as CachedIpLocation;
    return isFreshCachedLocation(location) ? location : null;
  } catch {
    return null;
  }
}

export function writeCachedIpLocation(loc: CachedIpLocation) {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(IP_LOCATION_STORAGE_KEY, JSON.stringify(loc));
}
