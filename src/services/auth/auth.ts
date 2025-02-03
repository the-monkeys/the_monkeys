import { API_URL } from '@/constants/api';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import axiosInstanceNoAuth from '../api/axiosInstanceNoAuth';
import { User } from '../models/user';
import { LoginResponse } from './authApiTypes';

const APIEndpoint = {
  LOGIN: '/auth/login',
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
  req: { user: string; evpw: string },
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

export async function login(credentials: { email: string; password: string }) {
  const authResponse = await axios.post<LoginResponse>(
    `${API_URL}/auth/login`,
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
  const authResponse = await axios.post(
    `${API_URL}/auth/register`,
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
