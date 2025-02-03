import { VerificationStatus } from '@/lib/types';
import { JWTPayload } from 'jose';

export interface IUser {
  account_id: string;
  email: string;
  email_verification_status?: VerificationStatus;
  first_name?: string;
  last_name?: string;
  username: string;
}

export class User implements IUser {
  account_id = '';
  email = '';
  email_verification_status?: VerificationStatus;
  first_name;
  last_name;
  username = '';

  constructor(values: any) {
    this.account_id = values.account_id;
    this.email = values.email;
    this.email_verification_status =
      values?.email_verification_status || values?.email_verified;
    this.first_name = values?.first_name;
    this.last_name = values?.last_name;
    this.username = values?.username || values?.user_name;
  }
}

export type UserJWT = Omit<IUser, 'first_name' | 'last_name'> &
  Required<Pick<JWTPayload, 'iss' | 'exp'>>;
