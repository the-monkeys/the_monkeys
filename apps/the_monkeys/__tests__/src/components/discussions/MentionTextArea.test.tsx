import { useState } from 'react';

import { MentionTextArea } from '@/components/discussions/MentionTextArea';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const searchMock = vi.hoisted(() => vi.fn());

vi.mock('@/hooks/search/useSearchV2', () => ({
  useSearchPeopleV2: searchMock,
}));
vi.mock('@/components/discussions/DiscussionAvatar', () => ({
  DiscussionAvatar: () => null,
}));

const people = [
  { account_id: '1', username: 'dave', first_name: 'Dave', last_name: 'K' },
  { account_id: '2', username: 'dana', first_name: '', last_name: '' },
];

beforeEach(() => {
  searchMock.mockImplementation(
    ({ query, enabled }: { query: string; enabled: boolean }) => ({
      users: enabled && query ? people : null,
      isLoading: false,
    })
  );
});
afterEach(() => {
  cleanup();
  searchMock.mockReset();
});

function Harness() {
  const [value, setValue] = useState('');
  return (
    <>
      <MentionTextArea
        aria-label='Discussion'
        onValueChange={setValue}
        value={value}
      />
      <output>{value}</output>
    </>
  );
}

describe('MentionTextArea', () => {
  it('suggests people after @ and a letter', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const box = screen.getByRole('textbox', { name: 'Discussion' });
    await user.type(box, 'hi @da');
    const list = await screen.findByRole('listbox');
    expect(screen.getAllByRole('option')).toHaveLength(2);
    const first = screen.getByRole('option', { name: /Dave K/ });
    expect(searchMock).toHaveBeenLastCalledWith(
      expect.objectContaining({ query: 'da', limit: 5, enabled: true })
    );
    expect(box.getAttribute('aria-controls')).toBe(list.id);
    expect(box.getAttribute('aria-activedescendant')).toBe(first.id);
    expect(first.getAttribute('aria-selected')).toBe('true');
  });

  it('inserts the highlighted person with arrow keys and Enter', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const box = screen.getByRole('textbox', { name: 'Discussion' });
    await user.type(box, 'hi @da');
    await screen.findByRole('listbox');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(screen.getByRole('status').textContent).toBe('hi @dana ');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('inserts a person on click', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByRole('textbox'), '@d');
    await user.click(await screen.findByRole('option', { name: /Dave K/ }));
    expect(screen.getByRole('status').textContent).toBe('@dave ');
  });

  it('closes on Escape and stays closed without a mention', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const box = screen.getByRole('textbox');
    await user.type(box, 'hello');
    expect(screen.queryByRole('listbox')).toBeNull();
    await user.type(box, ' @da');
    await screen.findByRole('listbox');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull());
    await user.type(box, 'v');
    expect(await screen.findByRole('listbox')).toBeTruthy();
    await waitFor(() =>
      expect(searchMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ query: 'dav', keepPrevious: true })
      )
    );
  });
});
