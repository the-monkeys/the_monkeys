'use client';

import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2
        style={{
          padding: '10px 0',
          fontWeight: '400',
          fontSize: '1.2rem',
          lineHeight: 1.5,
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
          fontSize: '1rem',
          lineHeight: 1.5,
          opacity: '.96',
        }}
      >
        {children}
      </p>
    ),
    ...components,
  };
}
