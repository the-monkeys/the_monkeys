'use client';

import { type ReactNode, useEffect, useState } from 'react';

import type { AutoExperiment } from '@growthbook/growthbook';
import {
  type Attributes,
  FeatureDefinition,
  GrowthBook,
  GrowthBookProvider,
} from '@growthbook/growthbook-react';

type Props = {
  features: Record<string, FeatureDefinition<any>>;
  children: ReactNode;
  attributes?: Attributes;
  experiments?: AutoExperiment[];
};

export default function GrowthbookClientProvider({
  attributes,
  children,
  experiments,
  features,
}: Props) {
  // Create a GrowthBook instance
  const [growthbook] = useState(() => {
    return new GrowthBook({
      apiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST,
      attributes,
      clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
      experiments,
      features,
    });
  });

  useEffect(() => {
    // Fetch feature payload from GrowthBook
    growthbook.init({
      //enable streaming updates
      streaming: true,
    });
  }, [growthbook]);

  return (
    <GrowthBookProvider growthbook={growthbook}>{children}</GrowthBookProvider>
  );
}
