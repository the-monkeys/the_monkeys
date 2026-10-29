import WSNotificationDropdown from '@/components/layout/navbar/WSNotificationDropdown';
import axiosInstance from '@/services/api/axiosInstance';
import { cleanup, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it } from 'vitest';

import { renderWithProviders } from '../../../../utils';

const originalAdapter = axiosInstance.defaults.adapter;
beforeEach(() => {
  axiosInstance.defaults.adapter = async (config) => {
    let data: unknown;
    if (config.url?.startsWith('/notification/frn?'))
      data = {
        notifications: [
          {
            notification_id: 'local-detail-message',
            channel: 'in_app',
            priority: 'normal',
            status: 'read',
            created_at: '2026-10-25T01:00:00Z',
            content: {
              title: 'Detailed platform notice',
              body: 'This is the full notification message, not just a preview.',
              data: {},
            },
          },
        ],
        total: 1,
      };
    else if (config.url === '/notification/sse-token')
      data = { sse_token: '', user_id: 'local-user', expires_in: 0 };
    else if (config.url === '/notification/frn/read-all') data = {};
    else throw new Error(`Unexpected offline request: ${config.url}`);
    return { config, data, headers: {}, status: 200, statusText: 'OK' };
  };
});
afterEach(() => {
  cleanup();
  axiosInstance.defaults.adapter = originalAdapter;
});

it('hands off from the real dropdown to a stable dialog and restores focus to the bell', async () => {
  const user = userEvent.setup();
  renderWithProviders(<WSNotificationDropdown username='local-user' />);
  const bell = screen.getByRole('button', { name: 'View notifications' });
  await user.click(bell);
  await user.click(
    await screen.findByRole('button', {
      name: 'View notification: Detailed platform notice',
    })
  );
  const dialog = screen.getByRole('dialog', {
    name: 'Detailed platform notice',
  });
  expect(
    within(dialog).getByText(
      'This is the full notification message, not just a preview.'
    )
  ).toBeDefined();
  expect(screen.queryByRole('heading', { name: 'Notifications' })).toBeNull();
  await user.keyboard('{Escape}');
  await waitFor(() => expect(document.activeElement).toBe(bell));
  expect(screen.queryByRole('dialog')).toBeNull();
  await user.click(bell);
  expect(
    await screen.findByRole('button', {
      name: 'View notification: Detailed platform notice',
    })
  ).toBeDefined();
});

it('opens full details using only the keyboard and returns to the bell', async () => {
  const user = userEvent.setup();
  renderWithProviders(<WSNotificationDropdown username='local-user' />);
  const bell = screen.getByRole('button', { name: 'View notifications' });
  await user.tab();
  expect(document.activeElement).toBe(bell);
  await user.keyboard('{Enter}');
  const detail = await screen.findByRole('button', {
    name: 'View notification: Detailed platform notice',
  });
  await waitFor(() => expect(document.activeElement).toBe(detail));
  await user.keyboard('{Enter}');
  expect(
    screen.getByRole('dialog', { name: 'Detailed platform notice' })
  ).toBeDefined();
  await user.keyboard('{Escape}');
  await waitFor(() => expect(document.activeElement).toBe(bell));
});
