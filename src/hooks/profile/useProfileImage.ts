import { useEffect, useState } from 'react';

import fetcher from '@/services/fileFetcher';
import useSWR from 'swr';

const useProfileImage = (username: string | undefined) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  const { data, error, isLoading } = useSWR<Blob>(
    username ? `/files/profile/${username}/profile` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      refreshInterval: 0,
    }
  );

  useEffect(() => {
    if (!data) return;

    const objectUrl = URL.createObjectURL(data);
    setImageUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl); // Cleanup on unmount
  }, [data]);

  return {
    imageUrl,
    isLoading,
    isError: error,
  };
};

export default useProfileImage;
