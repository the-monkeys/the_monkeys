'use client';

import { useEffect, useState } from 'react';

import {
  CachedIpLocation,
  readCachedIpLocation,
  writeCachedIpLocation,
} from '@/lib/ipLocationCache';

export interface IPLocationData {
  city: string;
  country: string;
  countryName: string;
  latitude: number;
  longitude: number;
  isLoading: boolean;
  error: boolean;
}

const emptyLocation: CachedIpLocation = {
  city: '',
  country: '',
  countryName: '',
  latitude: 0,
  longitude: 0,
};

export const useIPLocation = (): IPLocationData => {
  const [data, setData] = useState<CachedIpLocation>(emptyLocation);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cached = readCachedIpLocation();
    if (cached) {
      setData(cached);
      setIsLoading(false);
      return;
    }

    const fetchLocation = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('Failed to fetch location');
        const json = await res.json();

        const locData: CachedIpLocation = {
          city: json.city || '',
          country: json.country || '',
          countryName: json.country_name || '',
          latitude: json.latitude || 0,
          longitude: json.longitude || 0,
        };

        setData(locData);
        writeCachedIpLocation(locData);
      } catch (err) {
        console.error('IP location detection failed:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return { ...data, isLoading, error };
};
