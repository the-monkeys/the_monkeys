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
  expect(postItem.tabIndex).toBe(0);
  expect(eventItem.tabIndex).toBe(-1);
  expect(groupItem.tabIndex).toBe(-1);
  await user.keyboard('{ArrowDown}');
  expect(document.activeElement).toBe(eventItem);
  expect(postItem.tabIndex).toBe(-1);
  expect(eventItem.tabIndex).toBe(0);
  await user.keyboard('{ArrowDown}');
  expect(document.activeElement).toBe(groupItem);
  expect(eventItem.tabIndex).toBe(-1);
  expect(groupItem.tabIndex).toBe(0);
  await user.keyboard('{ArrowUp}');
  expect(document.activeElement).toBe(eventItem);
  expect(eventItem.tabIndex).toBe(0);
  expect(groupItem.tabIndex).toBe(-1);
});

it('supports wrapped arrow navigation plus Home and End', async () => {
  const user = userEvent.setup();

  renderWithProviders(<CreateButton />);
  await user.click(screen.getByRole('button', { name: 'Create' }));

  const postItem = screen.getByRole('menuitem', { name: 'Create Post' });
  const eventItem = screen.getByRole('menuitem', { name: 'Create Event' });
  const groupItem = screen.getByRole('menuitem', { name: 'Create Group' });

  await user.keyboard('{ArrowUp}');
  expect(document.activeElement).toBe(groupItem);
  expect(groupItem.tabIndex).toBe(0);
  await user.keyboard('{Home}');
  expect(document.activeElement).toBe(postItem);
  expect(postItem.tabIndex).toBe(0);
  await user.keyboard('{End}');
  expect(document.activeElement).toBe(groupItem);
  expect(groupItem.tabIndex).toBe(0);
  await user.keyboard('{ArrowDown}');
  expect(document.activeElement).toBe(postItem);
  expect(eventItem.tabIndex).toBe(-1);
});

it('closes on Tab and allows focus to move beyond the popup', async () => {
  const user = userEvent.setup();

  renderWithProviders(
    <>
      <CreateButton />
      <button type='button'>After Create menu</button>
    </>
  );
  await user.click(screen.getByRole('button', { name: 'Create' }));

  expect(document.activeElement).toBe(
    screen.getByRole('menuitem', { name: 'Create Post' })
  );
  await user.tab();

  expect(screen.queryByRole('menu')).toBeNull();
  expect(document.activeElement).toBe(
    screen.getByRole('button', { name: 'After Create menu' })
  );
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
