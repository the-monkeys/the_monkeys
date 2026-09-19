import { Metadata } from 'next';

import { pageMetadata } from '@/lib/seo';

import { PrivacyContent } from './PrivacyContent';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: 'Privacy Policy | Monkeys',
    description:
      'Read how Monkeys and Buddhicintaka (OPC) Pvt. Ltd. collect, use, protect, and manage personal information.',
    path: '/privacy',
  });
}

const PrivacyPage = () => {
  return <PrivacyContent />;
};

export default PrivacyPage;
