import ProfileDropdown from '@/components/layout/navbar/profileDropdown';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

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

const mockSession = {
  username: 'testuser',
  first_name: 'Test',
  last_name: 'User',
};

const renderAndOpenDropdown = async () => {
  renderWithProviders(<ProfileDropdown session={mockSession} />);
  const trigger = screen.getByRole('button');
  await userEvent.click(trigger);
};

describe('ProfileDropdown', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
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

  it('Shows user name', async () => {
    await renderAndOpenDropdown();

    const profileLink = screen.getByText('View profile');
    expect(profileLink).toBeDefined();
  });
});
