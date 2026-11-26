'use client';

import { useEffect, useState } from 'react';

import { defaultTimezone } from '@/lib/eventTime';

/** Use the same initial zone during SSR/hydration, then the browser's zone. */
export function useViewerTimezone(): string {
  const [timezone, setTimezone] = useState('UTC');
  useEffect(() => {
    setTimezone(defaultTimezone());
  }, []);
  return timezone;
}
