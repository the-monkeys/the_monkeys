'use client';

import LegalPage from '@/components/LegalPage';
import Content from '@/markdown/cookies.mdx';
import { MDXProvider } from '@mdx-js/react';

export const CookiesContent = () => {
  return (
    <MDXProvider>
      <LegalPage
        title='Cookie Policy'
        date='30-01-2026'
        content={<Content />}
      />
    </MDXProvider>
  );
};
