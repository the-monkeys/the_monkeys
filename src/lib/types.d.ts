import { NextComponentType, NextPageContext } from 'next';

export interface User {
  status_code: number;
  account_id: string;
  token: string;
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verification_status: string;
}

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user'];
  }
}
