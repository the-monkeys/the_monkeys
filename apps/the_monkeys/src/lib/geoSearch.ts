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

const WEAK_ADDRESS_WORDS = new Set([
  'tech',
  'park',
  'parks',
  'campus',
  'mall',
  'plaza',
  'complex',
  'tower',
  'towers',
  'limited',
  'ltd',
  'pvt',
  'private',
  'office',
  'offices',
  'building',
  'phase',
  'sector',
  'block',
  'unit',
]);

const WEAK_GEOCODE_TOKENS = new Set([
  'india',
  'usa',
  'uk',
  'us',
  'in',
  'united states',
  'united kingdom',
]);

function hasCountryHint(s: string): boolean {
  const lower = s.toLowerCase();
  return (
    lower.includes('india') ||
    lower.includes('united states') ||
    lower.includes('united kingdom')
  );
}

function significantHead(segment: string): string {
  const fields = segment.trim().split(/\s+/).filter(Boolean);
  const keep = fields.filter(
    (w) => !WEAK_ADDRESS_WORDS.has(w.replace(/[.,#]/g, '').toLowerCase())
  );
  const words = keep.length ? keep : fields;
  return words.slice(0, 2).join(' ');
}

/** Nominatim misses venue+locality strings; try building+area, then area. */
export function geocodeQueryFallbacks(query: string, near = ''): string[] {
  const loc = query.trim();
  if (!loc) return [];
  const hint = near.trim();
  const out: string[] = [];
  const add = (s: string) => {
    const t = s.trim();
    if (!t) return;
    if (out.some((x) => x.toLowerCase() === t.toLowerCase())) return;
    out.push(t);
  };
  const comma = loc.lastIndexOf(',');
  const last = comma >= 0 ? loc.slice(comma + 1).trim() : '';
  const first = comma >= 0 ? loc.slice(0, comma).trim() : loc;
  const head = significantHead(first);
  const weakLast =
    last.length < 3 || WEAK_GEOCODE_TOKENS.has(last.toLowerCase());
  if (last && last.toLowerCase() !== loc.toLowerCase() && !weakLast) {
    if (head && head.toLowerCase() !== last.toLowerCase()) {
      add(`${head} ${last}`);
      if (hint) add(`${head} ${last}, ${hint}`);
      if (!hasCountryHint(last)) add(`${head} ${last}, India`);
    }
    add(last);
    if (hint) add(`${last}, ${hint}`);
    if (!hasCountryHint(last)) add(`${last}, India`);
  }
  add(loc);
  add(loc.replace(/,/g, ' ').replace(/\s+/g, ' ').trim());
  if (hint) add(`${loc}, ${hint}`);
  if (!hasCountryHint(loc)) add(`${loc}, India`);
  return out;
}

export async function geocodeAddress(
  query: string,
  near?: string
): Promise<GeoPin | null> {
  const q = query.trim();
  if (!q) return null;
  const params = new URLSearchParams({ q });
  if (near?.trim()) params.set('near', near.trim());
  const res = await fetch(`/api/geocode?${params.toString()}`);
  if (!res.ok) return null;
  const body = (await res.json()) as { latitude?: number; longitude?: number };
  return pinFromCoords(body.latitude, body.longitude);
}
