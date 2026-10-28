import { NotificationCard } from '@/app/notifications/components/NotificationCard';
import { NotificationRow } from '@/components/layout/navbar/NotificationRow';
import { FRNNotification } from '@/services/notification/notificationTypes';
import { cleanup, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it.each(['row', 'page card'])(
    'opens the complete message from a %s without rendering payload fields',
    async (surface) => {
      const user = userEvent.setup();
      const notification = {
        ...unreadNotification,
        content: {
          title: 'Event information updated',
          body: 'First line.\nPlease read the complete details, including the final instruction at the end.',
          data: { internal_field: 'DO NOT DISPLAY RAW PAYLOAD' },
        },
      };
      renderWithProviders(
        surface === 'row' ? (
          <NotificationRow notif={notification} />
        ) : (
          <NotificationCard frnNotificationData={notification} />
        )
      );

      await user.click(
        screen.getByRole('button', {
          name: 'View notification: Event information updated',
        })
      );
      const dialog = screen.getByRole('dialog', {
        name: 'Event information updated',
      });
      expect(
        within(dialog).getByText(/final instruction at the end/).textContent
      ).toBe(notification.content.body);
      expect(
        within(dialog).queryByText('DO NOT DISPLAY RAW PAYLOAD')
      ).toBeNull();
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(document.activeElement).toBe(
        screen.getByRole('button', {
          name: 'View notification: Event information updated',
        })
      );
    }
  );

  it('resolves the complete template and retains the related event destination', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <NotificationRow
        notif={{
          ...unreadNotification,
          template_id: 'event_cohost_added_inapp',
          category: 'events',
          content: {
            title: 'You are a co-host',
            body: '{{actor_name}} added you as co-host for {{event_title}}. You can now help manage the event.',
            data: {
              actor_name: 'alex',
              event_title: 'Community gathering',
              event_slug: 'community-gathering-local',
            },
          },
        }}
      />
    );
    await user.click(
      screen.getByRole('button', {
        name: 'View notification: You are a co-host',
      })
    );
    const dialog = screen.getByRole('dialog');
    const actorLink = within(dialog).getByRole('link', { name: '@alex' });
    expect(actorLink.closest('p')?.textContent).toBe(
      '@alex added you as co-host for Community gathering. You can now help manage the event.'
    );
    expect(within(dialog).getAllByRole('link', { name: '@alex' })).toHaveLength(
      1
    );
    expect(
      within(dialog)
        .getByRole('link', { name: 'View event' })
        .getAttribute('href')
    ).toBe('/events/community-gathering-local');
    expect(
      within(dialog).getByRole('link', { name: '@alex' }).getAttribute('href')
    ).toBe('/alex');
  });

  it.each(['alex left as a co-host.', '@alex left as a co-host.'])(
    'links an already rendered actor in %s exactly once with its timestamp',
    async (body) => {
      const user = userEvent.setup();
      renderWithProviders(
        <NotificationRow
          notif={{
            ...unreadNotification,
            content: { title: 'alex left', body, data: { actor_name: 'alex' } },
          }}
        />
      );
      await user.click(
        screen.getByRole('button', { name: 'View notification: alex left' })
      );
      const dialog = screen.getByRole('dialog');
      const actor = within(dialog).getByRole('link', { name: '@alex' });
      expect(actor.closest('p')?.textContent).toBe('@alex left as a co-host.');
      expect(dialog.textContent?.match(/alex/g)).toHaveLength(1);
      expect(dialog.querySelector('time')?.dateTime).toBe(
        '2026-09-11T00:00:00.000Z'
      );
    }
  );

  it('keeps markup and names inside other words as plain text', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <NotificationRow
        notif={{
          ...unreadNotification,
          content: {
            title: 'Update',
            body: '<img src=x onerror=alert(1)> alexander: alex left.',
            data: { actor_name: 'alex' },
          },
        }}
      />
    );
    await user.click(
      screen.getByRole('button', { name: 'View notification: Update' })
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.querySelector('img')).toBeNull();
    const actor = within(dialog).getByRole('link', { name: '@alex' });
    expect(actor.closest('p')?.textContent).toBe(
      '<img src=x onerror=alert(1)> alexander: @alex left.'
    );
  });

  it('retains a legacy title-only message with an inline actor instead of losing its content', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <NotificationRow
        notif={{
          ...unreadNotification,
          content: {
            title: '{{actor_name}} left as a co-host.',
            body: '',
            data: { actor_name: 'alex' },
          },
        }}
      />
    );
    await user.click(
      screen.getByRole('button', {
        name: 'View notification: alex left as a co-host.',
      })
    );
    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByRole('link', { name: '@alex' }).closest('p')
        ?.textContent
    ).toBe('@alex left as a co-host.');
  });

  it('keeps profile and post links independent of the detail action', async () => {
    const user = userEvent.setup();
    renderWithProviders(<NotificationRow notif={postNotification} />);
    // Prevent JSDOM navigation at the document boundary, not in the component.
    const stopNavigation = (e: Event) => e.preventDefault();
    document.addEventListener('click', stopNavigation);
    try {
      await user.click(screen.getByRole('link', { name: '@alice' }));
      expect(screen.queryByRole('dialog')).toBeNull();
      await user.click(
        screen.getByRole('link', { name: '"A Better Notification"' })
      );
      expect(screen.queryByRole('dialog')).toBeNull();
    } finally {
      document.removeEventListener('click', stopNavigation);
    }
  });

  it('handles an empty legacy message and invalid timestamp without showing Invalid Date', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <NotificationRow
        notif={{
          ...unreadNotification,
          category: undefined,
          created_at: 'invalid',
          content: { title: '', body: '', data: {} },
        }}
      />
    );
    await user.click(
      screen.getByRole('button', { name: 'View notification: Notification' })
    );
    const dialog = screen.getByRole('dialog', { name: 'Notification' });
    expect(
      within(dialog).getByText('No additional details are available.')
    ).toBeDefined();
    expect(dialog.textContent).not.toMatch(/Invalid Date|NaN/);
  });
});
