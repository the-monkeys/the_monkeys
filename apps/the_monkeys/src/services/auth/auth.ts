import { AxiosRequestConfig } from 'axios';

import axiosInstance from '../api/axiosInstance';
import axiosInstanceNoAuth from '../api/axiosInstanceNoAuth';
import { User } from '../models/user';
import { IUser } from '../models/user';

const APIEndpoint = {
  LOGIN: '/auth/login',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',
  REGISTER: '/auth/register',
  FORGOT_PASS: '/auth/forgot-pass',
  VALIDATE_SESSION: '/auth/validate-session',
  GOOGLE_CALLBACK: '/auth/google/callback',
} as const;

interface getResetPasswordTokenApiResponse {
  response: UserInfo;
}

interface UserInfo {
  status_code: number;
  token: string;
  user_id: number;
  username: string;
  first_name: string;
  last_name?: string;
  email: string;
}

export async function getResetPasswordToken(
  req: { user: string; evpw: string },
  config?: AxiosRequestConfig
) {
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
  req: { user: string; evpw: string },
  config?: AxiosRequestConfig
) {
  const response = await axiosInstance<{
    message: string;
    status: number;
  }>(APIEndpoint.VERIFY_EMAIL, {
    params: {
      ...req,
    },
    ...config,
  });

  return response;
}

export async function login(credentials: { email: string; password: string }) {
  const authResponse = await axiosInstance.post<Required<IUser>>(
    APIEndpoint.LOGIN,
    {
      email: credentials.email,
      password: credentials.password,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    }
  );

  return new User(authResponse.data);
}

export async function register(user: {
  first_name: string;
  last_name: string | undefined;
  email: string;
  password: string;
}) {
  const authResponse = await axiosInstance.post(
    APIEndpoint.REGISTER,
    {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: user.password,
      redirect: false,
    },
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  return new User(authResponse.data);
}

export async function forgotPass({ email }: { email: string }) {
  const response = await axiosInstance.post<{
    message: string;
    status: number;
  }>(APIEndpoint.FORGOT_PASS, {
    email,
  });

  return response;
}

export async function validateSession() {
  const response = await axiosInstance.get<IUser>(APIEndpoint.VALIDATE_SESSION);

  return response.data;
}

export async function googleSSOCallback(code: string) {
  const response = await axiosInstance.get<IUser>(APIEndpoint.GOOGLE_CALLBACK, {
    params: { code },
  });

  return response.data;
}
