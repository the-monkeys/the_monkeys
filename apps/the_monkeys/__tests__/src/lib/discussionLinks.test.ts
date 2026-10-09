import {
  firstInternalLink,
  internalTarget,
  splitBody,
} from '@/lib/discussionLinks';
import { describe, expect, it } from 'vitest';

describe('splitBody', () => {
  it('treats a body the gateway omitted as empty', () => {
    expect(splitBody(undefined)).toEqual([]);
    expect(firstInternalLink(undefined)).toBeNull();
  });

  it('returns plain text unchanged', () => {
    expect(splitBody('just words')).toEqual([
      { kind: 'text', text: 'just words' },
    ]);
  });

  it('splits an external link out of the text', () => {
    expect(splitBody('see https://example.com/a?b=1 now')).toEqual([
      { kind: 'text', text: 'see ' },
      {
        kind: 'link',
        text: 'https://example.com/a?b=1',
        href: 'https://example.com/a?b=1',
        internal: false,
      },
      { kind: 'text', text: ' now' },
    ]);
  });

  it('leaves trailing punctuation outside the link', () => {
    const segments = splitBody(
      'Read https://example.com/x. Then (www.example.org)!'
    );
    expect(segments).toEqual([
      { kind: 'text', text: 'Read ' },
      {
        kind: 'link',
        text: 'https://example.com/x',
        href: 'https://example.com/x',
        internal: false,
      },
      { kind: 'text', text: '. Then (' },
      {
        kind: 'link',
        text: 'www.example.org',
        href: 'https://www.example.org/',
        internal: false,
      },
      { kind: 'text', text: ')!' },
    ]);
  });

  it('keeps balanced parentheses inside a link', () => {
    const [, link] = splitBody('wiki https://en.wikipedia.org/wiki/Go_(game)');
    expect(link).toMatchObject({
      href: 'https://en.wikipedia.org/wiki/Go_(game)',
    });
  });

  it('turns own-site links into relative internal links', () => {
    expect(splitBody('https://www.monkeys.com.co/events/meetup-1#top')).toEqual(
      [
        {
          kind: 'link',
          text: 'https://www.monkeys.com.co/events/meetup-1#top',
          href: '/events/meetup-1#top',
          internal: true,
        },
      ]
    );
  });

  it('splits @mentions out of the text', () => {
    expect(splitBody('hi @dave.k, ask @chimp.')).toEqual([
      { kind: 'text', text: 'hi ' },
      { kind: 'mention', text: '@dave.k', username: 'dave.k' },
      { kind: 'text', text: ', ask ' },
      { kind: 'mention', text: '@chimp', username: 'chimp' },
      { kind: 'text', text: '.' },
    ]);
  });

  it('ignores emails, lone @ signs and @ inside links', () => {
    expect(splitBody('mail dave@x.com or @ now https://x.com/@chimp')).toEqual([
      { kind: 'text', text: 'mail dave@x.com or @ now ' },
      {
        kind: 'link',
        text: 'https://x.com/@chimp',
        href: 'https://x.com/@chimp',
        internal: false,
      },
    ]);
  });

  it('ignores unsupported schemes', () => {
    expect(splitBody('javascript:alert(1)')).toEqual([
      { kind: 'text', text: 'javascript:alert(1)' },
    ]);
  });
});

describe('internalTarget', () => {
  it.each([
    ['/blog/my-first-post-p44nn', { kind: 'blog', id: 'p44nn' }],
    ['/blog/p44nn', { kind: 'blog', id: 'p44nn' }],
    ['/events/go-meetup', { kind: 'event', slug: 'go-meetup' }],
    ['/groups/gophers', { kind: 'group', slug: 'gophers' }],
    [
      '/discussions/86b584cd0202e5d0',
      { kind: 'discussion', id: '86b584cd0202e5d0' },
    ],
    ['/dave.k', { kind: 'profile', username: 'dave.k' }],
    ['/@chimp', { kind: 'profile', username: 'chimp' }],
  ])('recognises %s', (path, target) => {
    expect(internalTarget(path)).toEqual(target);
  });

  it.each([
    '/feed',
    '/discussions',
    '/groups/gophers/settings',
    '/llms.txt',
    '/privacy',
    '/',
  ])('ignores %s', (path) => {
    expect(internalTarget(path)).toBeNull();
  });
});

describe('firstInternalLink', () => {
  it('skips external and unrecognised links', () => {
    expect(
      firstInternalLink(
        'a https://example.com b https://monkeys.com.co/feed c https://monkeys.com.co/groups/gophers?tab=posts d https://monkeys.com.co/chimp'
      )
    ).toEqual({
      href: '/groups/gophers?tab=posts',
      target: { kind: 'group', slug: 'gophers' },
    });
  });

  it('returns null without an own-site link', () => {
    expect(firstInternalLink('nothing https://example.com')).toBeNull();
  });
});
