import { IUser } from '../models/user';

export type Response = { status: number };

export type LoginResponse = Required<IUser> & Response;

export type ValidateResponse = Response & IUser;

interface verifyEmailVerificationTokenRequest {
  user: string;
  evpw: string;
}

interface getResetPasswordTokenApiResponse {
  response: UserInfo;
}

interface verifyEmailVerificationTokenApiResponse {
  response: {
    status_code: number;
    token: string;
  };
}

interface UserInfo {
  status_code: number;
  token: string;
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}
