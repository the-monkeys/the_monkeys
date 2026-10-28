import { MobileBottomTabBar } from '@/components/layout/MobileBottomTabBar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

let pathname = '/';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));
let client: QueryClient;
function renderTabs(path: string, signedIn = false) {
  pathname = path;
  client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  client.setQueryData(['auth'], signedIn ? { username: 'alex' } : null);
  return render(
    <QueryClientProvider client={client}>
      <MobileBottomTabBar />
    </QueryClientProvider>
  );
}
afterEach(() => {
  cleanup();
  client?.clear();
});

describe('mobile Events navigation', () => {
  it('lets a guest discover events from the second tab while keeping personal tabs protected', () => {
    renderTabs('/');
    const links = screen.getAllByRole('link');
    expect(links[1].textContent).toBe('Events');
    expect(links[1].getAttribute('href')).toBe('/events');
    expect(screen.queryByRole('link', { name: 'Explore' })).toBeNull();
    for (const name of ['Create', 'Saved', 'Profile'])
      expect(screen.getByRole('link', { name }).getAttribute('href')).toBe(
        '/auth/login'
      );
  });

  it.each(['/events', '/events/', '/events/community-gathering-local'])(
    'highlights Events on %s',
    (path) => {
      renderTabs(path, true);
      expect(
        screen
          .getByRole('link', { name: 'Events' })
          .getAttribute('aria-current')
      ).toBe('page');
      expect(
        screen.getByRole('link', { name: 'Profile' }).getAttribute('href')
      ).toBe('/alex');
    }
  );

  it.each(['/events-other', '/topics/culture', '/'])(
    'does not falsely highlight Events on %s',
    (path) => {
      renderTabs(path);
      expect(
        screen
          .getByRole('link', { name: 'Events' })
          .getAttribute('aria-current')
      ).toBeNull();
    }
  );
});
