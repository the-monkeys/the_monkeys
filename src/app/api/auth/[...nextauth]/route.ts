import { User } from '@/lib/types';
import axios from 'axios';
import { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

const api = process.env.NEXT_PUBLIC_API_URL;
const authOptions: AuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'text',
        },
        first_name: {
          label: 'first_name',
          type: 'text',
        },
        last_name: {
          label: 'last_name',
          type: 'text',
        },
        password: {
          label: 'password',
          type: 'text',
        },
      },
      async authorize(credentials) {
        console.log(api);
        console.log(credentials, 'credentials');

        try {
          const authResponse = await axios.post(
            api + '/auth/login',
            { email: credentials?.email, password: credentials?.password },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          console.log(authResponse.data); // authResponse.data contains the response data
          console.log('hello');

          return authResponse.data; // Return the response data directly
        } catch (error) {
          console.error('Error occurred:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.user = user as unknown as User;

      return token;
    },
    async session({ token, session, trigger }) {
      session.user = token.user;
      if (trigger === 'update') {
        console.log(session);

        return {
          ...session,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
