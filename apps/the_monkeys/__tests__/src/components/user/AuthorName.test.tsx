import { AuthorName } from '@/components/user/AuthorName';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

afterEach(cleanup);

describe('AuthorName verification badge', () => {
  it('shows an icon-only verified badge beside the name when isVerified is true', () => {
    render(
      <AuthorName firstName='Dave' lastName='Augustus' isVerified />
    );

    expect(screen.getByText('Dave Augustus')).toBeTruthy();
    expect(screen.getByTitle('Verified account')).toBeTruthy();
  });

  it.each([undefined, false] as const)(
    'keeps unverified and stale authors badge-free when isVerified is %s',
    (isVerified) => {
      render(
        <AuthorName firstName='Dave' lastName='Augustus' isVerified={isVerified} />
      );

      expect(screen.getByText('Dave Augustus')).toBeTruthy();
      expect(screen.queryByTitle('Verified account')).toBeNull();
    }
  );
});
