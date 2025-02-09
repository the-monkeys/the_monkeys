'use client';

import { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { useSession } from '@/app/session-store-provider';

export default function Protected() {
  const { status } = useSession();
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (status === 'unauthenticated') return;

    const callbackURL = params.get('callbackURL');
    if (callbackURL) {
      router.replace(callbackURL);
      return;
    }

    router.replace('/');
  }, [status]);

  return null;
}
