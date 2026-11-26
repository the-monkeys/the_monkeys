'use client';

import { useMemo } from 'react';

import { createCreationAttempt } from '@/lib/creationAttempt';

/** Changing account, endpoint or explicit intent discards the previous attempt. */
export function useCreationAttempt(scope: string) {
  return useMemo(() => ({ scope, attempt: createCreationAttempt() }), [scope])
    .attempt;
}
