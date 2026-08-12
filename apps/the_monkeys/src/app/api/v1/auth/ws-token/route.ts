import { cookies } from 'next/headers';

import { SignJWT, jwtVerify } from 'jose';

export async function GET(_req: Request) {
  const mat = await cookies().get('mat');
  if (!mat?.value) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);

  try {
    const { payload } = await jwtVerify(mat.value, secret, {
      algorithms: ['HS256'],
    });

    const jwt = new SignJWT(payload).setProtectedHeader({ alg: 'HS256' });

    const token = await jwt.sign(secret);

    return Response.json({ status: 'success', token });
  } catch (err) {
    console.log(err);

    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
