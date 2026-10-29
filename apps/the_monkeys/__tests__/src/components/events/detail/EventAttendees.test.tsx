import { EventAttendees } from '@/components/events/detail/EventAttendees';
import { useEventAttendees } from '@/hooks/events/useEventQueries';
import useGetProfileInfoById from '@/hooks/user/useGetProfileInfoByUserId';
import useUser from '@/hooks/user/useUser';
import { Attendee, EventItem } from '@/services/events/eventTypes';
import {
  GetProfileInfoByIdResponse,
  GetPublicUserProfileApiResponse,
} from '@/services/profile/userApiTypes';
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/events/useEventQueries', () => ({
  useEventAttendees: vi.fn(),
}));
vi.mock('@/hooks/user/useUser', () => ({ default: vi.fn() }));
vi.mock('@/hooks/user/useGetProfileInfoByUserId', () => ({ default: vi.fn() }));
vi.mock('@/hooks/profile/useProfileImage', () => ({
  default: () => ({ imageUrl: '', isLoading: false, isError: false }),
}));

const event: EventItem = {
  id: 1,
  slug: 'attendee-layout-regression',
  title: 'Local attendee test',
  status: 'published',
  event_type: 'virtual',
  organizer_username: 'alex',
  organizer_account_id: 'account-alex',
  attendee_count: 24,
};
const opaqueUsername = '4aa4d76266c1fa03186b3015b13e543b';
const publicProfiles = new Map<string, GetPublicUserProfileApiResponse>();
const accountProfiles = new Map<string, GetProfileInfoByIdResponse>();
let attendees: Attendee[];
let rosterTotal: number | undefined;

function publicProfile(
  username: string,
  firstName: string,
  lastName = '',
  isVerified?: boolean
): GetPublicUserProfileApiResponse {
  return {
    username,
    first_name: firstName,
    last_name: lastName,
    is_verified: isVerified,
    bio: '',
    address: '',
    twitter: '',
    github: '',
    linkedin: '',
    instagram: '',
    created_at: { seconds: 0, nanos: 0 },
  };
}

