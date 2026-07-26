'use client';

import { useEffect, useState } from 'react';

import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import fetcher from '@/services/fileFetcher';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

export const PROFILE_IMAGE_QUERY_KEY = 'profile-image';
export const MAX_PROFILE_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const PROFILE_IMAGE_ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
};

export const validateProfileImage = (file: File) => {
  if (file.size > MAX_PROFILE_IMAGE_SIZE_BYTES) {
    return 'Image must be under 5 MB.';
  }
};

type UploadProfileImageOptions = {
  username?: string;
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
    mutationFn: async (file: File) => {
      if (!username) {
        throw new Error('Unable to upload a profile photo without a username.');
      }

      const formData = new FormData();
      formData.append('profile_pic', file);

      return axiosInstanceV2.post(
        `/storage/profiles/${username}/profile`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PROFILE_IMAGE_QUERY_KEY, username],
      });

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

  const { data, error, isLoading, isError } = useQuery<Blob, Error>({
    queryKey: [PROFILE_IMAGE_QUERY_KEY, username],
    queryFn: () => fetcher(`/storage/profiles/${username}/profile`),
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
