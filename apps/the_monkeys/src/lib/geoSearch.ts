// Discovery radii for near-me lists. Engine clamps (2, 100) km when radius > 0.
// 0 / omitted / negative = nationwide (no geo filter). Default UI radius is 25.

export const MIN_SEARCH_RADIUS_KM = 2;
export const DEFAULT_SEARCH_RADIUS_KM = 25;
export const MAX_SEARCH_RADIUS_KM = 100;

export const SEARCH_RADIUS_STEPS_KM = [10, 25, 50, 100] as const;

export type GeoPin = { latitude: number; longitude: number };

export type NearMeQuery = {
  user_lat?: number;
  user_lng?: number;
  radius?: number;
};

export function clampSearchRadius(radiusKm: number): {
  km: number;
  apply: boolean;
} {
  if (!Number.isFinite(radiusKm) || radiusKm <= 0) {
    return { km: 0, apply: false };
  }
  const km = Math.min(
    MAX_SEARCH_RADIUS_KM,
    Math.max(MIN_SEARCH_RADIUS_KM, Math.round(radiusKm))
  );
  return { km, apply: true };
}

/** Country code is ignored; kept so existing callers do not break. */
export function geoRadiusSteps(_countryCode?: string): number[] {
  return [...SEARCH_RADIUS_STEPS_KM];
}

export function defaultRadiusStepIndex(): number {
  return SEARCH_RADIUS_STEPS_KM.indexOf(DEFAULT_SEARCH_RADIUS_KM);
}

export function isUsablePin(lat?: number, lng?: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat !== 0 &&
    lng !== 0
  );
}

export function pinFromCoords(lat?: number, lng?: number): GeoPin | null {
  return isUsablePin(lat, lng) ? { latitude: lat!, longitude: lng! } : null;
}

export function nearMeQuery(opts: {
  lat?: number;
  lng?: number;
  radiusKm: number;
  nationwide?: boolean;
}): NearMeQuery {
  if (opts.nationwide) return {};
  const { km, apply } = clampSearchRadius(opts.radiusKm);
  if (!apply || !isUsablePin(opts.lat, opts.lng)) return {};
  return { user_lat: opts.lat, user_lng: opts.lng, radius: km };
}

export async function geocodeAddress(query: string): Promise<GeoPin | null> {
  const q = query.trim();
  if (!q) return null;
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
  if (!res.ok) return null;
  const body = (await res.json()) as { latitude?: number; longitude?: number };
  return pinFromCoords(body.latitude, body.longitude);
}
