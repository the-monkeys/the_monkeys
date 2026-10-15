'use client';

import { useEffect, useState } from 'react';

import {
  CachedIpLocation,
  isValidLocationCoordinates,
  readCachedIpLocation,
  writeCachedIpLocation,
} from '@/lib/ipLocationCache';

export interface IPLocationData {
  city: string;
  state: string;
  country: string;
  countryName: string;
  latitude: number;
  longitude: number;
  isLoading: boolean;
  error: boolean;
}

const emptyLocation: CachedIpLocation = {
  city: '',
  state: '',
  country: '',
  countryName: '',
  latitude: 0,
  longitude: 0,
  source: 'ip',
  updatedAt: 0,
};

type ReverseGeocodeResponse = {
  city?: string;
  state?: string;
  country?: string;
  countryName?: string;
};

async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResponse | null> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
  });
  const response = await fetch(`/api/reverse-geocode?${params.toString()}`);
  if (!response.ok) return null;
  return (await response.json()) as ReverseGeocodeResponse;
}

export const useIPLocation = (): IPLocationData => {
  const [data, setData] = useState<CachedIpLocation>(emptyLocation);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const cached = readCachedIpLocation();

    const applyLocation = (location: CachedIpLocation) => {
      if (cancelled) return;
      setData(location);
      setError(false);
      setIsLoading(false);
      writeCachedIpLocation(location);
    };

    const fetchIpLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('Failed to fetch location');
        const json = await res.json();
        const latitude = Number(json.latitude);
        const longitude = Number(json.longitude);
        if (!isValidLocationCoordinates(latitude, longitude)) {
          throw new Error('IP provider returned invalid coordinates');
        }

        applyLocation({
          city: json.city || '',
          state: json.region || '',
          country: json.country || '',
          countryName: json.country_name || '',
          latitude,
          longitude,
          source: 'ip',
          updatedAt: Date.now(),
        });
      } catch (err) {
        console.error('IP location detection failed:', err);
        if (!cancelled) {
          setError(true);
          setIsLoading(false);
        }
      }
    };

    const fallbackToCachedOrIp = () => {
      if (cached) {
        applyLocation(cached);
      } else {
        void fetchIpLocation();
      }
    };

    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      fallbackToCachedOrIp();
      return () => {
        cancelled = true;
      };
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (!isValidLocationCoordinates(latitude, longitude)) {
          fallbackToCachedOrIp();
          return;
        }
        void reverseGeocode(latitude, longitude)
          .then((place) => {
            if (!place?.city || !place.country) {
              fallbackToCachedOrIp();
              return;
            }
            applyLocation({
              city: place.city,
              state: place.state || '',
              country: place.country,
              countryName: place.countryName || '',
              latitude,
              longitude,
              source: 'gps',
              updatedAt: Date.now(),
            });
          })
          .catch(() => fallbackToCachedOrIp());
      },
      () => fallbackToCachedOrIp(),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return { ...data, isLoading, error };
};
