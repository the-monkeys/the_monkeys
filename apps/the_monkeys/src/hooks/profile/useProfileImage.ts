'use client';

import { useEffect, useState } from 'react';

import { queryKeys } from '@/lib/queryKeys';
import fetcher from '@/services/fileFetcher';
import { uploadProfileImage } from '@/services/user/user';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { isAxiosError } from 'axios';
import { z } from 'zod';

export const PROFILE_IMAGE_QUERY_KEY = 'profile-image';
export const MAX_PROFILE_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const PROFILE_IMAGE_ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

export const profileImageSchema = z
  .custom<File>(
    (val) => typeof File !== 'undefined' && val instanceof File,
    'Must be a file'
  )
  .refine(
    (file) => file.size <= MAX_PROFILE_IMAGE_SIZE_BYTES,
    'Image must be under 5 MB.'
  )
  .refine(
    (file) => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type),
    'Only JPEG and PNG images are allowed.'
  );

type UploadProfileImageOptions = {
  username: string;
  onSuccess: () => void;
  onError: (message: string) => void;
};

export const useUploadProfileImage = ({
  username,
  onSuccess,
  onError,
}: UploadProfileImageOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadProfileImage(username, file),
    onSuccess: async (_data, file) => {
      // Stop an older in-flight read before publishing the uploaded file to
      // every mounted avatar. Keep this successful result fresh; an immediate
      // refetch can replace it with an older HTTP response.
      const queryKey = queryKeys.profile.image(username);
      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData(queryKey, file);
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Your profile photo has been updated successfully.',
      });
      onSuccess();
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : 'An unknown error occurred.';
      toast({
        variant: 'error',
        title: 'Error',
        description: message,
      });
      onError(message);
    },
  });
};

const useProfileImage = (username: string | undefined) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  const { data, error, isLoading, isError } = useQuery<Blob | null, Error>({
    queryKey: queryKeys.profile.image(username),
    queryFn: async ({ signal }) => {
      try {
        return await fetcher(`/storage/profiles/${username}/profile`, {
          signal,
        });
      } catch (error) {
        // Only absence is an empty success. Authentication and transport
        // failures must remain errors rather than poisoning the empty cache.
        if (isAxiosError(error) && error.response?.status === 404) return null;
        throw error;
      }
    },
    enabled: !!username,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (!data) {
      setImageUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(data);
    setImageUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [data]);

  return {
    imageUrl,
    isLoading,
    isError: isError || !!error,
  };
};

export default useProfileImage;
