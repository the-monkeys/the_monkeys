'use client';

import { ReactNode } from 'react';

import fetcher from '@/services/fetcher';
import { SWRConfig } from 'swr';

export default function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig value={{ fetcher, revalidateOnReconnect: true }}>
      {children}
    </SWRConfig>
  );
}
