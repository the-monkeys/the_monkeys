'use client';

import LegalPage from '@/components/LegalPage';
import Content from '@/markdown/cookies.mdx';
import { MDXProvider } from '@mdx-js/react';

export const CookiesContent = () => {
  return (
    <MDXProvider>
      <LegalPage
        title='Cookies Policy'
        date='01-12-2024'
        content={<Content />}
      />
    </MDXProvider>
  );
};
