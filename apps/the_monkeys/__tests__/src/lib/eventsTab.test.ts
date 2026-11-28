import {
  DEFAULT_EVENT_TAB,
  eventsTabLocation,
  parseEventTab,
} from '@/lib/eventsTab';
import { describe, expect, it } from 'vitest';

describe('parseEventTab', () => {
  it('returns the tab for valid values', () => {
    expect(parseEventTab('discover')).toBe('discover');
    expect(parseEventTab('groups')).toBe('groups');
    expect(parseEventTab('going')).toBe('going');
    expect(parseEventTab('hosting')).toBe('hosting');
  });

  it('falls back to Discover for missing or invalid values', () => {
    expect(parseEventTab(null)).toBe(DEFAULT_EVENT_TAB);
    expect(parseEventTab(undefined)).toBe(DEFAULT_EVENT_TAB);
    expect(parseEventTab('')).toBe(DEFAULT_EVENT_TAB);
    expect(parseEventTab('garbage')).toBe(DEFAULT_EVENT_TAB);
  });

  it('trims and lowercases the value', () => {
    expect(parseEventTab(' Hosting ')).toBe('hosting');
    expect(parseEventTab('GOING')).toBe('going');
  });
});

describe('eventsTabLocation', () => {
  it('keeps the canonical clean path for the default Discover tab', () => {
    expect(eventsTabLocation('/events', '', 'discover')).toBe('/events');
    expect(eventsTabLocation('/events', 'tab=groups', 'discover')).toBe(
      '/events'
    );
  });

  it('sets ?tab= for non-default tabs', () => {
    expect(eventsTabLocation('/events', '', 'hosting')).toBe(
      '/events?tab=hosting'
    );
    expect(eventsTabLocation('/events', '', 'going')).toBe('/events?tab=going');
    expect(eventsTabLocation('/events', '', 'groups')).toBe(
      '/events?tab=groups'
    );
  });

  it('preserves other query params', () => {
    expect(eventsTabLocation('/events', 'q=meetup', 'going')).toBe(
      '/events?q=meetup&tab=going'
    );
    expect(eventsTabLocation('/events', 'q=meetup&tab=going', 'hosting')).toBe(
      '/events?q=meetup&tab=hosting'
    );
  });
});
