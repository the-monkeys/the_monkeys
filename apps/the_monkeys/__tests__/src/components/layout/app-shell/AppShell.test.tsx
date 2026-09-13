import { usePathname } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell/AppShell';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: vi.fn() }));
vi.mock('@/app/contact-us/utils/annoucement', () => ({
  ANNOUNCEMENT: null,
}));
vi.mock('@/components/layout/navbar', () => ({
  default: () => <nav aria-label='Header' />,
}));
vi.mock('@/components/layout/Container', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock('@/components/layout/Sidebar', () => ({
  FeedSidebarDesktop: () => <aside aria-label='Site navigation' />,
}));
vi.mock('@/components/layout/MobileBottomTabBar', () => ({
  MobileBottomTabBar: () => <nav aria-label='Mobile navigation' />,
}));
vi.mock('@/components/layout/app-shell/RightRail', () => ({
  RightRail: () => <aside aria-label='Global discovery rail' />,
}));

describe('AppShell landing layout', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('leaves the home page rail slot to the landing dashboard', () => {
    vi.mocked(usePathname).mockReturnValue('/');

    render(
      <AppShell>
        <main data-testid='landing-content'>Landing content</main>
      </AppShell>
    );

    expect(
      screen.queryByRole('complementary', { name: 'Global discovery rail' })
    ).toBeNull();
    expect(
      screen.getByTestId('landing-content').parentElement?.className
    ).toContain('pt-0');
    expect(
      screen.getByTestId('landing-content').parentElement?.className
    ).not.toContain('py-4');
  });

  it('retains the global discovery rail on feed pages', () => {
    vi.mocked(usePathname).mockReturnValue('/feed');

    render(
      <AppShell>
        <main data-testid='feed-content'>Feed content</main>
      </AppShell>
    );

    expect(
      screen.getByRole('complementary', { name: 'Global discovery rail' })
    ).toBeDefined();
    expect(
      screen.getByTestId('feed-content').parentElement?.className
    ).toContain('py-4');
  });
});
