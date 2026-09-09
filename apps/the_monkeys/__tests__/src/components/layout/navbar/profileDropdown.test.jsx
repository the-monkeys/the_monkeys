import ProfileDropdown from '@/components/layout/navbar/profileDropdown';
import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../../utils';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/services/api/axiosInstance', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

vi.mock('@/utils/sessionManager', () => ({
  default: { endSession: vi.fn() },
}));

const { useUserMock } = vi.hoisted(() => ({
  useUserMock: vi.fn(),
}));

vi.mock('@/hooks/user/useUser', () => ({
  default: (...args) => useUserMock(...args),
}));

const mockSession = {
  username: 'testuser',
  first_name: 'S',
  last_name: 'Joseph',
};

const renderAndOpenDropdown = async (session = mockSession) => {
  renderWithProviders(<ProfileDropdown session={session} />);
  const trigger = screen.getByRole('button');
  await userEvent.click(trigger);
};

describe('ProfileDropdown', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  beforeEach(() => {
    useUserMock.mockReturnValue({
      user: { username: 'testuser', is_verified: false },
      isLoading: false,
    });
  });

  it('Renders profile trigger with avatar', () => {
    renderWithProviders(<ProfileDropdown session={mockSession} />);

    const trigger = screen.getByRole('button');
    expect(trigger).toBeDefined();
  });

  it('Shows Library link with correct href', async () => {
    await renderAndOpenDropdown();

    const libraryLink = screen.getByText('Library');
    expect(libraryLink).toBeDefined();
    expect(libraryLink.closest('a').getAttribute('href')).toBe('/library');
  });

  it('Shows Settings link with correct href', async () => {
    await renderAndOpenDropdown();

    const settingsLink = screen.getByText('Settings');
    expect(settingsLink).toBeDefined();
    expect(settingsLink.closest('a').getAttribute('href')).toBe('/settings');
  });

  it('Shows Logout button', async () => {
    await renderAndOpenDropdown();

    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeDefined();
  });

  it('Shows the full name instead of a 100px-wide truncated label', async () => {
    await renderAndOpenDropdown();

    expect(screen.getByText('S Joseph')).toBeDefined();
    expect(screen.getByText('View profile')).toBeDefined();
    expect(document.querySelector('[class*="w-[100px]"]')).toBeNull();
  });

  it('Shows a verified checkmark next to the name', async () => {
    useUserMock.mockReturnValue({
      user: { username: 'testuser', is_verified: true },
      isLoading: false,
    });
    await renderAndOpenDropdown();

    expect(screen.getByTitle('Verified account')).toBeDefined();
  });

  it('Closes when the page scrolls', async () => {
    await renderAndOpenDropdown();
    expect(screen.getByText('View profile')).toBeDefined();

    fireEvent.scroll(window);
    fireEvent.scroll(document);

    await waitFor(() => {
      expect(screen.queryByText('View profile')).toBeNull();
    });
  });
});
