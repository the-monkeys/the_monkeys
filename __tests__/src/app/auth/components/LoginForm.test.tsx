import LoginForm from '@/app/auth/components/LoginForm';
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

describe('LoginForm Snapshot', () => {
  beforeAll(() => {
    userEvent.setup();

    vi.mock('next/navigation', () => ({
      useRouter: () => ({
        replace: vi.fn(),
        pathname: '/auth/login',
      }),

      useSearchParams: () => ({
        get: vi.fn(),
      }),
    }));
  });

  afterEach(cleanup);

  it('Desktop', () => {
    global.innerWidth = 1280;

    const { asFragment } = render(<LoginForm />);

    expect(asFragment()).toMatchSnapshot();
  });
});

describe('LoginForm', () => {
  beforeAll(() => {
    userEvent.setup();

    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://monkeys.com/login');

    vi.mock('next/navigation', () => ({
      useRouter: () => ({
        replace: vi.fn(),
        pathname: '/auth/login',
      }),

      useSearchParams: () => ({
        get: vi.fn(),
      }),
    }));
  });

  afterEach(() => {
    cleanup();
  });

  it('Focuses on email on first render', async () => {
    render(<LoginForm />);

    const emailInput = await screen.findByPlaceholderText(
      'Enter email address'
    );

    expect(emailInput.matches(':focus')).toBeTruthy();
  });

  it('Typing on first render changes email input', async () => {
    render(<LoginForm />);

    const emailInput = (await screen.findByPlaceholderText(
      'Enter email address'
    )) as HTMLInputElement;

    await userEvent.keyboard('hello world');

    expect(emailInput.value).toBe('hello world');
  });

  it('Shows required error text on values', async () => {
    render(<LoginForm />);

    const submitButton = await screen.findByText('Login');
    userEvent.click(submitButton);

    const emailErrorMessage = await screen.findByText('Email is required');
    const passwordErrorMessage = await screen.findByText(
      'Password is required'
    );

    expect(emailErrorMessage).toBeDefined();
    expect(passwordErrorMessage).toBeDefined();
  });

  it('Shows invalid email error on invalid email', async () => {
    render(<LoginForm />);
    const submitButton = await screen.findByText('Login');

    userEvent.keyboard('johndoe@example');
    userEvent.click(submitButton);

    const emailErrorMessage = await screen.findByText('Invalid email');

    expect(emailErrorMessage).toBeDefined();
  });
});
