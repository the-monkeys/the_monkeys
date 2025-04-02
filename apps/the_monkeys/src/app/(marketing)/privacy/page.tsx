import { Metadata } from 'next';

import { PrivacyContent } from './PrivacyContent';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Privacy Policy',
    description:
      'Explore our privacy policy to understand how we collect, use, and protect your personal information. Read about our commitment to data security and your rights regarding your data.',
  };
}

const PrivacyPage = () => {
  return <PrivacyContent />;
};

export default PrivacyPage;
