import { CreateButton } from '@/components/buttons/createButton';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';

import { renderWithProviders } from '../../../utils';

afterEach(cleanup);

it('opens a keyboard-accessible menu containing post, event, and group creation links', async () => {
  const user = userEvent.setup();

  renderWithProviders(<CreateButton />);
  const trigger = screen.getByRole('button', { name: /create/i });

  await user.click(trigger);

  expect(screen.getByRole('menu')).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Create Post' }).getAttribute('href')).toBe(
    '/create'
  );
  expect(
    screen.getByRole('link', { name: 'Create Event' }).getAttribute('href')
  ).toBe('/events/new');
  expect(
    screen.getByRole('link', { name: 'Create Group' }).getAttribute('href')
  ).toBe('/groups/new');
});

it('closes the menu when Escape is pressed', async () => {
  const user = userEvent.setup();

  renderWithProviders(<CreateButton />);
  await user.click(screen.getByRole('button', { name: /create/i }));
  await user.keyboard('{Escape}');

  expect(screen.queryByRole('menu')).toBeNull();
});
