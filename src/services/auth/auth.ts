import { AxiosRequestConfig } from 'axios';

import axiosInstanceNoAuth from '../api/axiosInstanceNoAuth';

const getResetPasswordTokenAPIEndpoint = '/auth/reset-password';

export async function getResetPasswordToken(
  req: getResetPasswordTokenRequest,
  config?: AxiosRequestConfig
): Promise<getResetPasswordTokenApiResponse> {
  const response = await axiosInstanceNoAuth<getResetPasswordTokenApiResponse>(
    getResetPasswordTokenAPIEndpoint,
    {
      params: {
        ...req,
      },
      ...config,
    }
  );
  return response.data;
}
