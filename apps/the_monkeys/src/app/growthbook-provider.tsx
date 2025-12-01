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
    growthbook.init({
      streaming: true,
    });
  }, [growthbook]);

  return (
    <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>
  );
}
