import type { Metadata } from 'next';

import { LIVE_URL } from '@/constants/api';

const base = LIVE_URL || 'https://monkeys.com.co';

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Find talks, meetups, and live sessions from the Monkeys community.',
  openGraph: {
    title: 'Events · Monkeys',
    description:
      'Find talks, meetups, and live sessions from the Monkeys community.',
    siteName: 'Monkeys',
    type: 'website',
    images: [
      {
        url: `${base}/social-snapshot-placeholder.png`,
        width: 1200,
        height: 630,
        alt: 'Monkeys Events',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events · Monkeys',
    description:
      'Find talks, meetups, and live sessions from the Monkeys community.',
    images: [`${base}/social-snapshot-placeholder.png`],
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='min-h-[70vh] pb-16'>{children}</div>;
}
