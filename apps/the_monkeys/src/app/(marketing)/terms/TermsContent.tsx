'use client';

import LegalPage from '@/components/LegalPage';
import Content from '@/markdown/terms.mdx';
import { MDXProvider } from '@mdx-js/react';

export const TermsContent = () => {
  return (
    <MDXProvider>
      <LegalPage
        title='Terms of Service'
        date='30-01-2026'
        content={<Content />}
      />
    </MDXProvider>
  );
};
