import LoginForm from '@/app/auth/components/forms/LoginForm';
import * as Services from '@/services/auth/auth';
import { User } from '@/services/models/user';
import { cleanup, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../../utils';

let routerReplaceStub = vi.fn();
let searchParamsGetStub = vi.fn();

describe('LoginForm', () => {
  beforeAll(() => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://monkeys.com/login');

    vi.mock('next/navigation', () => ({
      useRouter: () => ({
        replace: routerReplaceStub,
        pathname: '/auth/login',
      }),

      useSearchParams: () => ({
        get: searchParamsGetStub,
      }),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('Focuses on email on first render', async () => {
    renderWithProviders(<LoginForm />);

    const emailInput = await screen.findByPlaceholderText(
      'Enter email address'
    );

    expect(emailInput.matches(':focus')).toBeTruthy();
  });

  it('Typing on first render changes email input', async () => {
    renderWithProviders(<LoginForm />);

    const emailInput = await screen.findByPlaceholderText(
      'Enter email address'
    );

    await userEvent.keyboard('hello world');

    expect(emailInput.value).toBe('hello world');
  });

  it('Shows required error text on values', async () => {
    renderWithProviders(<LoginForm />);

    const submitButton = await screen.findByText('Login');
    await userEvent.click(submitButton);

    const emailErrorMessage = await screen.findByText('Email is required');
    const passwordErrorMessage = await screen.findByText(
      'Password is required'
    );

    expect(emailErrorMessage).toBeDefined();
    expect(passwordErrorMessage).toBeDefined();
  });

  it('Shows invalid email error on invalid email', async () => {
    renderWithProviders(<LoginForm />);

    const submitButton = await screen.findByText('Login');

    await userEvent.keyboard('johndoe@example');
    await userEvent.click(submitButton);

    const emailErrorMessage = await screen.findByText('Invalid email');

    expect(emailErrorMessage).toBeDefined();
  });

  it('Successful login', async () => {
    renderWithProviders(<LoginForm />);

    const submitButton = screen.getByText('Login');

    const spy = vi
      .spyOn(Services, 'login')
      .mockImplementation((values) => new User({}));

    await userEvent.keyboard('john@doe.com');
    await userEvent.tab();
    await userEvent.keyboard('John1spassword');
    await userEvent.click(submitButton);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({
      email: 'john@doe.com',
      password: 'John1spassword',
    });
    expect(routerReplaceStub).toHaveBeenCalled();
    expect(routerReplaceStub).toHaveBeenCalledWith('/');
  });

  it('Successful login - with callback url', async () => {
    const spy = vi
      .spyOn(Services, 'login')
      .mockImplementation((values) => new User({}));

    searchParamsGetStub.mockReturnValue('https://monkeys.com/');

    renderWithProviders(<LoginForm />);

    const submitButton = screen.getByText('Login');

    await userEvent.keyboard('john@doe.com');
    await userEvent.tab();
    await userEvent.keyboard('John1spassword');
    await userEvent.click(submitButton);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith({
      email: 'john@doe.com',
      password: 'John1spassword',
    });
    expect(routerReplaceStub).toHaveBeenCalled();
    expect(routerReplaceStub).toHaveBeenCalledWith('https://monkeys.com/');
  });

  it('Error login', async () => {
    renderWithProviders(<LoginForm />);
    const submitButton = screen.getByText('Login');

    const spy = vi.spyOn(Services, 'login').mockImplementation(() => {
      throw new Error('test error');
    });

    await userEvent.keyboard('john@doe.com');
    await userEvent.tab();
    await userEvent.keyboard('John1spassword');
    await userEvent.click(submitButton);

    expect(spy).toHaveBeenCalled();
    await waitFor(() => {
      screen.getByText('Login Error');
    });
  });
});
