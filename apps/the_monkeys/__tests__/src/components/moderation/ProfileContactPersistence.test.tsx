import React from 'react';

import { Profile } from '@/app/settings/components/Profile';
import { queryKeys } from '@/lib/queryKeys';
import { updateProfileSchema } from '@/lib/schema/settings';
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
  session: { account_id: 'owner', username: 'phone-owner' },
  rows: {} as Record<string, any>,
  get: vi.fn(),
  put: vi.fn(),
  toast: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: mock.session }),
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

function profile(
  account_id = 'owner',
  username = 'phone-owner',
  first_name = 'Local'
) {
  return {
    account_id,
    username,
    first_name,
    last_name: '',
    address: '',
    bio: '',
    date_of_birth: '',
    contact_number: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    github: '',
  };
}
function view(client: QueryClient) {
  return (
    <QueryClientProvider client={client}>
      <Profile data={{ ...mock.session, email: 'local@example.invalid' }} />
    </QueryClientProvider>
  );
}
function mount() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  return { ...render(view(client)), client };
}
async function loaded(name = 'Local') {
  await waitFor(() =>
    expect(
      (screen.getByLabelText('First Name') as HTMLInputElement).value
    ).toBe(name)
  );
}
afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  mock.session = { account_id: 'owner', username: 'phone-owner' };
  mock.rows = {
    'phone-owner': profile(),
    'other-owner': profile('other', 'other-owner', 'Other'),
  };
  mock.get.mockImplementation(async (url: string) => ({
    data: { ...mock.rows[url.split('/').pop()!] },
  }));
  mock.put.mockImplementation(async (url: string, body: any) => {
    const username = url.split('/').pop()!;
    mock.rows[username] = { ...mock.rows[username], ...body.values };
    return { data: { username } };
  });
  window.history.replaceState({}, '', '/settings');
});

describe('phone validation compatibility', () => {
  it.each([
    '12025550148',
    '0123456789',
    '+12025550148',
    '+442079460123',
    '+123456789012345',
  ])('preserves valid phone string %s', (contact_number) => {
    const parsed = updateProfileSchema.parse({
      first_name: 'Local',
      contact_number,
    });
    expect(parsed.contact_number).toBe(contact_number);
  });
  it.each([
    '+',
    '++12025550148',
    '1202+5550148',
    '+123456789',
    '+1234567890123456',
    '1202555abcd',
    '120 255 50148',
  ])('rejects invalid phone string %s', (contact_number) => {
    expect(
      updateProfileSchema.safeParse({ first_name: 'Local', contact_number })
        .success
    ).toBe(false);
  });
  it('keeps omitted and cleared phones compatible', () => {
    expect(updateProfileSchema.safeParse({ first_name: 'Local' }).success).toBe(
      true
    );
    expect(
      updateProfileSchema.parse({ first_name: 'Local', contact_number: '' })
        .contact_number
    ).toBe('');
  });
});

it('does not allow editing before the private profile has loaded', async () => {
  let deliver!: (value: any) => void;
  mock.get.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        deliver = resolve;
      })
  );
  mount();
  expect(screen.getByLabelText('Contact Number').matches(':disabled')).toBe(
    true
  );
  deliver({ data: profile() });
  await loaded();
  expect(screen.getByLabelText('Contact Number').matches(':disabled')).toBe(
    false
  );
});

it('retains an unsaved phone while a profile refresh updates untouched fields', async () => {
  const ui = mount();
  await loaded();
  fireEvent.change(screen.getByLabelText('Contact Number'), {
    target: { value: '12025550148' },
  });
  ui.client.setQueryData(
    queryKeys.profile.authenticated('phone-owner', 'owner'),
    { ...profile(), address: 'Updated city' }
  );
  await waitFor(() =>
    expect((screen.getByLabelText('Location') as HTMLInputElement).value).toBe(
      'Updated city'
    )
  );
  expect(
    (screen.getByLabelText('Contact Number') as HTMLInputElement).value
  ).toBe('12025550148');
});

it('saves an international phone exactly and displays it after a fresh mount', async () => {
  const ui = mount();
  await loaded();
  fireEvent.change(screen.getByLabelText('Contact Number'), {
    target: { value: '+12025550148' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
  await waitFor(() =>
    expect(mock.put).toHaveBeenCalledWith('/user/phone-owner', {
      values: expect.objectContaining({ contact_number: '+12025550148' }),
    })
  );
  await waitFor(() =>
    expect(mock.toast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'success' })
    )
  );
  ui.unmount();
  mount();
  await loaded();
  expect(
    (screen.getByLabelText('Contact Number') as HTMLInputElement).value
  ).toBe('+12025550148');
});

it('does not retain the previous account private form when the signed-in owner changes', async () => {
  const ui = mount();
  await loaded();
  fireEvent.change(screen.getByLabelText('Contact Number'), {
    target: { value: '12025550148' },
  });
  mock.session = { account_id: 'other', username: 'other-owner' };
  ui.rerender(view(ui.client));
  await loaded('Other');
  expect(
    (screen.getByLabelText('Contact Number') as HTMLInputElement).value
  ).toBe('');
});

it('shows a private-profile load failure and supports retry without submitting defaults', async () => {
  mock.get.mockRejectedValueOnce(new Error('Temporary outage'));
  mount();
  await screen.findByRole('alert');
  expect(mock.put).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  await loaded();
  expect(screen.getByLabelText('Contact Number').matches(':disabled')).toBe(
    false
  );
});

it('keeps the edited number available when saving fails', async () => {
  mock.put.mockRejectedValueOnce(new Error('Save unavailable'));
  mount();
  await loaded();
  fireEvent.change(screen.getByLabelText('Contact Number'), {
    target: { value: '+12025550148' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
  await waitFor(() =>
    expect(mock.toast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'error' })
    )
  );
  expect(
    (screen.getByLabelText('Contact Number') as HTMLInputElement).value
  ).toBe('+12025550148');
  expect(screen.getByLabelText('Contact Number').matches(':disabled')).toBe(
    false
  );
  expect(mock.rows['phone-owner'].contact_number).toBe('');
});

it('focuses the birthday after loading and does not steal focus on a later refresh', async () => {
  window.history.replaceState(
    {},
    '',
    '/settings?focus=birthday&returnTo=%2Fblog%2Ffixture'
  );
  const frame = vi
    .spyOn(window, 'requestAnimationFrame')
    .mockImplementation((callback) => {
      callback(0);
      return 1;
    });
  let deliver!: (value: any) => void;
  mock.get.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        deliver = resolve;
      })
  );
  try {
    const ui = mount();
    deliver({ data: profile() });
    await loaded();
    await waitFor(() =>
      expect(document.activeElement).toBe(screen.getByLabelText('Birth Date'))
    );
    screen.getByLabelText('Contact Number').focus();
    ui.client.setQueryData(
      queryKeys.profile.authenticated('phone-owner', 'owner'),
      { ...profile(), address: 'Refreshed city' }
    );
    await waitFor(() =>
      expect(
        (screen.getByLabelText('Location') as HTMLInputElement).value
      ).toBe('Refreshed city')
    );
    expect(document.activeElement).toBe(
      screen.getByLabelText('Contact Number')
    );
  } finally {
    frame.mockRestore();
  }
});
