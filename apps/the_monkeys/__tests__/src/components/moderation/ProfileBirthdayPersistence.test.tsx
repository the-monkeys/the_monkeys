import React from 'react';

import { Profile } from '@/app/settings/components/Profile';
import { ContentGate } from '@/components/moderation/ContentGate';
import { queryKeys } from '@/lib/queryKeys';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mock = vi.hoisted(() => ({
  get: vi.fn(),
  put: vi.fn(),
  push: vi.fn(),
  toast: vi.fn(),
  birthday: '',
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mock.push, refresh: vi.fn() }),
  usePathname: () => '/settings',
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({
    data: { account_id: 'owner', username: 'birthday-fixture' },
  }),
}));
vi.mock('@/hooks/profile/useProfileImage', () => ({
  default: () => ({ imageUrl: '' }),
}));
vi.mock('@/components/profileImage', () => ({
  default: () => null,
  ProfileFrame: ({ children }: any) => <div>{children}</div>,
}));
vi.mock('@/components/user/dialogs/deleteProfileDialog', () => ({
  DeleteProfileDialog: () => null,
}));
vi.mock('@/components/user/dialogs/updateProfileDialog', () => ({
  UpdateProfileDialog: () => null,
}));
vi.mock('@/services/api/axiosInstance', () => ({
  default: { get: mock.get, put: mock.put },
}));
vi.mock('@the-monkeys/ui/hooks/use-toast', () => ({ toast: mock.toast }));
vi.mock('@/services/moderation/moderationApi', () => ({
  getContentAccess: vi.fn(async () =>
    mock.birthday.startsWith('1990-')
      ? { is_nsfw: true, can_reveal: true, reason: 'reveal_required' }
      : { is_nsfw: true, can_reveal: false, reason: 'dob_required' }
  ),
  revealContent: vi.fn(),
}));

const profile = () => ({
  account_id: 'owner',
  username: 'birthday-fixture',
  first_name: 'Local',
  last_name: '',
  address: '',
  bio: '',
  date_of_birth: mock.birthday,
  contact_number: '',
  twitter: '',
  linkedin: '',
  instagram: '',
  github: '',
});
const key = queryKeys.profile.authenticated('birthday-fixture', 'owner');
afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  mock.birthday = '0001-01-01 00:00:00 +0000 UTC';
  mock.get.mockImplementation(async () => ({ data: profile() }));
  mock.put.mockImplementation(async (_path, body) => {
    mock.birthday = body.values.date_of_birth + ' 00:00:00 +0000 UTC';
    return { data: { username: 'birthday-fixture' } };
  });
  window.history.replaceState({}, '', '/settings');
});
function mount(
  client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  })
) {
  const ui = render(
    <QueryClientProvider client={client}>
      <Profile
        data={{
          account_id: 'owner',
          username: 'birthday-fixture',
          email: 'local@example.invalid',
        }}
      />
    </QueryClientProvider>
  );
  return { ...ui, client };
}
async function loaded() {
  await waitFor(() =>
    expect(
      (screen.getByLabelText('First Name') as HTMLInputElement).value
    ).toBe('Local')
  );
}

