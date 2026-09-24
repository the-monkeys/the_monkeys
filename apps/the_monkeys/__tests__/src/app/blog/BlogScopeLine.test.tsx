import { BlogScopeLine } from '@/app/blog/components/BlogScopeLine';
import { useGroupDetail } from '@/hooks/groups/useGroupQueries';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/groups/useGroupQueries', () => ({
  useGroupDetail: vi.fn(),
}));

const mockedGroupDetail = vi.mocked(useGroupDetail);

describe('BlogScopeLine', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(cleanup);

  it('links to the named group and remains compact from mobile upward', () => {
    mockedGroupDetail.mockReturnValue({
      data: {
        group: {
          id: 1,
          slug: 'writers',
          name: 'Writers Guild',
          visibility: 'private',
          status: 'published',
        },
      },
    } as never);

    render(<BlogScopeLine groupSlug='writers' audience='group_only' />);

    expect(
      screen.getByRole('link', { name: 'Writers Guild' }).getAttribute('href')
    ).toBe('/groups/writers');
    expect(screen.getByText('Members only')).toBeTruthy();
    expect(screen.getByTestId('blog-scope-line').className).toContain(
      'flex-wrap'
    );
    expect(mockedGroupDetail).toHaveBeenCalledWith('writers');
  });

  it('does not enable a group request or render an empty group link', () => {
    mockedGroupDetail.mockReturnValue({ data: undefined } as never);

    render(<BlogScopeLine audience='public' />);

    expect(mockedGroupDetail).toHaveBeenCalledWith(undefined);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.queryByText('Members only')).toBeNull();
  });
});
