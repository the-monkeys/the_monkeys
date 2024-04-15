import NextAuth, { DefaultSession } from 'next-auth';

export interface User {
  statusCode: number;
  token: string;
  userId: number;
  userName: string;
  first_name: string;
  last_name: string;
  email: string;
}

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User & DefaultSession['user'];
  }
}
