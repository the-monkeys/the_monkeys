'use client';

import { useEffect } from 'react';

import { validateSession } from '@/services/auth/auth';

import { useSession } from './session-store-provider';

export default function ValidateSession() {
  const { update } = useSession();

  useEffect(() => {
    validateSession()
      .then((resp) => {
        update({ status: 'authenticated', data: { user: resp.data } });
      })
      .catch((err) => {
        update({ status: 'unauthenticated', data: null });
      });
  }, []);

  return null;
}