describe('private birthday persistence', () => {
  it('shows the legacy missing-birthday sentinel as empty', async () => {
    mount();
    await loaded();
    expect(
      (screen.getByLabelText('Birth Date') as HTMLInputElement).value
    ).toBe('');
  });
  it('accepts a written birthday and refreshes the private profile before reopening settings', async () => {
    const ui = mount();
    await loaded();
    const input = screen.getByLabelText('Birth Date') as HTMLInputElement;
    expect(input.readOnly).toBe(false);
    fireEvent.change(input, { target: { value: '15 JUN 1990' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    await waitFor(() =>
      expect(mock.put).toHaveBeenCalledWith(
        '/user/birthday-fixture',
        expect.objectContaining({
          values: expect.objectContaining({ date_of_birth: '1990-06-15' }),
        })
      )
    );
    await waitFor(() =>
      expect(ui.client.getQueryData<any>(key)?.date_of_birth).toBe(
        '1990-06-15 00:00:00 +0000 UTC'
      )
    );
    ui.unmount();
    mount(ui.client);
    await loaded();
    expect(
      (screen.getByLabelText('Birth Date') as HTMLInputElement).value
    ).toBe('15 JUN 1990');
  });
  it.each([
    '1990-06-15 00:00:00 +0000 UTC',
    '1990-06-15',
    '1990-06-15T00:00:00+14:00',
  ])(
    'round-trips a saved birthday without changing its calendar day: %s',
    async (birthday) => {
      mock.birthday = birthday;
      mount();
      await loaded();
      expect(
        (screen.getByLabelText('Birth Date') as HTMLInputElement).value
      ).toBe('15 JUN 1990');
      fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
      await waitFor(() =>
        expect(mock.put).toHaveBeenCalledWith(
          '/user/birthday-fixture',
          expect.objectContaining({
            values: expect.objectContaining({ date_of_birth: '1990-06-15' }),
          })
        )
      );
    }
  );
  it('does not report completion or return to sensitive content without a birthday', async () => {
    window.history.replaceState(
      {},
      '',
      '/settings?focus=birthday&returnTo=%2Fblog%2Ffixture'
    );
    mount();
    await loaded();
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    await screen.findByText(
      'Add your birthday before returning to the content.'
    );
    expect(mock.put).not.toHaveBeenCalled();
    expect(mock.push).not.toHaveBeenCalled();
  });
});

it('uses one calendar and displays a saved birthday as DD MMM YYYY', async () => {
  mock.birthday = '1997-01-28 00:00:00 +0000 UTC';
  mount();
  await loaded();
  expect((screen.getByLabelText('Birth Date') as HTMLInputElement).value).toBe(
    '28 JAN 1997'
  );
  expect((screen.getByLabelText('Birth Date') as HTMLInputElement).type).toBe(
    'text'
  );
  expect(document.querySelectorAll('input[type="date"]')).toHaveLength(0);
  fireEvent.click(screen.getByRole('button', { name: 'Choose birth date' }));
  expect(screen.getAllByRole('grid')).toHaveLength(1);
  fireEvent.click(
    screen.getByRole('button', { name: /Wednesday, January 29th, 1997/ })
  );
  expect((screen.getByLabelText('Birth Date') as HTMLInputElement).value).toBe(
    '29 JAN 1997'
  );
  expect(screen.queryByRole('grid')).toBeNull();
});
it.each(['31 FEB 1997', '28 XYZ 1997', '01 JAN 2999', '31 DEC 1899'])(
  'rejects invalid or out-of-range written birthday %s before saving',
  async (value) => {
    mount();
    await loaded();
    fireEvent.change(screen.getByLabelText('Birth Date'), {
      target: { value },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    await screen.findByText('Enter a valid birth date, such as 28 JAN 1997.');
    expect(mock.put).not.toHaveBeenCalled();
  }
);
it('refreshes an already-mounted age gate after a successful birthday save', async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  render(
    <QueryClientProvider client={client}>
      <Profile
        data={{
          account_id: 'owner',
          username: 'birthday-fixture',
          email: 'local@example.invalid',
        }}
      />
      <ContentGate
        target={{ kind: 'blog', id: 'fixture' }}
        content={{
          is_nsfw: true,
          content_rating: { is_nsfw: true, revision: 1 },
        }}
      >
        <p>secret body</p>
      </ContentGate>
    </QueryClientProvider>
  );
  await loaded();
  await screen.findByRole('link', { name: 'Add your birthday' });
  fireEvent.input(screen.getByLabelText('Birth Date'), {
    target: { value: '1990-06-15' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
  await screen.findByRole('button', { name: 'Show content' });
  expect(screen.queryByRole('link', { name: 'Add your birthday' })).toBeNull();
  expect(screen.queryByText('secret body')).toBeNull();
});
