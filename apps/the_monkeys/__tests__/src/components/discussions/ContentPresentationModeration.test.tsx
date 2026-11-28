import type { ReactNode } from 'react';

import EventDetailClient from '@/app/events/[slug]/EventDetailClient';
import GroupDetailClient from '@/app/groups/[slug]/GroupDetailClient';
import { DiscussionCard } from '@/components/discussions/DiscussionCard';
import { DiscussionThread } from '@/components/discussions/DiscussionThread';
import { EventCard, EventHeroCard } from '@/components/events/EventCard';
import { EventGridCard } from '@/components/events/EventGridCard';
import { GroupCard } from '@/components/groups/GroupCard';
import { GroupGridCard } from '@/components/groups/GroupGridCard';
import { LandingGroups } from '@/components/landing/LandingCommunity';
import { LandingEditorialFeed } from '@/components/landing/LandingEditorialFeed';
import { LandingEventsSection } from '@/components/landing/LandingEventsSection';
import { LandingFeaturedEvent } from '@/components/landing/LandingFeaturedEvent';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
  usePathname: () => '/',
}));
const mocks = vi.hoisted(() => ({
  event: {} as any,
  group: {} as any,
  gallery: vi.fn(),
  gate: vi.fn(),
  hostRead: vi.fn(),
  community: vi.fn(),
  groupRead: vi.fn(),
  preview: vi.fn(),
}));
vi.mock('@/components/moderation/ContentGate', () => ({
  ContentGate: ({
    content,
    children,
    href,
  }: {
    href?: string;
    content: { is_nsfw?: boolean; content_unavailable?: boolean };
    children: ReactNode;
  }) =>
    content.is_nsfw || content.content_unavailable ? (
      <p data-reveal-href={href}>Restricted content</p>
    ) : (
      <>{children}</>
    ),
}));
vi.mock('@/components/moderation/ContentOptions', () => ({
  ContentOptions: ({
    target,
    canLabel,
  }: {
    target: { kind: string; id: string };
    canLabel?: boolean;
  }) => (
    <button
      aria-label={`${target.kind} options`}
      data-target={target.id}
      data-label={!!canLabel}
    >
      Options
    </button>
  ),
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: { account_id: 'owner', username: 'owner' } }),
}));
vi.mock('@/hooks/events/useViewerTimezone', () => ({
  useViewerTimezone: () => 'UTC',
}));
vi.mock('@/hooks/events/useEventQueries', () => ({
  useEventDetail: () => ({ data: { event: mocks.event } }),
}));
vi.mock('@/hooks/groups/useGroupQueries', () => ({
  useGroupDetail: (slug?: string) => {
    mocks.groupRead(slug);
    return { data: { group: mocks.group } };
  },
}));
vi.mock('@/hooks/user/useGetProfileInfoByUserId', () => ({
  default: () => {
    mocks.hostRead();
    return { user: undefined };
  },
}));
vi.mock('@/components/profileImage', () => ({
  ProfileFrame: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  ProfileImage: () => <img src='/private-host.jpg' alt='' />,
}));
vi.mock('@/components/user/userInfo', () => ({
  UserInfoCardShowcase: () => null,
}));
vi.mock('@/components/editorial/BlogActionBar', () => ({
  default: () => null,
}));
vi.mock('@/components/events/EventHostName', () => ({
  EventHostName: () => null,
}));
vi.mock('@/components/events/EventActions', () => ({
  EventActions: () => null,
}));
vi.mock('@/components/events/detail/EventGallery', () => ({
  EventGallery: () => {
    mocks.gallery();
    return <p>Gallery mounted</p>;
  },
}));
vi.mock('@/components/groups/detail/GroupCommunity', () => ({
  GroupCommunity: () => {
    mocks.community();
    return <p>Community mounted</p>;
  },
}));
vi.mock('@/components/groups/detail/GroupJoinButton', () => ({
  GroupJoinButton: () => null,
}));
vi.mock('@/components/groups/detail/GroupCreateMenu', () => ({
  GroupCreateMenu: () => null,
}));
vi.mock('@/services/discussions/discussionsApi', () => ({
  getDiscussion: vi.fn(async () => ({ ...discussion, is_nsfw: true })),
}));
vi.mock('@/components/discussions/DiscussionAvatar', () => ({
  DiscussionAvatar: () => null,
}));
vi.mock('@/components/discussions/DiscussionCardMenu', () => ({
  DiscussionCardMenu: () => null,
}));
vi.mock('@/components/discussions/DiscussionActions', () => ({
  DiscussionActions: () => null,
}));
vi.mock('@/components/discussions/ReplyForm', () => ({
  ReplyForm: () => <p>Reply form mounted</p>,
  ReplyToggle: () => null,
}));
vi.mock('@/components/discussions/DiscussionGroupLine', () => ({
  DiscussionGroupLine: () => null,
}));
vi.mock('@/components/discussions/discussionChrome', () => ({
  DiscussionIdentity: () => null,
  DiscussionStats: () => null,
  discussionHandle: () => '',
}));
vi.mock('@/components/discussions/DiscussionLinkPreview', () => ({
  DiscussionLinkPreview: () => {
    mocks.preview();
    return <p>Link preview mounted</p>;
  },
}));
vi.mock('@/components/social/SocialSnapshot', () => ({
  SocialSnapshotCard: () => <p>Snapshot mounted</p>,
}));
vi.mock('@/components/events/EventComments', () => ({
  EventComments: () => null,
}));
vi.mock('@/components/events/EventReactions', () => ({
  EventReactions: () => null,
}));
vi.mock('@/components/events/RsvpPanel', () => ({ RsvpPanel: () => null }));
vi.mock('@/components/events/detail/EventAttendees', () => ({
  EventAttendees: () => null,
}));
vi.mock('@/components/events/detail/EventHost', () => ({
  EventHost: () => null,
}));
vi.mock('@/components/events/detail/EventHostPanel', () => ({
  EventHostPanel: () => null,
}));
vi.mock('@/components/events/detail/EventLocationMap', () => ({
  EventLocationMap: () => null,
}));
vi.mock('@/components/events/detail/EventRelated', () => ({
  EventRelated: () => null,
}));
vi.mock('@/components/events/detail/EventSidebarMeta', () => ({
  EventSidebarMeta: () => null,
}));
vi.mock('@/components/events/detail/EventStickyBar', () => ({
  EventStickyBar: () => null,
}));

