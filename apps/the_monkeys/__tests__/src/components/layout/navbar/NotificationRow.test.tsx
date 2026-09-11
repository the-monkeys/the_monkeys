import { NotificationRow } from '@/components/layout/navbar/NotificationRow';
import { FRNNotification } from '@/services/notification/notificationTypes';
import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../../../utils';

const unreadNotification: FRNNotification = {
  notification_id: 'notification-1',
  channel: 'in_app',
  priority: 'normal',
  status: 'delivered',
  category: 'security',
  template_id: 'login_detected_inapp',
  created_at: '2026-09-11T00:00:00.000Z',
  content: {
    title: 'New login detected',
    body: 'A new login was detected.',
    data: {},
  },
};

describe('NotificationRow', () => {
  afterEach(cleanup);

  it('announces unread notifications while preserving the visual unread state', () => {
    const { container } = renderWithProviders(
      <NotificationRow notif={unreadNotification} />
    );

    expect(screen.getByText('Unread notification')).toBeDefined();
    expect(
      container.querySelector('[data-notification-state="unread"]')
    ).not.toBeNull();
  });
});
