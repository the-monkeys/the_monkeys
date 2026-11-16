'use client';

import { useEffect, useState } from 'react';

/** Match server HTML first, then use the browser's preferred date/currency style. */
export function useViewerLocale(): string {
  const [locale, setLocale] = useState('en-US');
  useEffect(() => {
    setLocale(navigator.language || 'en-US');
  }, []);
  return locale;
}
