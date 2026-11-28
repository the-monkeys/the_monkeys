import Nav from '@/components/layout/navbar/Nav';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));
const auth = vi.hoisted(() => ({ data: null, isLoading: false }));
vi.mock('@/hooks/auth/useAuth', () => ({ default: () => auth }));
vi.mock('@/components/buttons/createButton', () => ({
  CreateButton: () => null,
}));
vi.mock('@/components/buttons/loginButton', () => ({
  default: () => <button>Log in</button>,
}));
vi.mock('@/components/search/SearchInput', () => ({
  SearchInput: () => null,
  SearchInputLink: () => null,
}));
vi.mock('@/components/themeSwitch', () => ({ default: () => null }));
vi.mock('@/components/logo', () => ({ default: () => <span>Logo</span> }));
vi.mock('@/components/layout/navbar/MobileNavDrawer', () => ({
  MobileNavDrawer: () => null,
}));
vi.mock('@/components/layout/navbar/TopicBar', () => ({
  TopicBar: () => null,
}));
vi.mock('@/components/layout/navbar/WSNotificationDropdown', () => ({
  default: () => null,
}));
vi.mock('@/components/layout/navbar/profileDropdown', () => ({
  default: () => null,
}));

describe('Nav browser compatibility', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    document.documentElement.style.removeProperty('--app-header-h');
  });

  it('renders when ResizeObserver is unavailable', () => {
    vi.stubGlobal('ResizeObserver', undefined);

    render(<Nav />);

    expect(screen.getByRole('banner')).toBeDefined();
    expect(
      document.documentElement.style.getPropertyValue('--app-header-h')
    ).not.toBe('');
  });
});

it('does not display a misleading login action before session validation completes', () => {
  auth.isLoading = true;
  try {
    render(<Nav />);
    expect(screen.queryByRole('button', { name: 'Log in' })).toBeNull();
    expect(
      screen.getByRole('status', { name: 'Loading account' })
    ).toBeTruthy();
  } finally {
    cleanup();
    auth.isLoading = false;
  }
});
