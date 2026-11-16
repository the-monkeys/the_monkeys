// @vitest-environment node
import React from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';
import { GroupCard } from '@/components/groups/GroupCard';
import { GroupGridCard } from '@/components/groups/GroupGridCard';

afterEach(() => vi.restoreAllMocks());
it('keeps member counts stable in initial directory HTML across server locales', () => {
  const native = Number.prototype.toLocaleString;
  vi.spyOn(Number.prototype, 'toLocaleString').mockImplementation(function (this: number, locale, options) {
    return native.call(this, locale ?? 'de-DE', options);
  });
  const group = { id: 1, slug: 'community', name: 'Community', visibility: 'public' as const, member_count: 1234 };
  expect(renderToString(<GroupCard group={group} />)).toContain('1,234 members');
  expect(renderToString(<GroupGridCard group={group} />)).toContain('1,234 members');
});
