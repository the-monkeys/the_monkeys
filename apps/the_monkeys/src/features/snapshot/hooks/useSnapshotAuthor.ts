'use client';

import { useEffect, useState } from 'react';

import useProfileImage from '@/hooks/profile/useProfileImage';

import { SnapshotAuthor } from '../types';

/**
 * Resolves the avatar URL into a data URL so it survives `html-to-image`'s
 * canvas tainting check. Profiles are served via authenticated fetch as Blob.
 */
export const useSnapshotAuthor = (
  username: string | undefined,
  displayName: string
): { author: SnapshotAuthor | undefined; isReady: boolean } => {
  const { imageUrl } = useProfileImage(username);
  const [dataUrl, setDataUrl] = useState<string | undefined>(undefined);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsReady(false);

    if (!imageUrl) {
      setDataUrl(undefined);
      setIsReady(true);
      return;
    }

    fetch(imageUrl)
      .then((r) => r.blob())
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(String(reader.result));
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(blob);
          })
      )
      .then((url) => {
        if (cancelled) return;
        setDataUrl(url);
        setIsReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setDataUrl(undefined);
        setIsReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  if (!username) return { author: undefined, isReady: true };

  return {
    author: {
      username,
      displayName,
      avatarUrl: dataUrl,
    },
    isReady,
  };
};