beforeEach(() => {
  publicProfiles.clear();
  accountProfiles.clear();
  rosterTotal = undefined;
  attendees = [
    {
      id: 1,
      account_id: 'account-alex',
      user_name: 'alex',
      status: 'confirmed',
    },
    { id: 2, account_id: 'account-sam', user_name: 'sam', status: 'confirmed' },
  ];
  vi.mocked(useEventAttendees).mockImplementation(
    () =>
      ({
        data: { attendees, total: rosterTotal ?? attendees.length },
        isLoading: false,
        isError: false,
      }) as ReturnType<typeof useEventAttendees>
  );
  vi.mocked(useUser).mockImplementation((username) => ({
    user: username ? publicProfiles.get(username) : undefined,
    isLoading: false,
    isError: null,
    mutate: vi.fn(),
  }));
  vi.mocked(useGetProfileInfoById).mockImplementation((accountId) => ({
    user: accountId ? accountProfiles.get(accountId) : undefined,
    isLoading: false,
    isError: false,
  }));
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('EventAttendees identities', () => {
  it('shows public display names and a badge only for a verified account', () => {
    publicProfiles.set('alex', publicProfile('alex', 'Alex', 'Rivera', true));
    publicProfiles.set('sam', publicProfile('sam', 'Sam', 'Taylor', false));
    render(<EventAttendees event={event} canManage />);
    const alex = screen.getByRole('link', { name: /Alex Rivera/ });
    const sam = screen.getByRole('link', { name: /Sam Taylor/ });
    expect(alex.getAttribute('href')).toBe('/alex');
    expect(within(alex).getByTitle('Verified account')).toBeTruthy();
    expect(within(sam).queryByTitle('Verified account')).toBeNull();
    expect(screen.getByText('Host')).toBeTruthy();
    expect(screen.queryByText('@alex')).toBeNull();
  });

  it('does not invent verification when older public profiles omit it', () => {
    publicProfiles.set('alex', publicProfile('alex', 'Alex', 'Rivera'));
    render(<EventAttendees event={event} canManage />);
    expect(screen.getByText('Alex Rivera')).toBeTruthy();
    expect(screen.queryByTitle('Verified account')).toBeNull();
  });

  it('shows the display name of a public profile with a generated username', () => {
    attendees = [
      {
        id: 3,
        user_name: opaqueUsername,
        account_id: 'account-jamie',
        status: 'confirmed',
      },
    ];
    publicProfiles.set(
      opaqueUsername,
      publicProfile(opaqueUsername, 'Jamie', 'Chen', true)
    );
    render(<EventAttendees event={event} canManage />);
    const jamie = screen.getByRole('link', { name: /Jamie Chen/ });
    expect(jamie.getAttribute('href')).toBe(`/${opaqueUsername}`);
    expect(within(jamie).getByTitle('Verified account')).toBeTruthy();
    expect(screen.queryByText(`@${opaqueUsername}`)).toBeNull();
  });

  it('uses the account profile if an attendee has no usable username profile', () => {
    attendees = [{ id: 4, account_id: 'account-chloe', status: 'confirmed' }];
    accountProfiles.set('account-chloe', {
      user: {
        account_id: 'account-chloe',
        username: 'chloe',
        first_name: 'Chloe',
        last_name: 'Martin',
        bio: '',
        location: '',
        created_at: { seconds: 0, nanos: 0 },
        is_verified: true,
      },
      followers: 0,
      following: 0,
    });
    render(<EventAttendees event={event} canManage />);
    const chloe = screen.getByRole('link', { name: /Chloe Martin/ });
    expect(chloe.getAttribute('href')).toBe('/chloe');
    expect(within(chloe).getByTitle('Verified account')).toBeTruthy();
  });

  it('falls back to a readable username without claiming verification', () => {
    render(<EventAttendees event={event} canManage />);
    expect(
      screen.getByRole('link', { name: '@sam' }).getAttribute('href')
    ).toBe('/sam');
    expect(screen.queryByTitle('Verified account')).toBeNull();
  });

  it.each([
    { first_name: undefined, last_name: undefined },
    { first_name: null, last_name: null },
    { first_name: '   ', last_name: '' },
  ])(
    'uses the username when profile names are absent or blank: %j',
    (names) => {
      publicProfiles.set('alex', {
        ...publicProfile('alex', '', '', true),
        ...names,
      } as GetPublicUserProfileApiResponse);
      render(<EventAttendees event={event} canManage />);
      const alex = screen.getByRole('link', {
        name: '@alex, verified account',
      });
      expect(alex.getAttribute('title')).toBe('@alex');
      expect(within(alex).getByTitle('Verified account')).toBeTruthy();
      expect(screen.queryByText(/undefined|null/)).toBeNull();
    }
  );

  it.each([
    { first_name: ' Alex ', last_name: undefined, expected: 'Alex' },
    { first_name: undefined, last_name: ' Rivera ', expected: 'Rivera' },
  ])(
    'shows the available part of the name: $expected',
    ({ expected, ...names }) => {
      publicProfiles.set('alex', {
        ...publicProfile('alex', '', ''),
        ...names,
      } as GetPublicUserProfileApiResponse);
      render(<EventAttendees event={event} canManage />);
      expect(
        screen.getByRole('link', { name: expected }).getAttribute('title')
      ).toBe(expected);
      expect(screen.queryByText(/undefined|null/)).toBeNull();
    }
  );

  it('does not display an opaque identifier when its public profile is unavailable', () => {
    attendees = [
      {
        id: 5,
        account_id: 'missing-account',
        user_name: opaqueUsername,
        status: 'confirmed',
      },
    ];
    render(<EventAttendees event={event} canManage />);
    expect(screen.getByText('Attendee')).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'Attendee' }).getAttribute('href')
    ).toBe(`/${opaqueUsername}`);
    expect(screen.getByRole('img', { name: 'Attendee' })).toBeTruthy();
    expect(screen.queryByText(`@${opaqueUsername}`)).toBeNull();
    expect(screen.queryByRole('link', { name: /4aa4d762/ })).toBeNull();
  });

  it('retains the complete accessible name when a name is too long to fit visually', () => {
    publicProfiles.set(
      'alex',
      publicProfile(
        'alex',
        'AlexandriaCassandraAnastasia',
        'MontgomeryWorthington',
        true
      )
    );
    render(<EventAttendees event={event} canManage />);
    const name = 'AlexandriaCassandraAnastasia MontgomeryWorthington';
    const alex = screen.getByRole('link', { name: new RegExp(name) });
    expect(alex.getAttribute('title')).toBe(name);
    expect(within(alex).getByTitle('Verified account')).toBeTruthy();
  });

  it('never reveals a cached host-only list to a viewer without manage access', () => {
    publicProfiles.set('alex', publicProfile('alex', 'Alex', 'Rivera', true));
    render(<EventAttendees event={event} canManage={false} />);
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.getByText('24 people are attending.')).toBeTruthy();
    expect(screen.queryByText(/Alex Rivera|@alex/)).toBeNull();
  });

  it('caps a thousand-person roster at 18 and links hosts to the full roster', () => {
    attendees = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      user_name: `member${i}`,
      status: 'confirmed',
    }));
    attendees.push({
      id: 90,
      user_name: 'cancelled-person',
      status: 'cancelled',
    });
    attendees.push({
      id: 91,
      user_name: 'waitlisted-person',
      status: 'waitlisted',
    });
    rosterTotal = 1000;
    render(<EventAttendees event={event} canManage />);
    expect(screen.getAllByRole('listitem')).toHaveLength(18);
    expect(screen.getByText('1,000 attending')).toBeTruthy();
    expect(screen.getByText('Showing 18 of 1,000 attendees')).toBeTruthy();
    expect(
      screen
        .getByRole('link', { name: 'View all attendees' })
        .getAttribute('href')
    ).toBe('/events/attendee-layout-regression/manage#manage-attendees');
    expect(vi.mocked(useUser)).toHaveBeenCalledTimes(18);
    expect(vi.mocked(useEventAttendees)).toHaveBeenCalledWith(
      event.slug,
      true,
      {
        limit: 18,
        offset: 0,
        status: 'confirmed',
      }
    );
    expect(screen.queryByText('@cancelled-person')).toBeNull();
    expect(screen.queryByText('@waitlisted-person')).toBeNull();
  });
});
