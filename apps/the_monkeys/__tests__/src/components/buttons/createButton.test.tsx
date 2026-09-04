import { CreateButton } from '@/components/buttons/createButton';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';

import { renderWithProviders } from '../../../utils';

afterEach(cleanup);

it('opens a menu containing post, event, and group creation menu items', async () => {
  const user = userEvent.setup();

  renderWithProviders(<CreateButton />);
  const trigger = screen.getByRole('button', { name: /create/i });

  await user.click(trigger);

  expect(screen.getByRole('menu')).toBeTruthy();
  expect(
    screen.getByRole('menuitem', { name: 'Create Post' }).getAttribute('href')
  ).toBe('/create');
  expect(
    screen.getByRole('menuitem', { name: 'Create Event' }).getAttribute('href')
  ).toBe('/events/new');
  expect(
    screen.getByRole('menuitem', { name: 'Create Group' }).getAttribute('href')
  ).toBe('/groups/new');
});

it('opens from the keyboard and moves focus through menu items with arrow keys', async () => {
  const user = userEvent.setup();

  renderWithProviders(<CreateButton />);
  await user.tab();
  await user.keyboard('{Enter}');

  const postItem = screen.getByRole('menuitem', { name: 'Create Post' });
  const eventItem = screen.getByRole('menuitem', { name: 'Create Event' });
  const groupItem = screen.getByRole('menuitem', { name: 'Create Group' });

  expect(document.activeElement).toBe(postItem);
  await user.keyboard('{ArrowDown}');
  expect(document.activeElement).toBe(eventItem);
  await user.keyboard('{ArrowDown}');
  expect(document.activeElement).toBe(groupItem);
  await user.keyboard('{ArrowUp}');
  expect(document.activeElement).toBe(eventItem);
});

it('closes on Escape and restores focus to the Create trigger', async () => {
  const user = userEvent.setup();

  renderWithProviders(<CreateButton />);
  const trigger = screen.getByRole('button', { name: /create/i });
  await user.click(trigger);
  await user.keyboard('{ArrowDown}');
  await user.keyboard('{Escape}');

  expect(screen.queryByRole('menu')).toBeNull();
  expect(document.activeElement).toBe(trigger);
});
