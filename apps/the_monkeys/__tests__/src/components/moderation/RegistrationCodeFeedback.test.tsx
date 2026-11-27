import React from 'react';

import RegisterUserForm from '@/app/auth/components/forms/RegisterUserForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { TooltipProvider } from '@the-monkeys/ui/atoms/tooltip';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const mock = vi.hoisted(() => ({
  initiate: vi.fn(),
  verify: vi.fn(),
  resend: vi.fn(),
  toast: vi.fn(),
  replace: vi.fn(),
  session: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mock.replace }),
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('@/services/auth/auth', () => ({
  initiateRegistration: mock.initiate,
  verifyRegistrationOTP: mock.verify,
  resendRegistrationOTP: mock.resend,
}));
vi.mock('@/lib/authQuerySession', () => ({ replaceAuthSession: mock.session }));
vi.mock('@the-monkeys/ui/hooks/use-toast', () => ({ toast: mock.toast }));

afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  mock.initiate.mockResolvedValue({ message: 'Code sent', expires_in: 600 });
});

async function submitCode(error: unknown) {
  mock.verify.mockRejectedValue(error);
  render(
    <QueryClientProvider client={new QueryClient()}>
      <TooltipProvider>
        <RegisterUserForm />
      </TooltipProvider>
    </QueryClientProvider>
  );
  fireEvent.change(screen.getByPlaceholderText('Enter first Name'), {
    target: { value: 'Local' },
  });
  fireEvent.change(screen.getByPlaceholderText('Enter email address'), {
    target: { value: 'local@example.invalid' },
  });
  fireEvent.change(screen.getByPlaceholderText('Enter password'), {
    target: { value: 'LocalTest9' },
  });
  fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
    target: { value: 'LocalTest9' },
  });
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(
    screen.getByRole('button', { name: 'Register', exact: true })
  );
  const otp = await screen.findByPlaceholderText('Enter 6-digit code');
  fireEvent.change(otp, { target: { value: '000000' } });
  await waitFor(() => expect(mock.verify).toHaveBeenCalled());
}

it('keeps registration inputs controlled through the verification step', async () => {
  const errors = vi.spyOn(console, 'error');
  try {
    await submitCode(new Error('Network Error'));
    await waitFor(() =>
      expect(mock.toast).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Verification failed' })
      )
    );
    expect(
      errors.mock.calls.filter((args) =>
        args.some(
          (value) =>
            typeof value === 'string' && value.includes('uncontrolled input')
        )
      )
    ).toHaveLength(0);
  } finally {
    errors.mockRestore();
  }
});

it.each([
  [400, 'invalid verification code'],
  [404, 'no pending registration found, please register again'],
  [429, 'too many failed attempts, please register again'],
])(
  'shows useful verification feedback from HTTP %s and stays on the code screen',
  async (status, message) => {
    const error = Object.assign(
      new Error('Request failed with status code ' + status),
      { isAxiosError: true, response: { status, data: { message } } }
    );
    await submitCode(error);
    await waitFor(() =>
      expect(mock.toast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'Verification failed',
        description: message,
      })
    );
    expect(screen.getByPlaceholderText('Enter 6-digit code')).toBeTruthy();
    expect(mock.session).not.toHaveBeenCalled();
    expect(mock.replace).not.toHaveBeenCalled();
  }
);

it.each([
  new Error('Network Error'),
  Object.assign(new Error('HTTP error'), {
    isAxiosError: true,
    response: { data: { message: { malformed: true } } },
  }),
])(
  'uses a readable fallback for an unavailable or malformed response',
  async (error) => {
    await submitCode(error);
    await waitFor(() =>
      expect(mock.toast).toHaveBeenCalledWith({
        variant: 'error',
        title: 'Verification failed',
        description: 'Unable to verify the code. Please try again.',
      })
    );
    expect(mock.session).not.toHaveBeenCalled();
  }
);
