import AppError from '@/app/error';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('AppError', () => {
  it('lets a user retry after an unexpected route failure', () => {
    const reset = vi.fn();

    render(<AppError error={new Error('render failed')} reset={reset} />);

    expect(
      screen.getByRole('heading', { name: 'This page could not be loaded' })
    ).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(reset).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole('link', { name: 'Go to home' }).getAttribute('href')
    ).toBe('/');
  });
});
