import Nav from '@/components/layout/navbar/Nav';
import axiosInstance from '@/services/api/axiosInstance';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import postcss, { AtRule, Node, Root } from 'postcss';
import tailwindcss from 'tailwindcss';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import tailwindConfig from '../../../../../tailwind.config';

vi.mock('next/navigation', () => ({
  usePathname: () => '/events/local-event/manage',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
}));

let client: QueryClient;
const originalAdapter = axiosInstance.defaults.adapter;

beforeEach(() => {
  client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity, staleTime: 60_000 },
    },
  });
  client.setQueryData(['auth'], {
    account_id: 'local-organizer',
    username: 'organizer',
    email: 'organizer@example.test',
  });
  client.setQueryData(['profile-image', 'organizer'], null);
  client.setQueryData(['current-user', 'organizer'], {
    username: 'organizer',
    first_name: 'Local',
    last_name: 'Organizer',
    is_verified: false,
    bio: '',
    address: '',
    twitter: '',
    github: '',
    linkedin: '',
    instagram: '',
    created_at: { seconds: 0, nanos: 0 },
  });
  // The real notification component mounts, but transport stays offline.
  axiosInstance.defaults.adapter = async (config) => {
    let data: unknown;
    if (config.url?.startsWith('/notification/frn?')) {
      data = { notifications: [], total: 0 };
    } else if (config.url === '/notification/sse-token') {
      data = { sse_token: '', user_id: 'local-organizer', expires_in: 0 };
    } else throw new Error(`Unexpected offline API request: ${config.url}`);
    return { config, data, headers: {}, status: 200, statusText: 'OK' };
  };
  vi.stubGlobal('matchMedia', (media: string) => ({
    media,
    matches: false,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent: () => true,
  }));
});

afterEach(() => {
  cleanup();
  client.clear();
  axiosInstance.defaults.adapter = originalAdapter;
  vi.unstubAllGlobals();
});

// JSDOM has no layout engine. Evaluate display rules from the real generated
// Tailwind stylesheet, including ancestor visibility and min-width queries.
// Pixel geometry is checked separately by the parent's browser run.
function visibleAt(element: Element, width: number, css: Root): boolean {
  for (let node: Element | null = element; node; node = node.parentElement) {
    let display = '';
    css.walkRules((rule) => {
      if (
        !rule.nodes.some(
          (node) => node.type === 'decl' && node.prop === 'display'
        )
      )
        return;
      if (!node!.matches(rule.selector)) return;
      for (
        let parent: Node | undefined = rule.parent;
        parent;
        parent = parent.parent
      ) {
        if (parent.type === 'atrule' && (parent as AtRule).name === 'media') {
          const minimum = /min-width:\s*(\d+)px/.exec(
            (parent as AtRule).params
          );
          if (!minimum || width < Number(minimum[1])) return;
        }
      }
      rule.walkDecls('display', (declaration) => {
        display = declaration.value;
      });
    });
    if (display === 'none') return false;
  }
  return true;
}

it('keeps compact search beside signed-in actions through tablet widths, then restores desktop search', async () => {
  render(
    <QueryClientProvider client={client}>
      <ThemeProvider
        defaultTheme='light'
        forcedTheme='light'
        enableSystem={false}
      >
        <Nav />
      </ThemeProvider>
    </QueryClientProvider>
  );
  const input = screen.getByPlaceholderText('Search stories...');
  const compactSearch = screen.getByRole('link', { name: 'Search on Monkeys' });
  const profile = screen.getByRole('button', { name: 'Open profile menu' });
  const create = screen.getByRole('button', { name: 'Create' });
  const notifications = screen.getByRole('button', {
    name: 'View notifications',
  });
  const stylesheet = await postcss([
    tailwindcss({
      ...tailwindConfig,
      content: [{ raw: document.body.innerHTML, extension: 'html' }],
    }),
  ]).process('@tailwind utilities;', { from: undefined });

  for (const width of [390, 640, 768, 1023]) {
    expect(
      visibleAt(input, width, stylesheet.root),
      `full search at ${width}`
    ).toBe(false);
    expect(
      visibleAt(compactSearch, width, stylesheet.root),
      `compact search at ${width}`
    ).toBe(true);
    for (const action of [profile, create, notifications])
      expect(visibleAt(action, width, stylesheet.root)).toBe(true);
  }
  for (const width of [1024, 1440]) {
    expect(
      visibleAt(input, width, stylesheet.root),
      `full search at ${width}`
    ).toBe(true);
    expect(
      visibleAt(compactSearch, width, stylesheet.root),
      `compact search at ${width}`
    ).toBe(false);
  }
});
