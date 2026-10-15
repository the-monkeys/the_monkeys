import { NextResponse } from 'next/server';

const NOMINATIM =
  'https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const latitude = Number(url.searchParams.get('lat'));
  const longitude = Number(url.searchParams.get('lon'));
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180 ||
    (latitude === 0 && longitude === 0)
  ) {
    return NextResponse.json({ error: 'invalid coordinates' }, { status: 400 });
  }

  const response = await fetch(
    `${NOMINATIM}&lat=${latitude}&lon=${longitude}`,
    {
      headers: {
        'User-Agent': 'TheMonkeysApp/1.0 (contact@monkeys.com.co)',
        Accept: 'application/json',
      },
      cache: 'no-store',
    }
  );
  if (!response.ok) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const body = (await response.json()) as {
    address?: {
      city?: string;
      town?: string;
      village?: string;
      municipality?: string;
      state?: string;
      country_code?: string;
      country?: string;
    };
  };
  const address = body.address;
  const city =
    address?.city ||
    address?.town ||
    address?.village ||
    address?.municipality ||
    '';
  if (!city || !address?.country_code || !address.country) {
    return NextResponse.json({ error: 'incomplete result' }, { status: 404 });
  }

  return NextResponse.json({
    city,
    state: address.state || '',
    country: address.country_code.toUpperCase(),
    countryName: address.country,
  });
}
