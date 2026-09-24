'use client';

import { ReactNode, useEffect, useState } from 'react';

import { createGrowthbook } from '@/lib/growthbook';
import { GrowthBook, GrowthBookProvider } from '@growthbook/growthbook-react';

type Props = {
  children: ReactNode;
  attributes?: Record<string, any>;
};

export default function GrowthbookClientProvider({
  children,
  attributes,
}: Props) {
  const [growthbook] = useState<GrowthBook>(() => createGrowthbook(attributes));

  useEffect(() => {
    try {
      if (!process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY) return;
      growthbook.init({
        streaming: true,
      });
    } catch {
      // Missing/invalid local keys must not white-screen the app.
    }
  }, [growthbook]);

  return (
    <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>
  );
}
