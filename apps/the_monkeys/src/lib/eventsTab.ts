export const EVENT_TABS = ['discover', 'groups', 'going', 'hosting'] as const;

export type EventTab = (typeof EVENT_TABS)[number];

export const DEFAULT_EVENT_TAB: EventTab = 'discover';

export const EVENT_TAB_LABELS: Record<EventTab, string> = {
  discover: 'Discover',
  groups: 'Groups',
  going: 'Going',
  hosting: 'Hosting',
};

/** Reads ?tab= from the URL. Unknown, empty, or missing values fall back to Discover. */
export function parseEventTab(value: string | null | undefined): EventTab {
  const raw = value?.trim().toLowerCase();
  return (EVENT_TABS as readonly string[]).includes(raw ?? '')
    ? (raw as EventTab)
    : DEFAULT_EVENT_TAB;
}

/**
 * Builds the /events URL for a tab while preserving other query params.
 * Discover (the default) uses the clean canonical path with no ?tab= param,
 * matching the usePagination convention of dropping the default param.
 */
export function eventsTabLocation(
  pathname: string,
  search: string,
  tab: EventTab
): string {
  const params = new URLSearchParams(search);
  if (tab === DEFAULT_EVENT_TAB) {
    params.delete('tab');
  } else {
    params.set('tab', tab);
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
