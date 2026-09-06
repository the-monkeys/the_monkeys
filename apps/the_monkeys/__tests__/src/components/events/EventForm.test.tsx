import { EventForm } from '@/components/events/EventForm';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../utils';

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('uses radio controls for repeat and visibility cards, without ticket options', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  renderWithProviders(
    <EventForm submitLabel='Save draft' onSubmit={onSubmit} />
  );

  fireEvent.change(document.querySelector('[name="title"]')!, {
    target: { value: 'A future meetup' },
  });
  fireEvent.change(document.querySelector('[name="start"]')!, {
    target: { value: '2099-01-01T10:00' },
  });
  fireEvent.change(document.querySelector('[name="end"]')!, {
    target: { value: '2099-01-01T11:00' },
  });
  await user.click(screen.getByText('More event options'));
  expect(screen.queryByLabelText('Add a ticket')).toBeNull();

  await user.click(screen.getByRole('radio', { name: 'Weekly' }));
  await user.click(screen.getByRole('button', { name: /private/i }));
  await user.click(screen.getByRole('button', { name: 'Save draft' }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({
      visibility: 'private',
      recurrence: expect.objectContaining({ freq: 'weekly' }),
    }),
    undefined
  );
});
