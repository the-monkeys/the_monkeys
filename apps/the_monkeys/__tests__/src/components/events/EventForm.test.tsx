import { EventForm } from '@/components/events/EventForm';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../utils';

afterEach(() => {
  vi.restoreAllMocks();
});

it('does not render a paid ticket price field and submits a free optional tier', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  renderWithProviders(
    <EventForm submitLabel='Save draft' onSubmit={onSubmit} />
  );

  expect(screen.queryByPlaceholderText('Price (0 = free)')).toBeNull();

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
  await user.click(screen.getByLabelText('Add a ticket'));
  expect(screen.queryByPlaceholderText('Price (0 = free)')).toBeNull();
  await user.click(screen.getByRole('button', { name: 'Save draft' }));

  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({
      ticket_tiers: [expect.objectContaining({ price: 0 })],
    }),
    undefined
  );
});
