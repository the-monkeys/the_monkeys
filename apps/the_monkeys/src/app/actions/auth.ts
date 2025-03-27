'use server';

import { cookies } from 'next/headers';

import { UserJWT } from '@/services/models/user';
import { jwtVerify } from 'jose';

export const validate = async () => {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('mat');

  try {
    if (!authCookie?.value) return null;

    const authData = await jwtVerify<UserJWT>(
      authCookie.value,
      Buffer.from(process.env.AUTH_SECRET!)
    );

    return authData.payload;
  } catch (err) {
    console.log(err);
    return null;
  }
};
