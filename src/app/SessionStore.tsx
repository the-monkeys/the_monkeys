'use client';

import { useEffect } from 'react';

import { useSession } from '@/lib/store/useSession';
import { User } from '@/lib/types';

export default function SessionStore({ data }: { data: User | null }) {
  const setSession = useSession((store) => store.setSession);

  useEffect(() => {
    if (!data) return;

    setSession({
      status: 'authenticated',
      data: { user: { ...data } },
    });
  }, [data]);

  return null;
}
