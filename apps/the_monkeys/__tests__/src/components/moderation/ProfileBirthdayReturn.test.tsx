import React from 'react';

import { Profile } from '@/app/settings/components/Profile';
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
  put: vi.fn(),
  push: vi.fn(),
  toast: vi.fn(),
  profile: {
    first_name: 'Dave',
    last_name: '',
    address: '',
    bio: '',
    date_of_birth: '',
    contact_number: '' as string | undefined,
    twitter: '',
    linkedin: '',
    instagram: '',
    github: '',
  },
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mock.push }) }));
vi.mock('@/hooks/user/useGetAuthUserProfile', () => ({
  default: () => ({ data: mock.profile }),
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
vi.mock('@/services/api/axiosInstance', () => ({ default: { put: mock.put } }));
vi.mock('@the-monkeys/ui/hooks/use-toast', () => ({ toast: mock.toast }));

afterEach(() => cleanup());
beforeEach(() => {
  vi.clearAllMocks();
  mock.profile.date_of_birth = '';
  mock.put.mockResolvedValue({ data: { success: true } });
  window.history.replaceState(
    {},
    '',
    '/settings?focus=birthday&returnTo=%2Fdiscussions%2Fpost'
  );
});
function mount() {
  return render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <Profile
        data={{
          account_id: 'owner',
          username: 'dave',
          email: 'dave@fixture.test',
        }}
      />
    </QueryClientProvider>
  );
}
describe('birthday return flow', () => {
  it('saves the birthday through the existing profile API then returns to the content', async () => {
    mount();
    fireEvent.input(screen.getByLabelText('Birth Date'), {
      target: { value: '1990-01-01' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    await waitFor(() =>
      expect(mock.push).toHaveBeenCalledWith('/discussions/post')
    );
    expect(mock.put).toHaveBeenCalledWith(
      '/user/dave',
      expect.objectContaining({
        values: expect.objectContaining({
          date_of_birth: expect.stringContaining('1990-01-01'),
        }),
      })
    );
  });
  it('does not redirect ordinary profile saves', async () => {
    window.history.replaceState({}, '', '/settings');
    mock.profile.date_of_birth = '1990-01-01';
    mount();
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    await waitFor(() => expect(mock.put).toHaveBeenCalled());
    expect(mock.push).not.toHaveBeenCalled();
  });
  it('does not navigate to an external return address', async () => {
    window.history.replaceState(
      {},
      '',
      '/settings?returnTo=https%3A%2F%2Fevil.test'
    );
    mock.profile.date_of_birth = '1990-01-01';
    mount();
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    await waitFor(() => expect(mock.put).toHaveBeenCalled());
    expect(mock.push).not.toHaveBeenCalled();
  });
});
