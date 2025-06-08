import { cookies } from 'next/headers';

import { SignJWT, decodeJwt } from 'jose';

export async function GET(req: Request) {
  const mat = await cookies().get('mat');
  if (!mat?.value) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const value = decodeJwt(mat.value);
  const jwt = new SignJWT(value);

  jwt.setProtectedHeader({ alg: 'HS256' });
  const token = await jwt.sign(Buffer.from(process.env.NEXTAUTH_SECRET!));

  return Response.json({ status: 'success', token });
}
