'use client';

import dynamic from 'next/dynamic';

import { getQueryClient } from '@/utils/get-query-client';
import { QueryClientProvider } from '@tanstack/react-query';

const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? dynamic(
        () =>
          import('@tanstack/react-query-devtools').then(
            (module) => module.ReactQueryDevtools
          ),
        { ssr: false }
      )
    : null;

export function QueryClientMount({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {ReactQueryDevtools ? <ReactQueryDevtools initialIsOpen={false} /> : null}
      {children}
    </QueryClientProvider>
  );
}
