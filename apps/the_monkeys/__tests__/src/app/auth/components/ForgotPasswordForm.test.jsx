import ForgotPasswordForm from '@/app/auth/components/forms/ForgotPasswordForm';
import * as Services from '@/services/auth/auth';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../../utils';

const { routerPush } = vi.hoisted(() => ({ routerPush: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPush }),
}));

async function submitEmail(email) {
  const user = userEvent.setup();
  await user.type(screen.getByPlaceholderText('Enter email address'), email);
  await user.click(
    screen.getByRole('button', { name: 'Send Verification Code' })
  );
}

describe('ForgotPasswordForm', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    routerPush.mockReset();
  });

  it('shows an invalid email error before requesting a verification code', async () => {
    renderWithProviders(<ForgotPasswordForm />);

    await submitEmail('johndoe@example');

    expect(await screen.findByText('Invalid email')).toBeDefined();
  });

  it('requires an email before requesting a verification code', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ForgotPasswordForm />);

    await user.click(
      screen.getByRole('button', { name: 'Send Verification Code' })
    );

    expect(await screen.findByText('Email is required')).toBeDefined();
  });

  it('shows the clear control only for a populated email and clears it', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ForgotPasswordForm />);

    expect(
      screen.queryByRole('button', { name: 'clear button' })
    ).toBeNull();

    const emailInput = screen.getByPlaceholderText('Enter email address');
    await user.type(emailInput, 'john@example.com');
    await user.click(screen.getByRole('button', { name: 'clear button' }));

    expect(emailInput.value).toBe('');
    expect(
      screen.queryByRole('button', { name: 'clear button' })
    ).toBeNull();
  });

  it('requests a code and advances to OTP verification', async () => {
    const requestSpy = vi
      .spyOn(Services, 'forgotPass')
      .mockResolvedValue({ status: 200 });
    renderWithProviders(<ForgotPasswordForm />);

    await submitEmail('john@doe.com');

    expect(
      await screen.findByRole('textbox', { name: 'Verification Code' })
    ).toBeDefined();
    expect(requestSpy).toHaveBeenCalledWith({ email: 'john@doe.com' });
    expect(
      screen.getByText((content) => content.includes('john@doe.com'))
    ).toBeDefined();
  });

  it('does not reveal whether an email exists when requesting a code fails', async () => {
    vi.spyOn(Services, 'forgotPass').mockRejectedValue(new Error('not found'));
    renderWithProviders(<ForgotPasswordForm />);

    await submitEmail('unknown@doe.com');

    expect(
      await screen.findByRole('textbox', { name: 'Verification Code' })
    ).toBeDefined();
    expect(
      screen.getByText((content) => content.includes('unknown@doe.com'))
    ).toBeDefined();
  });

  it('verifies a six digit code and opens the reset-password route', async () => {
    vi.spyOn(Services, 'forgotPass').mockResolvedValue({ status: 200 });
    const verifySpy = vi
      .spyOn(Services, 'verifyResetOTP')
      .mockResolvedValue({ token: 'reset token' });
    const user = userEvent.setup();
    renderWithProviders(<ForgotPasswordForm />);

    await submitEmail('john+test@doe.com');
    const codeInput = await screen.findByRole('textbox', {
      name: 'Verification Code',
    });
    await user.type(codeInput, '123456');

    await waitFor(() => {
      expect(verifySpy).toHaveBeenCalledWith({
        email: 'john+test@doe.com',
        otp_code: '123456',
      });
    });
    expect(routerPush).toHaveBeenCalledWith(
      '/auth/reset-password?token=reset%20token&email=john%2Btest%40doe.com'
    );
  });
});
