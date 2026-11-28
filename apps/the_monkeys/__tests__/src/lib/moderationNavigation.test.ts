import {
  birthdayReturnPath,
  birthdaySettingsHref,
} from '@/lib/moderationNavigation';
import { describe, expect, it } from 'vitest';

describe('birthday return navigation', () => {
  it('keeps the original local article URL', () => {
    const href = birthdaySettingsHref('/blog/hindi-post-id?source=feed');
    expect(birthdayReturnPath(href.split('?')[1])).toBe(
      '/blog/hindi-post-id?source=feed'
    );
  });
  it('rejects external and authentication-loop destinations', () => {
    for (const x of ['https://evil.test', '//evil.test', '/auth/login']) {
      expect(birthdaySettingsHref(x)).not.toContain('returnTo=');
      expect(
        birthdayReturnPath('returnTo=' + encodeURIComponent(x))
      ).toBeNull();
    }
  });
});

it('rejects browser-normalized return-address escapes', () => {
  for (const path of [
    '/\\evil.test',
    '/\n/evil.test',
    '/%5cevil.test',
    '/%2f/evil.test',
    '/%61uth/login',
  ]) {
    expect(
      birthdayReturnPath('returnTo=' + encodeURIComponent(path))
    ).toBeNull();
    expect(birthdaySettingsHref(path)).not.toContain('returnTo=');
  }
});
