'use client';

import { useEffect, useState } from 'react';

import fetcher from '@/services/fileFetcher';
import { useQuery } from '@tanstack/react-query';

export const PROFILE_IMAGE_QUERY_KEY = 'profile-image';

const useProfileImage = (username: string | undefined) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  const { data, error, isLoading, isError } = useQuery<Blob, Error>({
    queryKey: [PROFILE_IMAGE_QUERY_KEY, username],
    queryFn: () => fetcher(`/storage/profiles/${username}/profile`),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
    retry: false, // Don't retry on 404 (deleted profile pic)
  });

  useEffect(() => {
    // Profile was deleted or fetch failed — clear the displayed image.
    if (!data) {
      setImageUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(data);
    setImageUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl); // Cleanup on unmount
  }, [data]);

  return {
    imageUrl,
    isLoading,
    isError: isError || !!error,
  };
};

export default useProfileImage;
