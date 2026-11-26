import { CreateMenuContent } from '@/components/create/CreateMenu';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@the-monkeys/ui/atoms/dropdown-menu';
import { describe, expect, it, vi } from 'vitest';

describe('CreateMenuContent', () => {
  it('fires discussion before post for site variant', async () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <CreateMenuContent variant='site' onSelect={onSelect} />
        </DropdownMenuContent>
      </DropdownMenu>
    );
    const items = screen.getAllByRole('menuitem');
    expect(items.map((el) => el.textContent)).toEqual([
      'Create Discussion',
      'Create Post',
      'Create Event',
      'Create Group',
    ]);
    await userEvent.click(items[0]);
    expect(onSelect).toHaveBeenCalledWith('discussion');
  });
});
