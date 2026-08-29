import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Groups',
  description:
    'Discover communities, meet organizers, and join groups on the Monkeys platform.',
  openGraph: {
    title: 'Groups · Monkeys',
    description:
      'Discover communities, meet organizers, and join groups on the Monkeys platform.',
    type: 'website',
  },
};

export default function GroupsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='min-h-[70vh] pb-16'>{children}</div>;
}
