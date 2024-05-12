import { NextComponentType, NextPageContext } from 'next';
import { Router } from 'next/router';

import NextAuth, { DefaultSession, Session } from 'next-auth';

export interface User {
  status_code: number;
  account_id: string;
  token: string;
  user_id: number;
  user_name: string;
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
  declare module 'next/app' {
    type AppProps<P = Record<string, unknown>> = {
      Component: NextComponentType<NextPageContext, any, P>;
      router: Router;
      __N_SSG?: boolean;
      __N_SSP?: boolean;
      pageProps: P & {
        /** Initial session passed in from `getServerSideProps` or `getInitialProps` */
        session?: Session;
      };
    };
  }
}
