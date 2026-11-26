import { DiscussionBody } from '@/components/discussions/DiscussionBody';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

afterEach(cleanup);

describe('DiscussionBody', () => {
  it('renders plain text as a paragraph', () => {
    render(<DiscussionBody body='Hello there' className='x' />);
    expect(screen.getByText('Hello there').tagName).toBe('P');
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('opens external links in a new tab as user content', () => {
    render(<DiscussionBody body='see https://example.com/a now' />);
    const link = screen.getByRole('link', { name: 'https://example.com/a' });
    expect(link.getAttribute('href')).toBe('https://example.com/a');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('ugc nofollow noopener noreferrer');
  });

  it('links @mentions to the profile', () => {
    render(<DiscussionBody body='thanks @chimp!' />);
    expect(
      screen.getByRole('link', { name: '@chimp' }).getAttribute('href')
    ).toBe('/chimp');
  });

  it('keeps own-site links relative in the same tab', () => {
    render(
      <DiscussionBody body='join https://monkeys.com.co/groups/gophers' />
    );
    const link = screen.getByRole('link', {
      name: 'https://monkeys.com.co/groups/gophers',
    });
    expect(link.getAttribute('href')).toBe('/groups/gophers');
    expect(link.getAttribute('target')).toBeNull();
    expect(link.getAttribute('rel')).toBeNull();
  });
});
