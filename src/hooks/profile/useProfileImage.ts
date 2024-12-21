import fetcher from '@/services/fileFetcher';
import useSWR from 'swr';

const useProfileImage = (username: string) => {
  const { data, error, isLoading } = useSWR<Blob>(
    `/files/profile/${username}/profile`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      refreshInterval: 0,
    }
  );

  let imageUrl = '';
  if (data) {
    const url = URL.createObjectURL(data);
    imageUrl = url;
  }

  return {
    imageUrl,
    isLoading,
    isError: error,
  };
};

export default useProfileImage;
