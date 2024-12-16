import { API_URL } from '@/constants/api';
import { User } from '@/lib/types';
import axios from 'axios';
import { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

const authOptions: AuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        first_name: { label: 'first_name', type: 'text' },
        last_name: { label: 'last_name', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credentials) {
        try {
          const authResponse = await axios.post(
            `${API_URL}/auth/${credentials?.first_name ? 'register' : 'login'}`,
            {
              first_name: credentials?.first_name,
              last_name: credentials?.last_name,
              email: credentials?.email,
              password: credentials?.password,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          if (authResponse.data && authResponse.data.token) {
            return authResponse.data;
          }
          return null;
        } catch (error) {
          console.error('Error during authentication', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) token.user = user as unknown as User;
      if (trigger === 'update') {
        token.user = session.user;
      }
      return token;
    },
    async session({ token, session, trigger }) {
      session.user = token.user;
      if (trigger === 'update') {
        return { ...session };
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
