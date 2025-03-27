import { Metadata } from 'next';

import { TermsContent } from './TermsContent';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Terms of Use',
    description:
      'Read the terms of use for Monkeys to understand the rules and guidelines for using our website and services. Learn about acceptance of terms, user responsibilities, prohibited uses etc.',
  };
}

const TermsPage = () => {
  return <TermsContent />;
};

export default TermsPage;
