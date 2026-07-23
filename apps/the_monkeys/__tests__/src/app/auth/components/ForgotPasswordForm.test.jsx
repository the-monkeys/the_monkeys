import ForgotPasswordForm from '@/app/auth/components/forms/ForgotPasswordForm';
import * as Services from '@/services/auth/auth';
import { cleanup, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../../utils';

let routerPushStub = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: routerPushStub,
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}));

describe('ForgotPasswordForm', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('Shows invalid email error on invalid email', async () => {
    renderWithProviders(<ForgotPasswordForm />);

    const submitButton = screen.getByRole('button', { name: /send verification code/i });
    const emailInput = screen.getByPlaceholderText('Enter email address');

    await userEvent.type(emailInput, 'johndoe@example');
    await userEvent.click(submitButton);

    const emailErrorMessage = await screen.findByText('Invalid email');
    expect(emailErrorMessage).toBeDefined();
  });

  it('Shows required error text on empty email submit', async () => {
    renderWithProviders(<ForgotPasswordForm />);

    const submitButton = screen.getByRole('button', { name: /send verification code/i });
    await userEvent.click(submitButton);

    const emailErrorMessage = await screen.findByText('Email is required');
    expect(emailErrorMessage).toBeDefined();
  });

  it('Clear button behavior', async () => {
    renderWithProviders(<ForgotPasswordForm />);
    const emailInput = screen.getByPlaceholderText('Enter email address');

    // Initially, no clear button
    let clearButton = screen.queryByRole('button', { name: 'clear button' });
    expect(clearButton).toBeNull();

    // Type email, clear button should appear
    await userEvent.type(emailInput, 'john@example.com');
    clearButton = screen.getByRole('button', { name: 'clear button' });
    expect(clearButton).toBeDefined();

    // Click clear button, email should be empty and clear button disappears
    await userEvent.click(clearButton);
    expect(emailInput.value).toBe('');
    expect(screen.queryByRole('button', { name: 'clear button' })).toBeNull();
  });

  it('Successful OTP flow: send email OTP, then verify OTP', async () => {
    const forgotPassSpy = vi
      .spyOn(Services, 'forgotPass')
      .mockResolvedValue({
        status: 200,
        data: { message: 'OTP sent successfully' },
      });

    const verifyOTPSpy = vi
      .spyOn(Services, 'verifyResetOTP')
      .mockResolvedValue({
        token: 'fake-reset-token',
      });

    renderWithProviders(<ForgotPasswordForm />);

    const emailInput = screen.getByPlaceholderText('Enter email address');
    const sendButton = screen.getByRole('button', { name: /send verification code/i });

    await userEvent.type(emailInput, 'john@doe.com');
    await userEvent.click(sendButton);

    expect(forgotPassSpy).toHaveBeenCalledWith({ email: 'john@doe.com' });

    // Wait for the step to transition to OTP verification
    const otpInstruction = await screen.findByText(/we sent a 6-digit verification code/i);
    expect(otpInstruction).toBeDefined();

    // Type the 6-digit OTP code
    const otpInput = screen.getByPlaceholderText('Enter 6-digit code');
    await userEvent.type(otpInput, '123456');

    // Submit the OTP form
    const verifyButton = screen.getByRole('button', { name: /verify code/i });
    await userEvent.click(verifyButton);

    expect(verifyOTPSpy).toHaveBeenCalledWith({
      email: 'john@doe.com',
      otp_code: '123456',
    });

    await waitFor(() => {
      expect(routerPushStub).toHaveBeenCalledWith(
        '/auth/reset-password?token=fake-reset-token&email=john%40doe.com'
      );
    });
  });

  it('Failure in OTP verification shows error toast', async () => {
    vi.spyOn(Services, 'forgotPass').mockResolvedValue({
      status: 200,
      data: { message: 'OTP sent successfully' },
    });

    const verifyOTPSpy = vi
      .spyOn(Services, 'verifyResetOTP')
      .mockRejectedValue(new Error('Invalid code'));

    renderWithProviders(<ForgotPasswordForm />);

    const emailInput = screen.getByPlaceholderText('Enter email address');
    const sendButton = screen.getByRole('button', { name: /send verification code/i });

    await userEvent.type(emailInput, 'john@doe.com');
    await userEvent.click(sendButton);

    const otpInput = await screen.findByPlaceholderText('Enter 6-digit code');
    await userEvent.type(otpInput, '123456');

    const verifyButton = screen.getByRole('button', { name: /verify code/i });
    await userEvent.click(verifyButton);

    expect(verifyOTPSpy).toHaveBeenCalled();

    // Verify error toast message is displayed
    const errorToastTitle = await screen.findByText('Invalid code');
    const errorToastDesc = await screen.findByText('Please check the code and try again');
    expect(errorToastTitle).toBeDefined();
    expect(errorToastDesc).toBeDefined();
  });

  it('Can go back to email step from OTP step', async () => {
    vi.spyOn(Services, 'forgotPass').mockResolvedValue({
      status: 200,
      data: { message: 'OTP sent successfully' },
    });

    renderWithProviders(<ForgotPasswordForm />);

    const emailInput = screen.getByPlaceholderText('Enter email address');
    const sendButton = screen.getByRole('button', { name: /send verification code/i });

    await userEvent.type(emailInput, 'john@doe.com');
    await userEvent.click(sendButton);

    // Wait for the OTP step
    const changeEmailButton = await screen.findByRole('button', { name: /change email/i });
    await userEvent.click(changeEmailButton);

    // Expect to be back on the email input step
    expect(screen.getByPlaceholderText('Enter email address')).toBeDefined();
  });

  it('Resend Code button cooldown behavior', async () => {
    vi.useFakeTimers();

    vi.spyOn(Services, 'forgotPass').mockResolvedValue({
      status: 200,
      data: { message: 'OTP sent successfully' },
    });

    renderWithProviders(<ForgotPasswordForm />);

    const emailInput = screen.getByPlaceholderText('Enter email address');
    const sendButton = screen.getByRole('button', { name: /send verification code/i });

    // Use fireEvent to avoid userEvent timer conflicts
    fireEvent.change(emailInput, { target: { value: 'john@doe.com' } });
    fireEvent.click(sendButton);

    // Flush the React Query mutation microtasks inside act
    await act(async () => {
      await Promise.resolve();
    });

    // Check if OTP step is rendered and button is "Resend in 30s"
    const resendButton = screen.getByRole('button', { name: /resend in 30s/i });
    expect(resendButton.disabled).toBe(true);

    // Wait 15 seconds (1 second at a time) to let React execute effects sequentially
    for (let i = 0; i < 15; i++) {
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    }
    expect(screen.getByRole('button', { name: /resend in 15s/i })).toBeDefined();

    // Wait another 15 seconds (total 30 seconds elapsed)
    for (let i = 0; i < 15; i++) {
      act(() => {
        vi.advanceTimersByTime(1000);
      });
    }
    const activeResendButton = screen.getByRole('button', { name: /resend code/i });
    expect(activeResendButton.disabled).toBe(false);
  });
});