const event = {
  id: 5,
  slug: 'meetup',
  title: 'Private event title',
  description: 'Private event body',
  event_type: 'virtual' as const,
  status: 'published' as const,
  cover_image: '/private-event.jpg',
  organizer_username: 'owner',
};
const group = {
  id: 8,
  slug: 'hive',
  name: 'Private group title',
  description: 'Private group body',
  visibility: 'public' as const,
  status: 'published' as const,
  cover_image: '/private-group.jpg',
  organizer_username: 'owner',
};
const discussion = {
  public_id: 'thought',
  status: 'visible',
  body: 'Private discussion text https://monkeys.com.co/events/meetup',
  group_slug: 'hive',
  replies: [{ public_id: 'reply', body: 'Private reply', status: 'visible' }],
};
afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  mocks.event = event;
  mocks.group = group;
});

it.each([
  [
    'event list',
    (flagged: boolean) => <EventCard event={{ ...event, is_nsfw: flagged }} />,
  ],
  [
    'event grid',
    (flagged: boolean) => (
      <EventGridCard event={{ ...event, is_nsfw: flagged }} />
    ),
  ],
  [
    'event hero',
    (flagged: boolean) => (
      <EventHeroCard event={{ ...event, is_nsfw: flagged }} />
    ),
  ],
  [
    'group list',
    (flagged: boolean) => <GroupCard group={{ ...group, is_nsfw: flagged }} />,
  ],
  [
    'group grid',
    (flagged: boolean) => (
      <GroupGridCard group={{ ...group, is_nsfw: flagged }} />
    ),
  ],
] as const)(
  'gates %s before mounting real media and text while preserving legacy cards',
  (_name, card) => {
    const { container, rerender } = render(card(true));
    expect(
      screen.getByText('Restricted content').getAttribute('data-reveal-href')
    ).toBe(_name.startsWith('event') ? '/events/meetup' : '/groups/hive');
    expect(container.querySelector('img')).toBeNull();
    expect(screen.queryByText(/Private (event|group) title/)).toBeNull();
    rerender(card(false));
    expect(container.querySelector('img')).not.toBeNull();
    expect(screen.getByText(/Private (event|group) title/)).toBeTruthy();
  }
);

it('does not mount event gallery, attendee, RSVP, or comment content behind a blocked detail gate', () => {
  mocks.event = { ...event, is_nsfw: true };
  const { container } = render(<EventDetailClient slug='meetup' />);
  expect(screen.getByText('Restricted content')).toBeTruthy();
  expect(container.querySelector('img')).toBeNull();
  expect(mocks.gallery).not.toHaveBeenCalled();
});

