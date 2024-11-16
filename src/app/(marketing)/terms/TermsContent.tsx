'use client';

import LegalPage from '@/components/LegalPage';
import Content from '@/markdown/terms.mdx';
import { MDXProvider } from '@mdx-js/react';

export const TermsContent = () => {
  return (
    <MDXProvider>
      <LegalPage title='Terms of Use' date='01-12-2024' content={<Content />} />
    </MDXProvider>
  );
};
