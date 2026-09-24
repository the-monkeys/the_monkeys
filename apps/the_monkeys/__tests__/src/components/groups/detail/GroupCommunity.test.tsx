import { GroupCommunity } from '@/components/groups/detail/GroupCommunity';
import { GroupItem } from '@/services/groups/groupsTypes';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const authMock = vi.hoisted(() =>
  vi.fn(() => ({ data: { username: 'innovation_hub' } as { username: string } | null }))
);

vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => authMock(),
}));

vi.mock('@/components/groups/detail/GroupBlogsPanel', () => ({
  GroupBlogsPanel: () => <div>posts-panel</div>,
}));

vi.mock('@/hooks/events/useEventQueries', () => ({
  useGroupEvents: () => ({ data: { events: [] }, isLoading: false }),
}));

vi.mock('@/components/groups/members/GroupAddMember', () => ({
  GroupAddMember: () => null,
}));

vi.mock('@/components/groups/members/GroupMembersManager', () => ({
  GroupMembersManager: () => <div>members-panel</div>,
}));

vi.mock('@/components/groups/members/GroupJoinRequests', () => ({
  GroupJoinRequests: () => <div>requests-panel</div>,
}));

vi.mock('@/components/groups/members/GroupInvites', () => ({
  GroupInvites: () => <div>invites-panel</div>,
}));

const organizerGroup = {
  id: 1,
  slug: 'monkeys-admin-a8df79c4',
  name: 'Monkeys Admin',
  visibility: 'public',
  status: 'published',
  viewer_role: 'organizer',
  viewer_member_status: 'active',
} satisfies GroupItem;

describe('GroupCommunity', () => {
  afterEach(() => cleanup());

  beforeEach(() => {
    authMock.mockReturnValue({ data: { username: 'innovation_hub' } });
    window.history.replaceState(null, '', '/groups/monkeys-admin-a8df79c4');
  });

  it('opens Posts first and keeps the group path hash-free', () => {
    render(<GroupCommunity group={organizerGroup} />);

    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((tab) => tab.textContent)).toEqual([
      'Posts',
      'Events',
      'About',
      'Members',
      'Join requests',
      'Invites',
    ]);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('posts-panel')).toBeTruthy();
    expect(window.location.hash).toBe('');
    expect(window.location.pathname).toBe('/groups/monkeys-admin-a8df79c4');
  });

  it('restores Events from the hash and writes it without query params', async () => {
    window.history.replaceState(
      null,
      '',
      '/groups/monkeys-admin-a8df79c4#events'
    );

    render(<GroupCommunity group={organizerGroup} />);

    const tabs = within(
      screen.getByRole('tablist', { name: 'Group community' })
    ).getByRole('tab', { name: 'Events' });
    expect(tabs.getAttribute('aria-selected')).toBe('true');

    await userEvent.click(
      within(screen.getByRole('tablist', { name: 'Group community' })).getByRole(
        'tab',
        { name: 'About' }
      )
    );
    expect(window.location.hash).toBe('#about');
    expect(window.location.search).toBe('');

    await userEvent.click(
      within(screen.getByRole('tablist', { name: 'Group community' })).getByRole(
        'tab',
        { name: 'Posts' }
      )
    );
    expect(window.location.hash).toBe('');
    expect(window.location.pathname).toBe('/groups/monkeys-admin-a8df79c4');
  });

  it('asks logged-out visitors to log in when the events list is empty', () => {
    authMock.mockReturnValue({ data: null });
    window.history.replaceState(
      null,
      '',
      '/groups/monkeys-admin-a8df79c4#events'
    );

    render(
      <GroupCommunity
        group={{
          ...organizerGroup,
          viewer_role: 'viewer',
          viewer_member_status: '',
        }}
      />
    );

    expect(
      screen.getByText('Log in and join this group to see events.')
    ).toBeTruthy();
  });
});
