import { AddToCalendarMenu } from '@/components/events/AddToCalendarMenu';
import { EventItem } from '@/services/events/eventTypes';
import * as eventsApi from '@/services/events/eventsApi';
import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../utils';

afterEach(cleanup);

const mockEvent: EventItem = {
  id: 42,
  title: 'Fullstack Next.js Conf',
  slug: 'fullstack-nextjs-conf',
  description: 'A deep dive into server components and streaming.',
  start_time: '2026-11-20T10:00:00.000Z',
  end_time: '2026-11-20T12:00:00.000Z',
  timezone: 'Asia/Kolkata',
  event_type: 'in_person',
  location: 'Tech Park Auditorium, Bengaluru',
  status: 'published',
};

describe('AddToCalendarMenu', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the trigger button with "Add to calendar"', () => {
    renderWithProviders(<AddToCalendarMenu event={mockEvent} />);
    const trigger = screen.getByRole('button', { name: /add to calendar/i });
    expect(trigger).toBeDefined();
  });

  it('opens a menu with Google, Outlook, Apple / .ics, and Yahoo options', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddToCalendarMenu event={mockEvent} />);

    const trigger = screen.getByRole('button', { name: /add to calendar/i });
    await user.click(trigger);

    expect(screen.getByRole('menu')).toBeDefined();

    const googleItem = screen.getByRole('menuitem', { name: /google/i });
    const outlookItem = screen.getByRole('menuitem', { name: /outlook/i });
    const appleItem = screen.getByRole('menuitem', { name: /apple \/ \.ics/i });
    const yahooItem = screen.getByRole('menuitem', { name: /yahoo/i });

    expect(googleItem).toBeDefined();
    expect(outlookItem).toBeDefined();
    expect(appleItem).toBeDefined();
    expect(yahooItem).toBeDefined();

    // Verify Google link attributes and URL params
    const googleHref = googleItem.getAttribute('href');
    expect(googleHref).toContain('calendar.google.com/calendar/render');
    expect(googleHref).toContain('action=TEMPLATE');
    expect(googleHref).toContain('Fullstack+Next.js+Conf');
    expect(googleHref).toContain('20261120T100000Z%2F20261120T120000Z');
    expect(googleHref).toContain('ctz=Asia%2FKolkata');
    expect(googleHref).toContain('Tech+Park+Auditorium%2C+Bengaluru');
    expect(googleHref).toContain('A+deep+dive+into+server+components');
    expect(googleHref).toContain('events%2Ffullstack-nextjs-conf');
    expect(googleItem.getAttribute('target')).toBe('_blank');
    expect(googleItem.getAttribute('rel')).toContain('noopener');

    // Verify Outlook link attributes and URL params
    const outlookHref = outlookItem.getAttribute('href');
    expect(outlookHref).toContain(
      'outlook.live.com/calendar/0/deeplink/compose'
    );
    expect(outlookHref).toContain('path=%2Fcalendar%2Faction%2Fcompose');
    expect(outlookHref).toContain('rru=addevent');
    expect(outlookHref).toContain('subject=Fullstack+Next.js+Conf');
    expect(outlookHref).toContain('startdt=2026-11-20T10%3A00%3A00.000Z');
    expect(outlookHref).toContain('enddt=2026-11-20T12%3A00%3A00.000Z');
    expect(outlookHref).toContain('location=Tech+Park+Auditorium%2C+Bengaluru');
    expect(outlookHref).toContain('A+deep+dive+into+server+components');
    expect(outlookHref).toContain('events%2Ffullstack-nextjs-conf');
    expect(outlookItem.getAttribute('target')).toBe('_blank');
    expect(outlookItem.getAttribute('rel')).toContain('noopener');

    // Verify Yahoo link attributes and URL params
    const yahooHref = yahooItem.getAttribute('href');
    expect(yahooHref).toContain('calendar.yahoo.com');
    expect(yahooHref).toContain('v=60');
    expect(yahooHref).toContain('title=Fullstack+Next.js+Conf');
    expect(yahooHref).toContain('st=20261120T100000Z');
    expect(yahooHref).toContain('et=20261120T120000Z');
    expect(yahooHref).toContain('in_loc=Tech+Park+Auditorium%2C+Bengaluru');
    expect(yahooHref).toContain('A+deep+dive+into+server+components');
    expect(yahooHref).toContain('events%2Ffullstack-nextjs-conf');
    expect(yahooItem.getAttribute('target')).toBe('_blank');
  });

  it('triggers downloadCalendar when Apple / .ics is clicked', async () => {
    const user = userEvent.setup();
    const downloadSpy = vi
      .spyOn(eventsApi, 'downloadCalendar')
      .mockResolvedValueOnce();

    renderWithProviders(<AddToCalendarMenu event={mockEvent} />);

    await user.click(screen.getByRole('button', { name: /add to calendar/i }));
    const appleItem = screen.getByRole('menuitem', { name: /apple \/ \.ics/i });
    await user.click(appleItem);

    expect(downloadSpy).toHaveBeenCalledWith('fullstack-nextjs-conf');
  });

  it('displays a toast if calendar download fails', async () => {
    const user = userEvent.setup();
    vi.spyOn(eventsApi, 'downloadCalendar').mockRejectedValueOnce(
      new Error('Network error')
    );

    renderWithProviders(<AddToCalendarMenu event={mockEvent} />);

    await user.click(screen.getByRole('button', { name: /add to calendar/i }));
    const appleItem = screen.getByRole('menuitem', { name: /apple \/ \.ics/i });
    await user.click(appleItem);

    await waitFor(() => {
      expect(screen.getByText('Could not download calendar')).toBeDefined();
    });
  });
});
