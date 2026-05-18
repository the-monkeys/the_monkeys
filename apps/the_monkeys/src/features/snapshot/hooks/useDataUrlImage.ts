'use client';

import { useEffect, useState } from 'react';

/**
 * Fetches a possibly-cross-origin image URL through Next's image proxy and
 * converts it to a data URL so it can be embedded in `html-to-image` exports
 * without tainting the canvas.
 *
 * Returns the original URL unchanged for empty/undefined or already-data URLs.
 */
export const useDataUrlImage = (
  url: string | undefined
): string | undefined => {
  const [dataUrl, setDataUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!url) {
      setDataUrl(undefined);
      return;
    }
    if (url.startsWith('data:')) {
      setDataUrl(url);
      return;
    }

    let cancelled = false;
    const isAbsolute = /^https?:\/\//i.test(url);
    const fetchUrl = isAbsolute
      ? `/api/proxy-image?url=${encodeURIComponent(url)}`
      : url;

    fetch(fetchUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`proxy ${r.status}`);
        return r.blob();
      })
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(String(reader.result));
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(blob);
          })
      )
      .then((next) => {
        if (cancelled) return;
        setDataUrl(next);
      })
      .catch(() => {
        if (cancelled) return;
        setDataUrl(undefined);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return dataUrl;
};
