export const IP_LOCATION_STORAGE_KEY = 'user_ip_location';

export type CachedIpLocation = {
  city: string;
  country: string;
  countryName: string;
  latitude: number;
  longitude: number;
};

export function readCachedIpLocation(): CachedIpLocation | null {
  if (typeof sessionStorage === 'undefined') return null;
  const raw = sessionStorage.getItem(IP_LOCATION_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<CachedIpLocation>;
    if (
      typeof parsed.city !== 'string' ||
      typeof parsed.country !== 'string' ||
      typeof parsed.countryName !== 'string' ||
      typeof parsed.latitude !== 'number' ||
      typeof parsed.longitude !== 'number'
    ) {
      return null;
    }
    return {
      city: parsed.city,
      country: parsed.country,
      countryName: parsed.countryName,
      latitude: parsed.latitude,
      longitude: parsed.longitude,
    };
  } catch {
    return null;
  }
}

export function writeCachedIpLocation(loc: CachedIpLocation) {
  sessionStorage.setItem(IP_LOCATION_STORAGE_KEY, JSON.stringify(loc));
}