it('does not mount group community fetches or media behind a blocked detail gate', () => {
  mocks.group = { ...group, is_nsfw: true };
  const { container } = render(<GroupDetailClient slug='hive' />);
  expect(screen.getByText('Restricted content')).toBeTruthy();
  expect(container.querySelector('img')).toBeNull();
  expect(mocks.community).not.toHaveBeenCalled();
});

it('does not mount discussion link previews, body, or footer behind the card gate', () => {
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <DiscussionCard
        post={{ ...discussion, is_nsfw: true }}
        linked
        footer={<p>Private footer</p>}
      />
    </QueryClientProvider>
  );
  expect(screen.getByText('Restricted content')).toBeTruthy();
  expect(screen.queryByText(/Private discussion text/)).toBeNull();
  expect(screen.queryByText('Private footer')).toBeNull();
  expect(mocks.preview).not.toHaveBeenCalled();
});

it('gates the entire thread before group reads, replies, snapshots, and reply forms', () => {
  render(<DiscussionThread post={{ ...discussion, is_nsfw: true }} />);
  expect(screen.getByText('Restricted content')).toBeTruthy();
  expect(screen.queryByText('Private reply')).toBeNull();
  expect(screen.queryByText('Reply form mounted')).toBeNull();
  expect(screen.queryByText('Snapshot mounted')).toBeNull();
  expect(mocks.groupRead).not.toHaveBeenCalled();
});

it('keeps one event card options menu targeted at its slug and permits its author to label', () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <EventGridCard event={event} />
    </QueryClientProvider>
  );
  const menu = screen.getAllByRole('button', { name: 'event options' });
  expect(menu).toHaveLength(1);
  expect(menu[0].getAttribute('data-target')).toBe('meetup');
  expect(menu[0].getAttribute('data-label')).toBe('true');
});

it('keeps one group card options menu targeted at its slug and permits its author to label', () => {
  render(
    <QueryClientProvider client={new QueryClient()}>
      <GroupCard group={group} />
    </QueryClientProvider>
  );
  const menu = screen.getAllByRole('button', { name: 'group options' });
  expect(menu).toHaveLength(1);
  expect(menu[0].getAttribute('data-target')).toBe('hive');
  expect(menu[0].getAttribute('data-label')).toBe('true');
});

it('gates the featured landing event before cover, description and organizer-profile reads', () => {
  const { container, rerender } = render(
    <LandingFeaturedEvent event={{ ...event, is_nsfw: true }} />
  );
  expect(screen.getByText('Restricted content')).toBeTruthy();
  expect(container.querySelector('img')).toBeNull();
  expect(screen.queryByText('Private event title')).toBeNull();
  expect(mocks.hostRead).not.toHaveBeenCalled();
  expect(screen.getAllByRole('button', { name: 'event options' })).toHaveLength(
    1
  );
  rerender(<LandingFeaturedEvent event={event} />);
  expect(screen.getByText('Private event title')).toBeTruthy();
});

it('gates compact landing events and keeps one report menu available on each placeholder', () => {
  render(
    <LandingEventsSection
      variant='compact'
      events={[{ ...event, is_nsfw: true }]}
      isLoading={false}
      isError={false}
    />
  );
  expect(screen.getByText('Restricted content')).toBeTruthy();
  expect(screen.queryByText('Private event title')).toBeNull();
  expect(screen.getAllByRole('button', { name: 'event options' })).toHaveLength(
    1
  );
});

it('gates landing group logos, names, descriptions and links while retaining report', () => {
  const { container, rerender } = render(
    <LandingGroups
      groups={{
        data: [{ ...group, logo_image: '/private-logo.jpg', is_nsfw: true }],
      }}
    />
  );
  expect(screen.getByText('Restricted content')).toBeTruthy();
  expect(container.querySelector('img')).toBeNull();
  expect(screen.queryByText('Private group title')).toBeNull();
  expect(
    screen.queryByRole('link', { name: 'View group Private group title' })
  ).toBeNull();
  expect(screen.getAllByRole('button', { name: 'group options' })).toHaveLength(
    1
  );
  rerender(<LandingGroups groups={{ data: [group] }} />);
  expect(
    screen.getByRole('link', { name: 'View group Private group title' })
  ).toBeTruthy();
});

it('gates editorial-feed events using the event target with reporting still accessible', () => {
  render(
    <LandingEditorialFeed posts={[]} events={[{ ...event, is_nsfw: true }]} />
  );
  expect(screen.getByText('Restricted content')).toBeTruthy();
  expect(screen.queryByText('Private event title')).toBeNull();
  expect(screen.getAllByRole('button', { name: 'event options' })).toHaveLength(
    1
  );
});
