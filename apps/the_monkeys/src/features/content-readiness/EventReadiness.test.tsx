import { useRef, useState } from 'react';

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { EventReadiness } from './EventReadiness';

vi.mock('./ReadinessPanel', () => ({
  ReadinessPanel: ({ open, report, onOpenChange }: any) =>
    open ? (
      <div role='dialog' aria-label='Search and AI readiness'>
        <output>{report?.preview?.title}</output>
        <button type='button' onClick={() => onOpenChange(false)}>
          Close readiness
        </button>
      </div>
    ) : null,
}));
afterEach(cleanup);

function FormHarness({
  submit,
  read,
}: {
  submit: () => void;
  read: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [zone, setZone] = useState('UTC');
  return (
    <form
      ref={formRef}
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
    >
      <label>
        Event title
        <input name='title' defaultValue='Initial event' />
      </label>
      <input
        name='meeting_link'
        defaultValue='https://private.example.test/meeting-access'
      />
      <button type='button' onClick={() => setZone('Asia/Kolkata')}>
        Change timezone
      </button>
      <EventReadiness
        formRef={formRef}
        readValues={() => {
          read();
          const title = (
            formRef.current!.elements.namedItem('title') as HTMLInputElement
          ).value;
          return {
            title,
            description: `A local meetup in ${zone}.`,
            eventType: 'virtual',
            visibility: 'public',
            timezone: zone,
            startLocal: '2099-11-12T19:00',
            endLocal: '2099-11-12T20:30',
            topics: ['Community'],
          };
        }}
        context={{
          resourceKey: 'event-new',
          accountKey: 'host',
          isExistingEvent: false,
          eventEnded: false,
        }}
      />
      <button type='submit'>Save event</button>
    </form>
  );
}

describe('event readiness entry', () => {
  it('reads only when opened and refreshes native unsaved values without submitting', async () => {
    const submit = vi.fn(),
      read = vi.fn();
    render(<FormHarness submit={submit} read={read} />);
    expect(read).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Check readiness' }));
    await waitFor(() =>
      expect(screen.getByRole('dialog').textContent).toContain('Initial event')
    );
    fireEvent.change(screen.getByRole('textbox', { name: 'Event title' }), {
      target: { value: 'Unsaved new title' },
    });
    await waitFor(
      () =>
        expect(screen.getByRole('dialog').textContent).toContain(
          'Unsaved new title'
        ),
      { timeout: 2500 }
    );
    expect(submit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Close readiness' }));
    const previousReads = read.mock.calls.length;
    fireEvent.change(screen.getByRole('textbox', { name: 'Event title' }), {
      target: { value: 'Closed panel edit' },
    });
    expect(read).toHaveBeenCalledTimes(previousReads);
    fireEvent.click(screen.getByRole('button', { name: 'Save event' }));
    expect(submit).toHaveBeenCalledTimes(1);
  });
});
