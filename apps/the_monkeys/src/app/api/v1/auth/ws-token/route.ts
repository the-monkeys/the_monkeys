import { cookies } from 'next/headers';

import { SignJWT, jwtVerify } from 'jose';

export async function GET(req: Request) {
  const mat = await cookies().get('mat');
  if (!mat?.value) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload;
  try {
    const result = await jwtVerify(
      mat.value,
      Buffer.from(process.env.AUTH_SECRET!)
    );
    payload = result.payload;
  } catch {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const jwt = new SignJWT(payload);
  jwt.setProtectedHeader({ alg: 'HS256' });
  const token = await jwt.sign(Buffer.from(process.env.NEXTAUTH_SECRET!));

  return Response.json({ status: 'success', token });
}