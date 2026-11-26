import api from '@/services/api/axiosInstanceNoAuth';
import { downloadCalendar } from '@/services/events/eventsApi';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

vi.mock('@/services/api/axiosInstanceNoAuth', () => ({
  default: { get: vi.fn() },
}));
let click: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  vi.stubGlobal(
    'URL',
    Object.assign(URL, {
      createObjectURL: vi.fn(() => 'blob:local-calendar'),
      revokeObjectURL: vi.fn(),
    })
  );
  click = vi
    .spyOn(HTMLAnchorElement.prototype, 'click')
    .mockImplementation(() => {});
  vi.mocked(api.get).mockResolvedValue({
    data: new Blob(['BEGIN:VCALENDAR']),
    headers: {},
  });
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

it('keeps the original single-date URL and file download behavior for old callers', async () => {
  await downloadCalendar('legacy event');
  expect(api.get).toHaveBeenCalledWith('/events/legacy%20event/calendar', {
    responseType: 'blob',
  });
  expect(click).toHaveBeenCalledOnce();
});
it('opts into series export explicitly', async () => {
  vi.mocked(api.get).mockResolvedValue({
    data: new Blob(['BEGIN:VCALENDAR']),
    headers: { 'x-monkeys-calendar-scope': 'series' },
  });
  await downloadCalendar('weekly', 'series');
  expect(api.get).toHaveBeenCalledWith('/events/weekly/calendar', {
    responseType: 'blob',
    params: { scope: 'series' },
  });
  expect(click).toHaveBeenCalledOnce();
});
it('does not mislabel an old backend single-date response as a series', async () => {
  await expect(downloadCalendar('weekly', 'series')).rejects.toThrow(
    /series export.*not available/i
  );
  expect(click).not.toHaveBeenCalled();
});
it('does not download an API error page', async () => {
  vi.mocked(api.get).mockRejectedValueOnce(new Error('Local API unavailable'));
  await expect(downloadCalendar('weekly')).rejects.toThrow(
    'Local API unavailable'
  );
  expect(click).not.toHaveBeenCalled();
});

it('offers the single-occurrence fallback when an older event service rejects series export', async () => {
  vi.mocked(api.get).mockRejectedValueOnce(
    Object.assign(new Error('Request failed with status code 501'), {
      isAxiosError: true,
      response: { status: 501 },
    })
  );
  await expect(downloadCalendar('weekly', 'series')).rejects.toThrow(
    /not available.*this occurrence/i
  );
  expect(click).not.toHaveBeenCalled();
});
