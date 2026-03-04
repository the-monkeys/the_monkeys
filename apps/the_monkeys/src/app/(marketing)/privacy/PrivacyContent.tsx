'use client';

import LegalPage from '@/components/LegalPage';
import Content from '@/markdown/privacy.mdx';
import { MDXProvider } from '@mdx-js/react';

export const PrivacyContent = () => {
  return (
    <MDXProvider>
      <LegalPage
        title='Privacy Policy'
        date='30-01-2026'
        content={<Content />}
      />
    </MDXProvider>
  );
};
