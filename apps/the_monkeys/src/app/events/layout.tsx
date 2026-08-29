import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events',
  description:
    'Find talks, meetups, and live sessions from the Monkeys community.',
  openGraph: {
    title: 'Events · Monkeys',
    description:
      'Find talks, meetups, and live sessions from the Monkeys community.',
    type: 'website',
  },
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='min-h-[70vh] pb-16'>{children}</div>;
}
