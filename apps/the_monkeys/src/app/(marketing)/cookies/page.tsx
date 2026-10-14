import { Metadata } from 'next';

import { pageMetadata } from '@/lib/seo';

import { CookiesContent } from './CookiesContent';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: 'Cookie Policy | Monkeys',
    description:
      'Learn how Monkeys uses cookies, why they are needed, and the choices available to visitors and members.',
    path: '/cookies',
  });
}

const CookiesPage = () => {
  return <CookiesContent />;
};

export default CookiesPage;
