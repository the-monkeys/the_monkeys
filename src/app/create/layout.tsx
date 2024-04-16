import type { Metadata } from 'next';

const title = 'Monkeys | Create';
const description = 'We are The Monkeys! A blogging and educational platform.';

export const metadata: Metadata = {
  title,
  description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='mb-20 min-h-screen sm:w-4/5 mx-auto w-full'>{children}</div>
  );
}
