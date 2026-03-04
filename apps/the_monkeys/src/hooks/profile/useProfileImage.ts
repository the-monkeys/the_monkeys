'use client';

import { useEffect, useState } from 'react';

import { storageV2 } from '@/services/storage/storageV2';
import { useQuery } from '@tanstack/react-query';

export const PROFILE_IMAGE_QUERY_KEY = 'profile-image';

const useProfileImage = (username: string | undefined) => {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: [PROFILE_IMAGE_QUERY_KEY, username],
    queryFn: async () => {
      if (!username) return null;
      try {
        const res = await storageV2.getProfileImageMeta(username);
        return {
          url: res.etag ? `${res.url}?v=${res.etag}` : res.url,
          blurhash: res.blurhash,
        };
      } catch (error: any) {
        if (error?.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!username,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  return {
    imageUrl: data?.url || '',
    blurHash: data?.blurhash || '',
    isLoading,
    isError: isError || !!error,
  };
};

export default useProfileImage;
