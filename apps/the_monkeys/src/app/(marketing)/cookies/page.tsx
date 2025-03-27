import { Metadata } from 'next';

import { CookiesContent } from './CookiesContent';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Cookies Policy',
    description:
      'Discover how Monkeys uses cookies to enhance your experience on our website. Read our detailed Cookie Policy to learn about the types of cookies we use, their purpose, and your rights regarding cookie usage.',
  };
}

const CookiesPage = () => {
  return <CookiesContent />;
};

export default CookiesPage;
