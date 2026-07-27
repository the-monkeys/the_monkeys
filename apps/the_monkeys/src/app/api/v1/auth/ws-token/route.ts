import { cookies } from 'next/headers';

import { UserJWT } from '@/services/models/user';
import { SignJWT, jwtVerify } from 'jose';

export async function GET(req: Request) {
  const mat = await cookies().get('mat');
  if (!mat?.value) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify<UserJWT>(
      mat.value,
      Buffer.from(process.env.AUTH_SECRET!)
    );

    const jwt = new SignJWT(payload);
    jwt.setProtectedHeader({ alg: 'HS256' });
    const token = await jwt.sign(Buffer.from(process.env.NEXTAUTH_SECRET!));

    return Response.json({ status: 'success', token });
  } catch (err) {
    console.log(err);
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
