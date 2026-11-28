import { GroupEventForm } from '@/components/groups/GroupEventForm';
import { cleanup, fireEvent, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../utils';

vi.mock('@/hooks/useIPLocation', () => ({ useIPLocation: () => ({}) }));
vi.mock('@/features/content-readiness/EventReadiness', () => ({
  EventReadiness: ({ readValues, context }: any) => (
    <button
      type='button'
      onClick={() => {
        document.querySelector('[data-readiness-result]')!.textContent =
          JSON.stringify({ values: readValues(), context });
      }}
    >
      Check readiness
    </button>
  ),
}));
afterEach(cleanup);

it('lets group hosts inspect unsaved member-only events with the loaded group context', () => {
  const submit = vi.fn();
  const { container } = renderWithProviders(
    <GroupEventForm
      submitLabel='Create event'
      onSubmit={submit}
      group={{ slug: 'club', name: 'Local club', visibility: 'private' }}
      accountKey='host'
      organizerName='local-host'
    />
  );
  const output = document.createElement('output');
  output.dataset.readinessResult = '';
  container.append(output);
  fireEvent.change(document.querySelector('[name="title"]')!, {
    target: { value: 'Local group event' },
  });
  fireEvent.click(
    screen.getByRole('button', { name: 'Members only' })
  );
  fireEvent.click(
    screen.getByRole('button', { name: 'Check readiness' })
  );
  const result = JSON.parse(output.textContent!);
  expect(result.values).toMatchObject({
    title: 'Local group event',
    visibility: 'group_members',
  });
  expect(result.context).toMatchObject({
    groupSlug: 'club',
    groupVisibility: 'private',
    accountKey: 'host',
    groupLinked: true,
  });
  expect(result.values).not.toHaveProperty('meeting_link');
  expect(submit).not.toHaveBeenCalled();
});

it('preserves the group event API submission contract after running readiness', () => {
  const submit = vi.fn();
  const { container } = renderWithProviders(
    <GroupEventForm submitLabel='Create event' onSubmit={submit} />
  );
  const output = document.createElement('output');
  output.dataset.readinessResult = '';
  container.append(output);
  fireEvent.click(screen.getByRole('button', { name: 'Online' }));
  fireEvent.change(document.querySelector('[name="title"]')!, {
    target: { value: 'Local group event' },
  });
  fireEvent.change(screen.getByRole('combobox', { name: 'Event timezone' }), {
    target: { value: 'Asia/Kolkata' },
  });
  fireEvent.change(document.querySelector('[name="start"]')!, {
    target: { value: '2099-11-12T19:00' },
  });
  fireEvent.change(document.querySelector('[name="end"]')!, {
    target: { value: '2099-11-12T20:30' },
  });
  fireEvent.click(
    screen.getByRole('button', { name: 'Check readiness' })
  );
  fireEvent.submit(
    screen
      .getByRole('button', { name: 'Create event' })
      .closest('form')!
  );
  expect(submit).toHaveBeenCalledTimes(1);
  const body = submit.mock.calls[0][0];
  expect(body).toMatchObject({
    title: 'Local group event',
    timezone: 'Asia/Kolkata',
    start_time: '2099-11-12T13:30:00.000Z',
    end_time: '2099-11-12T15:00:00.000Z',
  });
  expect(body).not.toHaveProperty('co_host_usernames');
  expect(body).not.toHaveProperty('ticket_tiers');
  expect(submit.mock.calls[0]).toHaveLength(1);
});
