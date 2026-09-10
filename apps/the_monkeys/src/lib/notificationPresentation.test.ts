import { FRNNotification } from '@/services/notification/notificationTypes';
import { describe, expect, it } from 'vitest';

import {
  actorUsername,
  isUnreadStatus,
  normalizeFRNNotification,
  notificationCopy,
  notificationHref,
  notificationIcon,
  postHref,
  postTitle,
  profileHref,
  truncateText,
} from './notificationPresentation';

function notif(
  partial: Partial<FRNNotification> & {
    content?: FRNNotification['content'];
  }
): FRNNotification {
  return {
    notification_id: '1',
    channel: 'in_app',
    priority: 'normal',
    status: 'delivered',
    created_at: new Date().toISOString(),
    content: { title: '', body: '', data: {} },
    ...partial,
  };
}

describe('notificationPresentation', () => {
  it('treats read and seen as read', () => {
    expect(isUnreadStatus('delivered')).toBe(true);
    expect(isUnreadStatus('read')).toBe(false);
    expect(isUnreadStatus('seen')).toBe(false);
  });

  it('picks the actor username from known data keys', () => {
    expect(actorUsername({ liker_name: 'dave' })).toBe('dave');
    expect(actorUsername({ actor_name: 'innovation_hub' })).toBe(
      'innovation_hub'
    );
  });

  it('links usernames with @ and posts by blog id', () => {
    expect(profileHref('innovation_hub')).toBe('/innovation_hub');
    expect(profileHref('@dave')).toBe('/dave');
    expect(postHref({ blog_id: 'p44nn' })).toBe('/blog/p44nn');
  });

  it('hides raw blog ids and truncates long post titles', () => {
    expect(
      postTitle({ blog_id: 'rg2i6', blog_title: 'rg2i6' })
    ).toBeUndefined();
    expect(
      postTitle({
        blog_id: 'p44nn',
        blog_title: 'Software Design Principles',
      })
    ).toBe('Software Design Principles');
    expect(truncateText('Software Design Principles')).toBe(
      'Software Design Principles'
    );
    expect(truncateText('A'.repeat(60))).toBe(`${'A'.repeat(48)}...`);
  });

  it('composes like copy as @username liked your post', () => {
    const copy = notificationCopy(
      notif({
        template_id: 'blog_liked_inapp',
        content: {
          title: 'Blog liked',
          body: 'innovation_hub liked your post "rg2i6".',
          data: {
            liker_name: 'innovation_hub',
            blog_id: 'p44nn',
            blog_title: 'Software Design Principles',
          },
        },
      })
    );
    expect(copy.actor).toBe('innovation_hub');
    expect(copy.rest).toBe(' liked your post');
    expect(copy.postTitle).toBe('Software Design Principles');
  });

  it('composes RSVP copy as @username plus a quoted event title', () => {
    const copy = notificationCopy(
      notif({
        template_id: 'event_rsvp_host_notice_inapp',
        category: 'events',
        content: {
          title: 'New RSVP',
          body: 'innovation_hub RSVP\'d to "{{.event_title}}".',
          data: {
            actor_name: 'innovation_hub',
            event_slug: 'chai-meeting',
            event_title: 'Chai meeting',
          },
        },
      })
    );
    expect(copy.actor).toBe('innovation_hub');
    expect(copy.rest).toBe(" RSVP'd to your event");
    expect(copy.eventTitle).toBe('Chai meeting');
    expect(copy.eventHref).toBe('/events/chai-meeting');
  });

  it('composes application and group copy with a quoted target title', () => {
    const applied = notificationCopy(
      notif({
        template_id: 'event_application_received_sse',
        content: {
          title: 'New application',
          body: '',
          data: {
            actor_name: 'the_color_lens',
            event_slug: 'lab-host-rooftop-chai',
            event_title: 'Lab Host rooftop chai',
          },
        },
      })
    );
    expect(applied.rest).toBe(' applied to join your event');
    expect(applied.eventTitle).toBe('Lab Host rooftop chai');

    const joined = notificationCopy(
      notif({
        template_id: 'group_member_joined_inapp',
        content: {
          title: 'New member',
          body: '',
          data: {
            actor_name: 'dave',
            group_slug: 'writers',
            group_name: 'Writers',
          },
        },
      })
    );
    expect(joined.rest).toBe(' joined your group');
    expect(joined.groupName).toBe('Writers');
    expect(joined.groupHref).toBe('/groups/writers');
  });

  it('links event and group rows to their pages', () => {
    expect(
      notificationHref(
        notif({
          content: {
            title: 'New application',
            body: '',
            data: { event_slug: 'netflix-night' },
          },
        })
      )
    ).toBe('/events/netflix-night');

    expect(
      notificationHref(
        notif({
          content: {
            title: 'Join request',
            body: '',
            data: { group_slug: 'writers' },
          },
        })
      )
    ).toBe('/groups/writers');
  });

  it('uses a shield for login and a calendar for events', () => {
    expect(
      notificationIcon(
        notif({ category: 'security', template_id: 'login_detected_inapp' })
      )
    ).toBe('RiShield');
    expect(
      notificationIcon(
        notif({
          category: 'events',
          template_id: 'event_application_approved_inapp',
        })
      )
    ).toBe('RiCalendar');
    expect(
      notificationIcon(
        notif({ category: 'social', template_id: 'blog_liked_inapp' })
      )
    ).toBe('RiHeart3');
  });

  it('normalizes flat FRN SSE payloads into the list shape', () => {
    const parsed = normalizeFRNNotification({
      notification_id: 'abc',
      title: 'Blog liked',
      body: 'dave liked your post',
      channel: 'sse',
      status: 'delivered',
      data: { liker_name: 'dave', blog_id: 'p44nn' },
      created_at: '2026-09-10T00:00:00Z',
    });
    expect(parsed?.notification_id).toBe('abc');
    expect(parsed?.content.title).toBe('Blog liked');
    expect(parsed?.content.data.liker_name).toBe('dave');
  });
});
