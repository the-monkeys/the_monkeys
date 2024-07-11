import { AxiosRequestConfig } from 'axios';

import axiosInstanceNoAuth from '../api/axiosInstanceNoAuth';

const APIEndpoint = {
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
} as const;

// const getResetPasswordTokenAPIEndpoint = '/auth/reset-password';

export async function getResetPasswordToken(
  req: getResetPasswordTokenRequest,
  config?: AxiosRequestConfig
): Promise<getResetPasswordTokenApiResponse> {
  const response = await axiosInstanceNoAuth<getResetPasswordTokenApiResponse>(
    APIEndpoint.RESET_PASSWORD,
    {
      params: {
        ...req,
      },
      ...config,
    }
  );

  return response.data;
}

export async function verifyEmailVerificationToken(
  req: getResetPasswordTokenRequest,
  config?: AxiosRequestConfig
): Promise<verifyEmailVerificationTokenApiResponse> {
  const response =
    await axiosInstanceNoAuth<verifyEmailVerificationTokenApiResponse>(
      APIEndpoint.VERIFY_EMAIL,
      {
        params: {
          ...req,
        },
        ...config,
      }
    );

  return response.data;
}
