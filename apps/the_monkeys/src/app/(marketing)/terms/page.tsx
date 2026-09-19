import { Metadata } from 'next';

import { pageMetadata } from '@/lib/seo';

import { TermsContent } from './TermsContent';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: 'Terms of Use | Monkeys',
    description:
      'Read the terms that govern use of the Monkeys content and community platform operated by Buddhicintaka (OPC) Pvt. Ltd.',
    path: '/terms',
  });
}

const TermsPage = () => {
  return <TermsContent />;
};

export default TermsPage;
