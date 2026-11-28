// @vitest-environment node
import { isValidElement } from 'react';

import ProfileLayout from '@/app/[username]/layout';
import ProfilePage from '@/app/[username]/page';
import EventPage from '@/app/events/[slug]/page';
import GroupPage from '@/app/groups/[slug]/page';
import { queryKeys } from '@/lib/queryKeys';
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { eventLoader, groupLoader, profileLoader } = vi.hoisted(() => ({
  eventLoader: vi.fn(),
  groupLoader: vi.fn(),
  profileLoader: vi.fn(),
}));
vi.mock('@/app/events/[slug]/eventMetadata', () => ({
  loadEventForMetadata: eventLoader,
}));
vi.mock('@/app/groups/[slug]/groupMetadata', () => ({
  loadGroupForMetadata: groupLoader,
}));
vi.mock('@/app/[username]/profileData', () => ({
  loadPublicProfile: profileLoader,
}));
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NOT_FOUND');
  },
  redirect: vi.fn(),
  useRouter: () => ({ back: vi.fn() }),
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: undefined }),
}));
vi.mock('@/utils/get-query-client', () => ({
  getQueryClient: () => new QueryClient(),
}));
vi.mock('@/app/events/[slug]/EventDetailClient', () => ({
  default: ({ slug }: { slug: string }) => {
    const { data } = useQuery<{
      event: { title: string; description: string };
    }>({
      queryKey: queryKeys.events.detail(slug),
      queryFn: () => {
        throw new Error('Browser fetch must not run during SSR');
      },
    });
    return (
      <section>
        <h1>{data?.event.title || 'Loading event'}</h1>
        <p>{data?.event.description}</p>
      </section>
    );
  },
}));
vi.mock('@/components/groups/detail/GroupCommunity', () => ({
  GroupCommunity: () => <section>Posts tab</section>,
}));
vi.mock('@/app/[username]/components/ProfileActivity', () => ({
  ProfileActivity: () => null,
}));
vi.mock('@/app/[username]/components/profile/ProfileSection', () => ({
  ProfileSection: ({
    user,
  }: {
    user?: { first_name: string; bio: string };
  }) => (
    <section>
      <h2>{user?.first_name || 'Loading profile'}</h2>
      <p>{user?.bio}</p>
    </section>
  ),
}));

function render(node: React.ReactNode) {
  return renderToStaticMarkup(
    <QueryClientProvider client={new QueryClient()}>{node}</QueryClientProvider>
  );
}

function querySnapshots(node: React.ReactNode): unknown[] {
  if (Array.isArray(node)) return node.flatMap(querySnapshots);
  if (!isValidElement<{ children?: React.ReactNode; state?: unknown }>(node))
    return [];
  if (node.type === HydrationBoundary) return [node.props.state];
  return querySnapshots(node.props.children);
}

describe('public discovery content in the initial HTML', () => {
  beforeEach(() => vi.clearAllMocks());

  it('seeds the event query so title and description render outside schema before browser requests', async () => {
    eventLoader.mockResolvedValue({
      event: {
        id: 1,
        slug: 'local-event',
        title: 'Public community workshop',
        description: 'An accessible local workshop for creators.',
        status: 'published',
        visibility: 'public',
        event_type: 'virtual',
      },
    });
    const html = render(await EventPage({ params: { slug: 'local-event' } }));
    expect(html).toContain('<h1>Public community workshop</h1>');
    expect(html).toContain('<p>An accessible local workshop for creators.</p>');
    expect(html).not.toContain('Loading event');
  });

  it('seeds the group query without waiting for browser effects', async () => {
    groupLoader.mockResolvedValue({
      group: {
        id: 1,
        slug: 'local-group',
        name: 'Creators together',
        description: 'A public group for sharing practical experience.',
        status: 'published',
        visibility: 'public',
      },
    });
    const html = render(await GroupPage({ params: { slug: 'local-group' } }));
    expect(html).toMatch(/<h1[^>]*>Creators together<\/h1>/);
    expect(html).toMatch(
      /<p[^>]*>A public group for sharing practical experience\.<\/p>/
    );
  });

  it('renders the public author name and biography using the profile layout query boundary', async () => {
    profileLoader.mockResolvedValue({
      username: 'local_author',
      first_name: 'Local Author',
      bio: 'Public creator biography.',
      email: 'must-not-be-hydrated@example.test',
      contact_number: 'private-number',
    });
    const element = await ProfileLayout({
      params: { username: 'local_author' },
      children: <ProfilePage params={{ username: 'local_author' }} />,
    });
    const html = render(element);
    const snapshots = querySnapshots(element);
    expect(snapshots).toHaveLength(1);
    const serialized = JSON.stringify(snapshots);
    expect(serialized).toContain('Public creator biography.');
    expect(serialized).not.toContain('must-not-be-hydrated');
    expect(serialized).not.toContain('private-number');
    expect(html).toContain('<h2>Local Author</h2>');
    expect(html).toContain('<p>Public creator biography.</p>');
    expect(html).not.toContain('must-not-be-hydrated');
    expect(html).not.toContain('private-number');
  });

  it('omits the protected meeting URL from the serialized event query data', async () => {
    eventLoader.mockResolvedValue({
      event: {
        id: 1,
        title: 'Workshop',
        slug: 'local-event',
        visibility: 'public',
        status: 'published',
        event_type: 'virtual',
        meeting_link: 'https://meeting.example.test/private-sentinel',
      },
    });
    const snapshots = querySnapshots(
      await EventPage({ params: { slug: 'local-event' } })
    );
    expect(snapshots).toHaveLength(1);
    expect(JSON.stringify(snapshots)).toContain('Workshop');
    expect(JSON.stringify(snapshots)).not.toContain('private-sentinel');
  });
});
