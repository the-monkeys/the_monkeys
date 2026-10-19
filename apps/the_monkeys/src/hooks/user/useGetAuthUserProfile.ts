import { queryKeys } from '@/lib/queryKeys';
import axiosInstance from '@/services/api/axiosInstance';
import { GetAuthUserProfileApiResponse } from '@/services/profile/userApiTypes';
import { useQuery } from '@tanstack/react-query';

async function getAuthUserProfile(username: string) {
  const resp = await axiosInstance.get<GetAuthUserProfileApiResponse>(
    `/user/${username}`
  );

  return resp.data;
}

const useGetAuthUserProfile = (username?: string) => {
  return useQuery({
    queryFn: async () => {
      if (username) {
        return await getAuthUserProfile(username);
      }

      return null;
    },
    queryKey: queryKeys.user.authenticatedProfile(username),
    enabled: !!username,
  });
};

export default useGetAuthUserProfile;
