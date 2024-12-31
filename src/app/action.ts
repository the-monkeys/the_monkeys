'use server';

import { cookies } from 'next/headers';

import { User } from '@/lib/types';
import { SignJWT, jwtVerify } from 'jose';

export const getAuthData = async () => {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('monkeys-auth-cookie');

  try {
    if (!authCookie?.value) return null;

    const authData = await jwtVerify<User>(
      authCookie.value,
      Buffer.from(process.env.AUTH_SECRET!)
    );

    return authData.payload;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const logOut = async () => {
  cookies().delete('monkeys-auth-cookie');
  return;
};

export const updateAuthCookie = async (payload: Partial<User>) => {
  const cookieStore = await cookies();

  const jwt = new SignJWT({ ...payload });
  const value = await jwt.sign(Buffer.from(process.env.AUTH_SECRET!));

  cookieStore.set('monkeys-auth-cookie', value);
};
