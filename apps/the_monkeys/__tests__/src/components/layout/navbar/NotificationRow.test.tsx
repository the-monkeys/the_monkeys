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

const postNotification: FRNNotification = {
  notification_id: 'notification-2',
  channel: 'in_app',
  priority: 'normal',
  status: 'delivered',
  category: 'social',
  template_id: 'post_liked_inapp',
  created_at: '2026-09-11T00:00:00.000Z',
  content: {
    title: '{{liker_name}} liked your post',
    body: '{{liker_name}} liked your post',
    data: {
      liker_name: 'alice',
      blog_id: 'post-123',
      blog_title: 'A Better Notification',
    },
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

  it('links the actor avatar and username to the profile independently from the post', () => {
    renderWithProviders(<NotificationRow notif={postNotification} />);

    const avatar = screen.getByRole('img', { name: 'Author: alice' });
    const username = screen.getByRole('link', { name: '@alice' });
    const post = screen.getByRole('link', {
      name: '"A Better Notification"',
    });

    expect(avatar.closest('a')?.getAttribute('href')).toBe('/alice');
    expect(username.getAttribute('href')).toBe('/alice');
    expect(post.getAttribute('href')).toBe(
      '/blog/a-better-notification-post-123'
    );
  });
});
