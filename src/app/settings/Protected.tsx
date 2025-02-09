'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useSession } from '../session-store-provider';

export default function Protected() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') return;

    router.replace('/auth/login');
  }, [status]);

  return null;
}
