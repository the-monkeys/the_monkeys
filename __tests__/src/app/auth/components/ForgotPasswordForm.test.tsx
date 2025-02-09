import ForgotPasswordForm from '@/app/auth/(protected)/components/ForgotPasswordForm';
import * as Services from '@/services/auth/auth';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('ForgotPasswordForm', () => {
  afterEach(() => {
    cleanup();
  });

  it('Shows invalid email error on invalid email', async () => {
    render(<ForgotPasswordForm />);

    const submitButton = screen.getByRole('button');
    const emailInput = screen.getByRole('textbox');

    await userEvent.click(emailInput);
    await userEvent.keyboard('johndoe@example');
    await userEvent.click(submitButton);

    const emailErrorMessage = await screen.findByText('Invalid email');

    expect(emailErrorMessage).toBeDefined();
  });

  it('Shows required error text on values', async () => {
    render(<ForgotPasswordForm />);

    const submitButton = screen.getByRole('button');
    await userEvent.click(submitButton);

    const emailErrorMessage = await screen.findByText('Email is required');

    expect(emailErrorMessage).toBeDefined();
  });

  it('Clear button is hidden when field is empty', async () => {
    render(<ForgotPasswordForm />);
    const clearButton = screen.queryByRole('button', { name: 'clear button' });

    expect(clearButton).toBeNull();
  });

  it('Clear button is visible when field is empty', async () => {
    render(<ForgotPasswordForm />);
    const emailInput = screen.getByRole('textbox');

    await userEvent.type(emailInput, 'john@example.com');

    screen.getByRole('button', { name: 'clear button' });
  });

  it('Clear button clears the email field', async () => {
    render(<ForgotPasswordForm />);
    const emailInput = screen.getByRole('textbox');

    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'clear button' }));

    expect(emailInput.textContent).toBe('');
    expect(emailInput.value).toBe('');
  });

  it('Successful submit', async () => {
    const spy = vi
      .spyOn(Services, 'forgotPass')
      // @ts-ignore
      .mockImplementation((values) => ({
        status: 200,
        data: {
          message: 'rest link is sent to your registered email',
        },
      }));

    render(<ForgotPasswordForm />);

    const submitButton = screen.getByRole('button');
    const emailInput = screen.getByRole('textbox');

    await userEvent.click(emailInput);
    await userEvent.keyboard('john@doe.com');
    await userEvent.click(submitButton);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({
      email: 'john@doe.com',
    });

    expect(submitButton.textContent).toBe('Submitted Successfully');
    expect(submitButton.disabled).toBe(true);
  });

  it('Clicking clear button after successful submit - resets form and button', async () => {
    const spy = vi
      .spyOn(Services, 'forgotPass')
      // @ts-ignore
      .mockImplementation((values) => ({
        status: 200,
        data: {
          message: 'rest link is sent to your registered email',
        },
      }));

    render(<ForgotPasswordForm />);

    const submitButton = screen.getByRole('button');
    const emailInput = screen.getByRole('textbox');

    await userEvent.click(emailInput);
    await userEvent.keyboard('john@doe.com');
    await userEvent.click(submitButton);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({
      email: 'john@doe.com',
    });

    expect(submitButton.textContent).toBe('Submitted Successfully');
    expect(submitButton.disabled).toBe(true);

    const clearButton = screen.getByRole('button', { name: 'clear button' });

    await userEvent.click(clearButton);

    expect(emailInput.value).toBe('');
    expect(submitButton.textContent).toBe('Submit');
    expect(submitButton.disabled).toBe(false);
  });

  it('Error submit', async () => {
    render(<ForgotPasswordForm />);

    const submitButton = screen.getByRole('button');
    const emailInput = screen.getByRole('textbox');

    const spy = vi.spyOn(Services, 'forgotPass').mockImplementation(() => {
      throw new Error('test error');
    });

    await userEvent.click(emailInput);
    await userEvent.keyboard('john@doe.com');
    await userEvent.click(submitButton);

    const errorMessage = await screen.findByText(
      'An unexpected error occurred while submitting the form, please retry again or contact support'
    );

    expect(spy).toThrowError('test error');
    expect(errorMessage).not.toBeNull();
    expect(submitButton.textContent).toBe('Click to retry');
    expect(submitButton.disabled).toBe(false);
  });

  it('Clicking clear button after error', async () => {
    render(<ForgotPasswordForm />);

    const submitButton = screen.getByRole('button');
    const emailInput = screen.getByRole('textbox');

    const spy = vi.spyOn(Services, 'forgotPass').mockImplementation(() => {
      throw new Error('test error');
    });

    await userEvent.click(emailInput);
    await userEvent.keyboard('john@doe.com');
    await userEvent.click(submitButton);

    const errorMessage = await screen.findByText(
      'An unexpected error occurred while submitting the form, please retry again or contact support'
    );

    expect(spy).toThrowError('test error');
    expect(errorMessage).not.toBeNull();
    expect(submitButton.textContent).toBe('Click to retry');
    expect(submitButton.disabled).toBe(false);

    const clearButton = screen.getByRole('button', { name: 'clear button' });

    await userEvent.click(clearButton);

    expect(emailInput.value).toBe('');
    expect(submitButton.textContent).toBe('Submit');
    expect(submitButton.disabled).toBe(false);
  });
});
