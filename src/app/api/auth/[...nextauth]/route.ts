import axios from 'axios';
import { AuthOptions, User } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

const api = process.env.NEXT_PUBLIC_API_URL;
const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          type: 'text',
          label: 'Email',
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

        const authResponse = await fetch(api + '/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });

        if (!authResponse.ok) {
          return null;
        }

        const user = await authResponse.json();

        return user;
      },
    }),
  ],
  callbacks: {
    // async jwt({ token, user }) {
    //   if (user) token = user as unknown as User;

    //   return token;
    // },
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
