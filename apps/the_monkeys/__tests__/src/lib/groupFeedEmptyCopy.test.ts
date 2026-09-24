import { groupFeedEmptyCopy, isActiveGroupMember } from '@/lib/groupPerms';
import { describe, expect, it } from 'vitest';

describe('groupFeedEmptyCopy', () => {
  it('keeps the true-empty copy for members', () => {
    expect(
      groupFeedEmptyCopy({ kind: 'posts', member: true, signedIn: true })
    ).toBe('No posts have been published to this group yet.');
    expect(
      groupFeedEmptyCopy({
        kind: 'events',
        member: true,
        signedIn: true,
        when: 'upcoming',
      })
    ).toBe('No events scheduled yet.');
    expect(
      groupFeedEmptyCopy({
        kind: 'events',
        member: true,
        signedIn: true,
        when: 'past',
      })
    ).toBe('No past events yet.');
  });

  it('asks strangers to log in and join, and signed-in non-members to join', () => {
    expect(
      groupFeedEmptyCopy({ kind: 'posts', member: false, signedIn: false })
    ).toBe('Log in and join this group to see posts.');
    expect(
      groupFeedEmptyCopy({ kind: 'posts', member: false, signedIn: true })
    ).toBe('Join this group to see posts.');
    expect(
      groupFeedEmptyCopy({ kind: 'events', member: false, signedIn: false })
    ).toBe('Log in and join this group to see events.');
  });

  it('treats only active membership as a member', () => {
    expect(isActiveGroupMember({ viewer_member_status: 'active' } as never)).toBe(
      true
    );
    expect(
      isActiveGroupMember({ viewer_member_status: 'pending' } as never)
    ).toBe(false);
    expect(isActiveGroupMember({ visibility: 'public' } as never)).toBe(false);
  });
});
