import { axiosInstance } from '../fetcher';

export const getResetPasswordToken = async (
  username: string | null,
  evpw: string | null
): Promise<getResetPasswordTokenApiResponse | null> => {
  try {
    const response = await axiosInstance.get<getResetPasswordTokenApiResponse>(
      '/auth/reset-password',
      {
        params: {
          user: username,
          evpw: evpw,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching reset password token:', error);
    return null;
  }
};
