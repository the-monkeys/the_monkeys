'use client';

import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2
        style={{
          padding: '10px 0',
          fontWeight: '400',
          fontFamily: 'var(--font-dm_sans)',
        }}
      >
        {children}
      </h2>
    ),
    p: ({ children }) => (
      <p
        style={{
          padding: '4px 0',
          fontWeight: '300',
          opacity: '.8',
        }}
      >
        {children}
      </p>
    ),
    ...components,
  };
}
