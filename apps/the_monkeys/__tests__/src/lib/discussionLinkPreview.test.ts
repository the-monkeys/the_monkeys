import {
  blogPreview,
  discussionPreview,
  eventPreview,
  groupPreview,
  profilePreview,
} from '@/lib/discussionLinkPreview';
import type { Blog } from '@/services/blog/blogTypes';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import type { EventItem } from '@/services/events/eventTypes';
import type { GroupItem } from '@/services/groups/groupsTypes';
import type { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';
import { describe, expect, it } from 'vitest';

const blog = {
  blog_id: 'p44nn',
  blog: {
    time: 0,
    blocks: [
      { id: '1', type: 'header', data: { text: 'Go <b>tips</b>' } },
      { id: '2', type: 'paragraph', data: { text: 'Small habits that help.' } },
      {
        id: '3',
        type: 'image',
        data: { file: { url: 'https://cdn.example/a.png' } },
      },
    ],
  },
} as unknown as Blog;

const event = {
  id: 1,
  title: 'Go meetup',
  slug: 'go-meetup',
  event_type: 'in_person',
  status: 'published',
  description: 'Talks and pizza',
  cover_image: '/storage/events/go-meetup/cover',
  start_time: '2026-10-10T13:30:00Z',
  timezone: 'Asia/Kolkata',
} as EventItem;

const group = {
  name: 'Gophers',
  slug: 'gophers',
  description: 'Go people',
  visibility: 'public',
  status: 'published',
  logo_image: '/storage/groups/gophers/logo',
  member_count: 12,
} as GroupItem;

describe('blogPreview', () => {
  it('uses the title, description and first image', () => {
    expect(blogPreview(blog)).toEqual({
      label: 'Blog',
      title: 'Go tips',
      description: 'Small habits that help.',
      image: 'https://cdn.example/a.png',
    });
  });

  it('hides drafts and members-only posts', () => {
    expect(blogPreview({ ...blog, is_draft: true })).toBeNull();
    expect(blogPreview({ ...blog, audience: 'group_only' })).toBeNull();
    expect(blogPreview(undefined)).toBeNull();
  });
});

describe('eventPreview', () => {
  it('shows the title, date line and cover', () => {
    expect(eventPreview(event)).toEqual({
      label: 'Event',
      title: 'Go meetup',
      description: 'Sat, Oct 10 · 7:00 PM',
      image: '/storage/events/go-meetup/cover',
    });
  });

  it('hides drafts and non-public events', () => {
    expect(eventPreview({ ...event, status: 'draft' })).toBeNull();
    expect(eventPreview({ ...event, visibility: 'group_members' })).toBeNull();
    expect(eventPreview({ ...event, visibility: 'public' })).not.toBeNull();
  });
});

describe('groupPreview', () => {
  it('shows the name, member count and logo', () => {
    expect(groupPreview(group)).toEqual({
      label: 'Group',
      title: 'Gophers',
      description: '12 members · Go people',
      image: '/storage/groups/gophers/logo',
    });
  });

  it('hides private, unlisted and unpublished groups', () => {
    expect(groupPreview({ ...group, visibility: 'private' })).toBeNull();
    expect(groupPreview({ ...group, visibility: 'unlisted' })).toBeNull();
    expect(groupPreview({ ...group, status: 'suspended' })).toBeNull();
  });
});

describe('profilePreview', () => {
  it('shows the full name, handle and bio with an avatar', () => {
    const user = {
      username: 'chimp',
      first_name: 'Dave',
      last_name: 'K',
      bio: 'Builds things',
    } as GetPublicUserProfileApiResponse;
    expect(profilePreview(user)).toEqual({
      label: 'Profile',
      title: 'Dave K',
      description: '@chimp · Builds things',
      avatarUsername: 'chimp',
    });
  });

  it('falls back to the handle without a name', () => {
    const user = { username: 'chimp' } as GetPublicUserProfileApiResponse;
    expect(profilePreview(user)?.title).toBe('@chimp');
    expect(profilePreview(undefined)).toBeNull();
  });
});

describe('discussionPreview', () => {
  const post: Discussion = {
    public_id: 'd1',
    body: 'What is the best way to learn Go?',
    status: 'visible',
    author_username: 'chimp',
  };

  it('shows the author and the opening text', () => {
    expect(discussionPreview(post)).toEqual({
      label: 'Discussion',
      title: 'What is the best way to learn Go?',
      description: '@chimp',
      avatarUsername: 'chimp',
    });
  });

  it('hides removed and members-only group discussions', () => {
    expect(discussionPreview({ ...post, status: 'hidden' })).toBeNull();
    expect(
      discussionPreview({
        ...post,
        group_slug: 'gophers',
        audience: 'group_only',
      })
    ).toBeNull();
  });

  it('shows a public group discussion', () => {
    expect(
      discussionPreview({
        ...post,
        group_slug: 'gophers',
        audience: 'public',
      })?.title
    ).toBe('What is the best way to learn Go?');
  });
});
