import { useState } from 'react';

import { BlogPublicationScopeFields } from '@/components/blog/actions/BlogPublicationScopeFields';
import { useUserGroups } from '@/hooks/groups/useGroupQueries';
import { BlogPublicationSelection } from '@/services/blog/blogPublication';
import { GroupItem } from '@/services/groups/groupsTypes';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/groups/useGroupQueries', () => ({
  useUserGroups: vi.fn(),
}));

vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'light' }),
}));

const group = (
  slug: string,
  name: string,
  visibility: GroupItem['visibility'],
  status: GroupItem['viewer_member_status'] = 'active'
): GroupItem => ({
  id: slug.length,
  slug,
  name,
  visibility,
  status: 'published',
  viewer_member_status: status,
});

const publicGroup = group('public-writers', 'Public Writers', 'public');
const privateGroup = group('private-writers', 'Private Writers', 'private');
const pendingGroup = group(
  'pending-writers',
  'Pending Writers',
  'public',
  'pending'
);

const mockedUseUserGroups = vi.mocked(useUserGroups);

function Harness({
  onChange = vi.fn(),
}: {
  onChange?: ReturnType<typeof vi.fn>;
}) {
  const [value, setValue] = useState<BlogPublicationSelection>({
    group: null,
    audience: 'public',
  });

  return (
    <BlogPublicationScopeFields
      username='ada'
      value={value}
      onChange={(selection) => {
        setValue(selection);
        onChange(selection);
      }}
    />
  );
}

async function chooseGroup(label: string) {
  const input = screen.getByRole('combobox', { name: 'Publish to a group' });
  await userEvent.type(input, label);
  await userEvent.click(await screen.findByText(label));
}

describe('BlogPublicationScopeFields', () => {
  beforeEach(() => {
    mockedUseUserGroups.mockReturnValue({
      data: { groups: [publicGroup, privateGroup, pendingGroup] },
      isLoading: false,
    } as never);
  });

  afterEach(cleanup);

  it('shows both audience choices for an active public group', async () => {
    render(<Harness />);

    await chooseGroup('Public Writers');

    expect(screen.getByRole('radio', { name: /^Public/ })).toBeTruthy();
    expect(screen.getByRole('radio', { name: /Members only/ })).toBeTruthy();
    expect(screen.queryByText('Pending Writers')).toBeNull();
  });

  it('forces members only for private groups', async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    await chooseGroup('Private Writers');

    expect(screen.queryByRole('radio', { name: /^Public/ })).toBeNull();
    expect(screen.getByText('Members only')).toBeTruthy();
    expect(onChange).toHaveBeenLastCalledWith({
      group: expect.objectContaining({ slug: 'private-writers' }),
      audience: 'group_only',
    });
  });

  it('clears back to a public post with no group', async () => {
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    await chooseGroup('Public Writers');

    await userEvent.click(screen.getByRole('button', { name: 'Remove group' }));

    expect(onChange).toHaveBeenLastCalledWith({
      group: null,
      audience: 'public',
    });
    expect(
      screen.getByText('This post will publish without a group.')
    ).toBeTruthy();
  });

  it('explains the active-membership requirement when no groups are available', () => {
    mockedUseUserGroups.mockReturnValue({
      data: { groups: [] },
      isLoading: false,
    } as never);

    render(<Harness />);

    expect(screen.getByText('Publish to a group')).toBeTruthy();
    expect(
      screen.getByText('Only active memberships are listed.')
    ).toBeTruthy();
    expect(
      screen.getByText('You have no active group memberships.')
    ).toBeTruthy();
  });
});
