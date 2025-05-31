import { cookies } from 'next/headers';

import { API_URL } from '@/constants/api';

export async function GET(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  const cookieStore = cookies();

  const authToken = cookieStore.get('mat');

  const headers = new Headers(req.headers);
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken.value}`);
  }

  const response = await fetch(`${API_URL}/${params.path.join('/')}`, {
    method: req.method,
    headers,
  });

  return response;
}

export async function POST(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  const cookieStore = cookies();
  const body = await req.json();

  const authToken = cookieStore.get('mat');

  const headers = new Headers(req.headers);
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken.value}`);
  }

  const response = await fetch(`${API_URL}/${params.path.join('/')}`, {
    method: req.method,
    headers,
    body: JSON.stringify(body),
  });
  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: response.headers,
  });
}

export async function PUT(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  const cookieStore = cookies();
  const body = await req.json();

  const authToken = cookieStore.get('mat');

  const headers = new Headers(req.headers);
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken.value}`);
  }

  const response = await fetch(`${API_URL}/${params.path.join('/')}`, {
    method: req.method,
    headers,
    body: JSON.stringify(body),
  });

  return response;
}

export async function DELETE(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  const cookieStore = cookies();
  const body = await req.json();

  const authToken = cookieStore.get('mat');

  const headers = new Headers(req.headers);
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken.value}`);
  }

  const response = await fetch(`${API_URL}/${params.path.join('/')}`, {
    method: req.method,
    headers,
    body: JSON.stringify(body),
  });

  return response;
}
