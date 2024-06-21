import fetcher from '@/services/fileFetcher';
import useSWR from 'swr';

function useProfileImage(username: string | undefined) {
  const { data, error, isLoading } = useSWR<Blob>(
    `/files/profile/${username}/profile`,
    fetcher
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
}

export default useProfileImage;
