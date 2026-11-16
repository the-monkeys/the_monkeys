// @vitest-environment node
import React from 'react';

import { EventGridCard } from '@/components/events/EventGridCard';
import { renderToString } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';

vi.mock('@/components/events/EventHostName', () => ({
  EventHostName: () => null,
}));
afterEach(() => vi.restoreAllMocks());

it('uses deterministic first-render dates and prices regardless of the server locale', () => {
  const nativeDate = Date.prototype.toLocaleString;
  vi.spyOn(Date.prototype, 'toLocaleString').mockImplementation(function (
    this: Date,
    locale,
    options
  ) {
    return nativeDate.call(this, locale ?? 'de-DE', options);
  });
  const NativeNumber = Intl.NumberFormat;
  vi.spyOn(Intl, 'NumberFormat').mockImplementation(function (locale, options) {
    return new NativeNumber(locale ?? 'de-DE', options);
  } as typeof Intl.NumberFormat);
  const html = renderToString(
    <EventGridCard
      event={{
        id: 1,
        slug: 'workshop',
        title: 'Workshop',
        status: 'published',
        event_type: 'virtual',
        start_time: '2099-12-01T10:00:00Z',
        ticket_tiers: [{ id: 1, name: 'Ticket', price: 10, currency: 'USD', capacity: 10 }],
      }}
    />
  );
  expect(html).toContain('Tue, Dec 1');
  expect(html).toContain('$10');
});
