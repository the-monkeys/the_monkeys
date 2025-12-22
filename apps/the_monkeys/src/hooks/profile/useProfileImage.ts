'use client';

import { useEffect, useState } from 'react';

import fetcher from '@/services/fileFetcher';
import { useQuery } from '@tanstack/react-query';

export const PROFILE_IMAGE_QUERY_KEY = 'profile-image';

const useProfileImage = (username: string | undefined) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  const { data, error, isLoading, isError } = useQuery<Blob, Error>({
    queryKey: [PROFILE_IMAGE_QUERY_KEY, username],
    queryFn: () => fetcher(`/files/profile/${username}/profile`),
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!data) return;

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
