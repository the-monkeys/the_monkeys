import type { Metadata } from 'next';

import { LIVE_URL } from '@/constants/api';

const base = LIVE_URL || 'https://monkeys.com.co';

export const metadata: Metadata = {
  title: 'Groups',
  description:
    'Discover communities, meet organizers, and join groups on the Monkeys platform.',
  openGraph: {
    title: 'Groups · Monkeys',
    description:
      'Discover communities, meet organizers, and join groups on the Monkeys platform.',
    siteName: 'Monkeys',
    type: 'website',
    images: [
      {
        url: `${base}/social-snapshot-placeholder.png`,
        width: 1200,
        height: 630,
        alt: 'Monkeys Groups',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Groups · Monkeys',
    description:
      'Discover communities, meet organizers, and join groups on the Monkeys platform.',
    images: [`${base}/social-snapshot-placeholder.png`],
  },
};

export default function GroupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='min-h-[70vh] pb-16'>{children}</div>;
}
