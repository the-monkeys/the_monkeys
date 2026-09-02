// Meetup-style discovery radii. In-person stays city → country; never worldwide.

const CITY_RADIUS_KM = [50, 150, 400] as const;

export function countryMaxRadiusKm(countryCode: string): number {
  switch (countryCode.toUpperCase()) {
    case 'US':
    case 'CA':
    case 'AU':
    case 'BR':
    case 'CN':
    case 'RU':
      return 2500;
    case 'IN':
      return 2000;
    default:
      return 1500;
  }
}

/** City radii then a country-sized cap. The last index is the country maximum. */
export function geoRadiusSteps(countryCode: string): number[] {
  const cap = countryMaxRadiusKm(countryCode);
  return [...CITY_RADIUS_KM.filter((km) => km < cap), cap];
}
