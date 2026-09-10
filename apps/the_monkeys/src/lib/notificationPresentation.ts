import { IconName } from '@/components/icon';
import {
  EVENTS_ROUTE,
  GROUPS_ROUTE,
  SETTINGS_ROUTE,
} from '@/constants/routeConstants';
import {
  FRNNotification,
  FRNNotificationContent,
  resolveTemplate,
} from '@/services/notification/notificationTypes';

const ACTOR_KEYS = [
  'actor_name',
  'follower_name',
  'liker_name',
  'inviter_name',
  'coauthor_name',
  'remover_name',
  'publisher_name',
  'commenter_name',
] as const;

const POST_TITLE_MAX = 48;

export function isUnreadStatus(status?: string): boolean {
  return status !== 'read' && status !== 'seen';
}

export function actorUsername(
  data?: Record<string, unknown>
): string | undefined {
  if (!data) return undefined;
  for (const key of ACTOR_KEYS) {
    const val = data[key];
    if (typeof val === 'string' && val.trim()) return val.trim();
  }
  return undefined;
}

export function truncateText(text: string, max = POST_TITLE_MAX): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trimEnd()}...`;
}

/** Real post title, never the raw blog id. */
export function postTitle(data?: Record<string, unknown>): string | undefined {
  if (!data) return undefined;
  const id = typeof data.blog_id === 'string' ? data.blog_id.trim() : '';
  const title =
    typeof data.blog_title === 'string' ? data.blog_title.trim() : '';
  if (!title || (id && title === id)) return undefined;
  return title;
}

export function profileHref(username?: string): string | undefined {
  if (!username) return undefined;
  return `/${username.replace(/^@/, '')}`;
}

export function postHref(data?: Record<string, unknown>): string | undefined {
  const blogId = typeof data?.blog_id === 'string' ? data.blog_id.trim() : '';
  if (blogId) return `/blog/${blogId}`;
  return undefined;
}

export function notificationHref(notif: FRNNotification): string | undefined {
  const data = notif.content?.data;
  const eventSlug = typeof data?.event_slug === 'string' ? data.event_slug : '';
  if (eventSlug) return `${EVENTS_ROUTE}/${eventSlug}`;

  const groupSlug = typeof data?.group_slug === 'string' ? data.group_slug : '';
  if (groupSlug) return `${GROUPS_ROUTE}/${groupSlug}`;

  const blog = postHref(data);
  if (blog) return blog;

  const actor = actorUsername(data);
  if (actor) return profileHref(actor);

  if (notif.category === 'security') return SETTINGS_ROUTE;
  return undefined;
}

export function notificationIcon(notif: FRNNotification): IconName {
  const name = (notif.template_id || '').toLowerCase();
  const category = (notif.category || '').toLowerCase();

  if (category === 'security' || name.includes('login')) return 'RiShield';
  if (name.includes('like')) return 'RiHeart3';
  if (name.includes('comment')) return 'RiChat1';
  if (name.includes('follow')) return 'RiUser';
  if (name.includes('group')) return 'RiGroup';
  if (category === 'events' || name.includes('event')) return 'RiCalendar';
  if (category === 'collaboration') return 'RiShakeHands';
  if (category === 'social') return 'RiUser';
  return 'RiNotification3';
}

export type NotificationCopy = {
  actor?: string;
  rest: string;
  postTitle?: string;
  eventTitle?: string;
  eventHref?: string;
  groupName?: string;
  groupHref?: string;
  fallbackTitle: string;
  fallbackBody: string;
};

export function eventTitle(data?: Record<string, unknown>): string | undefined {
  if (!data) return undefined;
  const slug =
    typeof data.event_slug === 'string' ? data.event_slug.trim() : '';
  const title =
    typeof data.event_title === 'string' ? data.event_title.trim() : '';
  if (!title || (slug && title === slug)) return undefined;
  return title;
}

export function eventHref(data?: Record<string, unknown>): string | undefined {
  const slug =
    typeof data?.event_slug === 'string' ? data.event_slug.trim() : '';
  if (!slug) return undefined;
  return `${EVENTS_ROUTE}/${slug}`;
}

export function groupName(data?: Record<string, unknown>): string | undefined {
  if (!data) return undefined;
  const slug =
    typeof data.group_slug === 'string' ? data.group_slug.trim() : '';
  const name =
    typeof data.group_name === 'string' ? data.group_name.trim() : '';
  if (!name || (slug && name === slug)) return undefined;
  return name;
}

export function groupHref(data?: Record<string, unknown>): string | undefined {
  const slug =
    typeof data?.group_slug === 'string' ? data.group_slug.trim() : '';
  if (!slug) return undefined;
  return `${GROUPS_ROUTE}/${slug}`;
}

function actionRest(
  notif: FRNNotification,
  data?: Record<string, unknown>
): string {
  const template = (notif.template_id || '').toLowerCase();

  if (template.includes('event_rsvp_host_notice')) {
    return " RSVP'd to your event";
  }
  if (template.includes('event_application_received')) {
    return ' applied to join your event';
  }
  if (template.includes('event_application_approved')) {
    return ' approved your application';
  }
  if (template.includes('event_application_rejected')) {
    return ' did not approve your application';
  }
  if (template.includes('event_updated')) {
    return ' updated an event';
  }
  if (template.includes('event_cancelled')) {
    return ' cancelled an event';
  }
  if (template.includes('event_new_by_followed')) {
    return ' scheduled a new event';
  }
  if (template.includes('event_comment')) {
    return ' commented on your event';
  }
  if (template.includes('group_event_published')) {
    return ' published an event in your group';
  }
  if (template.includes('group_join_requested')) {
    return ' asked to join your group';
  }
  if (template.includes('group_join_approved')) {
    return ' approved your join request';
  }
  if (template.includes('group_join_rejected')) {
    return ' did not approve your join request';
  }
  if (template.includes('group_member_joined')) {
    return ' joined your group';
  }

  if (typeof data?.liker_name === 'string' || template.includes('like')) {
    return ' liked your post';
  }
  if (typeof data?.follower_name === 'string' || template.includes('follow')) {
    return ' started following you';
  }
  if (
    typeof data?.commenter_name === 'string' ||
    template.includes('comment')
  ) {
    return ' commented on your post';
  }
  if (typeof data?.inviter_name === 'string' || template.includes('invite')) {
    return ' invited you to co-author';
  }
  if (typeof data?.coauthor_name === 'string' && template.includes('accept')) {
    return ' accepted your co-author invite';
  }
  if (typeof data?.coauthor_name === 'string' && template.includes('decline')) {
    return ' declined your co-author invite';
  }
  if (typeof data?.remover_name === 'string' || template.includes('removed')) {
    return ' removed you as a co-author';
  }
  if (
    typeof data?.publisher_name === 'string' ||
    template.includes('published')
  ) {
    return ' published a post you co-authored';
  }
  return '';
}

export function notificationCopy(notif: FRNNotification): NotificationCopy {
  const data = notif.content?.data;
  const actor = actorUsername(data);
  const rest = actor ? actionRest(notif, data) : '';
  const fallbackTitle =
    resolveTemplate(notif.content?.title || '', data) || 'Notification';
  const fallbackBody = resolveTemplate(notif.content?.body || '', data);

  return {
    actor,
    rest,
    postTitle: postTitle(data),
    eventTitle: eventTitle(data),
    eventHref: eventHref(data),
    groupName: groupName(data),
    groupHref: groupHref(data),
    fallbackTitle,
    fallbackBody,
  };
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** FRN list API nests title/body under content; SSE events are flat. */
export function normalizeFRNNotification(raw: unknown): FRNNotification | null {
  if (!raw || typeof raw !== 'object') return null;
  const payload = raw as Record<string, unknown>;
  const nested =
    payload.notification && typeof payload.notification === 'object'
      ? (payload.notification as Record<string, unknown>)
      : payload;

  const id =
    typeof nested.notification_id === 'string' ? nested.notification_id : '';
  if (!id) return null;

  let content: FRNNotificationContent;
  const nestedContent = nested.content;
  if (nestedContent && typeof nestedContent === 'object') {
    const c = nestedContent as Record<string, unknown>;
    content = {
      title: typeof c.title === 'string' ? c.title : '',
      body: typeof c.body === 'string' ? c.body : '',
      data:
        c.data && typeof c.data === 'object'
          ? (c.data as Record<string, unknown>)
          : {},
    };
  } else {
    content = {
      title: typeof nested.title === 'string' ? nested.title : '',
      body: typeof nested.body === 'string' ? nested.body : '',
      data:
        nested.data && typeof nested.data === 'object'
          ? (nested.data as Record<string, unknown>)
          : {},
    };
  }

  return {
    notification_id: id,
    channel: typeof nested.channel === 'string' ? nested.channel : 'sse',
    priority: typeof nested.priority === 'string' ? nested.priority : 'normal',
    status: typeof nested.status === 'string' ? nested.status : 'delivered',
    category: typeof nested.category === 'string' ? nested.category : undefined,
    template_id:
      typeof nested.template_id === 'string' ? nested.template_id : undefined,
    created_at:
      typeof nested.created_at === 'string'
        ? nested.created_at
        : new Date().toISOString(),
    content,
  };
}
