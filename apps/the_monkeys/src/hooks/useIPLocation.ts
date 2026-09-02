'use client';

import { useEffect, useState } from 'react';

export interface IPLocationData {
  city: string;
  country: string;
  countryName: string;
  latitude: number;
  longitude: number;
  isLoading: boolean;
  error: boolean;
}

export const useIPLocation = (): IPLocationData => {
  const [data, setData] = useState<Omit<IPLocationData, 'isLoading' | 'error'>>({
    city: '',
    country: '',
    countryName: '',
    latitude: 0,
    longitude: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // We use sessionStorage to avoid hitting the API on every page navigation
    const cached = sessionStorage.getItem('user_ip_location');
    if (cached) {
      try {
        setData(JSON.parse(cached));
        setIsLoading(false);
        return;
      } catch (e) {
        // Fallthrough to fetch
      }
    }

    const fetchLocation = async () => {
      try {
        // Fetch from ipapi.co (free tier, no key required for frontend)
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('Failed to fetch location');
        const json = await res.json();
        
        const locData = {
          city: json.city || '',
          country: json.country || '',
          countryName: json.country_name || '',
          latitude: json.latitude || 0,
          longitude: json.longitude || 0,
        };
        
        setData(locData);
        sessionStorage.setItem('user_ip_location', JSON.stringify(locData));
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
