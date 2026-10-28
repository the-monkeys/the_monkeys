import { EventForm } from '@/components/events/EventForm';
import { GroupEventForm } from '@/components/groups/GroupEventForm';
import { geocodeAddress } from '@/lib/geoSearch';
import { EventItem } from '@/services/events/eventTypes';
import {
  act,
  cleanup,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../utils';

vi.mock('@/hooks/auth/useAuth', () => ({ default: () => ({ data: null }) }));
vi.mock('@/hooks/groups/useGroupQueries', () => ({
  useUserGroups: () => ({ data: { groups: [] } }),
}));
vi.mock('@/hooks/useIPLocation', () => ({ useIPLocation: () => ({}) }));
vi.mock('@/lib/geoSearch', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/geoSearch')>()),
  geocodeAddress: vi.fn(),
}));

const oldPin = { latitude: 15.3915717, longitude: 75.0815271 };
const newPin = { latitude: 12.9101, longitude: 77.6402 };
const oldPlace = 'Old venue, Hubli';
const newPlace = 'New venue, HSR Layout, Bengaluru';
const event: EventItem = {
  id: 1,
  slug: 'location-regression',
  title: 'Local location regression',
  status: 'published',
  event_type: 'in_person',
  timezone: 'Asia/Kolkata',
  start_time: '2099-11-12T13:30:00Z',
  end_time: '2099-11-12T15:00:00Z',
  location: oldPlace,
  venue: oldPin,
};

beforeEach(() => {
  vi.mocked(geocodeAddress).mockReset().mockResolvedValue(newPin);
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe.each([
  ['standalone', EventForm],
  ['group', GroupEventForm],
] as const)('%s event place editing', (_name, Form) => {
  function setup() {
    const onSubmit = vi.fn();
    const view = renderWithProviders(
      <Form event={event} submitLabel='Save event' onSubmit={onSubmit} />
    );
    return {
      onSubmit,
      unmount: view.unmount,
      place: document.querySelector<HTMLInputElement>('[name="location"]')!,
      form: screen.getByRole('button', { name: 'Save event' }).closest('form')!,
    };
  }

  it('discards the old pin when the place changes and submits the new coordinates', async () => {
    const { onSubmit, place, form } = setup();
    fireEvent.change(place, { target: { value: newPlace } });
    expect(screen.queryByText(/Pinned · 15\.3916/)).toBeNull();
    fireEvent.submit(form);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      location: newPlace,
      ...newPin,
    });
    expect(geocodeAddress).toHaveBeenCalledWith(newPlace, undefined);
  });

  it('keeps an unchanged place and its manual pin without another lookup', async () => {
    const { onSubmit, form } = setup();
    fireEvent.submit(form);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      location: oldPlace,
      ...oldPin,
    });
    expect(geocodeAddress).not.toHaveBeenCalled();
  });

  it('preserves the pin for cosmetic whitespace and case changes', async () => {
    const { onSubmit, place, form } = setup();
    fireEvent.change(place, { target: { value: '  OLD  VENUE, HUBLI  ' } });
    fireEvent.submit(form);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toMatchObject(oldPin);
    expect(geocodeAddress).not.toHaveBeenCalled();
  });

  it('does not send the old coordinates if the replacement address cannot be resolved', async () => {
    vi.mocked(geocodeAddress).mockResolvedValue(null);
    const { onSubmit, place, form } = setup();
    fireEvent.change(place, { target: { value: newPlace } });
    fireEvent.submit(form);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ location: newPlace });
    expect(onSubmit.mock.calls[0][0]).not.toHaveProperty('latitude');
    expect(onSubmit.mock.calls[0][0]).not.toHaveProperty('longitude');
  });

  it('respects a newly selected pin after changing the address', async () => {
    const { onSubmit, place, form } = setup();
    fireEvent.change(place, { target: { value: newPlace } });
    fireEvent.click(screen.getByRole('button', { name: 'Pin this address' }));
    await screen.findByText(/Pinned · 12\.9101/);
    fireEvent.submit(form);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      location: newPlace,
      ...newPin,
    });
    expect(geocodeAddress).toHaveBeenCalledTimes(1);
  });

  it('clears the pin when the place is removed', async () => {
    const { onSubmit, place, form } = setup();
    fireEvent.change(place, { target: { value: '' } });
    fireEvent.submit(form);
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).not.toHaveProperty('latitude');
    expect(onSubmit.mock.calls[0][0]).not.toHaveProperty('longitude');
  });

  it('ignores a pin lookup that finishes after the address has changed', async () => {
    let finish!: (value: typeof oldPin) => void;
    const { place } = setup();
    vi.mocked(geocodeAddress).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    fireEvent.click(screen.getByRole('button', { name: 'Pin this address' }));
    fireEvent.change(place, { target: { value: newPlace } });
    await act(async () => {
      finish(oldPin);
    });
    expect(screen.queryByText(/Pinned · 15\.3916/)).toBeNull();
  });

  it('allows retrying a failed address lookup without retaining the old pin', async () => {
    const { place } = setup();
    fireEvent.change(place, { target: { value: newPlace } });
    vi.mocked(geocodeAddress).mockRejectedValueOnce(
      new Error('Lookup unavailable')
    );
    fireEvent.click(screen.getByRole('button', { name: 'Pin this address' }));
    await screen.findByText('Could not pin that address. Try Use my location.');
    expect(screen.queryByText(/Pinned · 15\.3916/)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Pin this address' }));
    await screen.findByText(/Pinned · 12\.9101/);
  });

  it('still saves without a stale pin if automatic address lookup rejects', async () => {
    const { onSubmit, place, form } = setup();
    fireEvent.change(place, { target: { value: newPlace } });
    vi.mocked(geocodeAddress).mockRejectedValueOnce(
      new Error('Lookup unavailable')
    );
    fireEvent.submit(form);
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0]).toMatchObject({ location: newPlace });
    expect(onSubmit.mock.calls[0][0]).not.toHaveProperty('latitude');
  });

  it('does not submit an address changed while automatic lookup was pending', async () => {
    let finish!: (value: typeof newPin) => void;
    const { onSubmit, place, form } = setup();
    fireEvent.change(place, { target: { value: newPlace } });
    vi.mocked(geocodeAddress).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    fireEvent.submit(form);
    fireEvent.change(place, { target: { value: 'Another venue, Bengaluru' } });
    await act(async () => {
      finish(newPin);
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not cancel a pending save when an unchanged input or label is clicked', async () => {
    let finish!: (value: typeof newPin) => void;
    const { onSubmit, place, form } = setup();
    fireEvent.change(place, { target: { value: newPlace } });
    vi.mocked(geocodeAddress).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    fireEvent.submit(form);
    fireEvent.click(form.querySelector('[name="title"]')!);
    fireEvent.click(screen.getByText('Place'));
    await act(async () => {
      finish(newPin);
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      location: newPlace,
      ...newPin,
    });
  });

  it('does not let an older save overwrite a more recent address and pin', async () => {
    let finish!: (value: typeof oldPin) => void;
    const { onSubmit, place, form } = setup();
    fireEvent.change(place, { target: { value: newPlace } });
    vi.mocked(geocodeAddress).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    fireEvent.submit(form);
    const latestPlace = 'Another venue, Bengaluru';
    fireEvent.change(place, { target: { value: latestPlace } });
    fireEvent.click(screen.getByRole('button', { name: 'Pin this address' }));
    await screen.findByText(/Pinned · 12\.9101/);
    fireEvent.submit(form);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toMatchObject({
      location: latestPlace,
      ...newPin,
    });
    await act(async () => {
      finish(oldPin);
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('does not submit after unmounting during automatic address lookup', async () => {
    let finish!: (value: typeof newPin) => void;
    const { onSubmit, place, form, unmount } = setup();
    fireEvent.change(place, { target: { value: newPlace } });
    vi.mocked(geocodeAddress).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    fireEvent.submit(form);
    unmount();
    await act(async () => {
      finish(newPin);
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('ignores a device-location result that arrives after changing the place', async () => {
    const previous = Object.getOwnPropertyDescriptor(navigator, 'geolocation');
    let finish!: PositionCallback;
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: {
        getCurrentPosition: (callback: PositionCallback) => {
          finish = callback;
        },
      },
    });
    try {
      const { place } = setup();
      fireEvent.click(screen.getByRole('button', { name: 'Clear pin' }));
      fireEvent.click(screen.getByRole('button', { name: 'Use my location' }));
      fireEvent.change(place, { target: { value: newPlace } });
      await act(async () => {
        finish({ coords: oldPin } as GeolocationPosition);
      });
      expect(screen.queryByText(/Pinned · 15\.3916/)).toBeNull();
    } finally {
      if (previous) Object.defineProperty(navigator, 'geolocation', previous);
      else Reflect.deleteProperty(navigator, 'geolocation');
    }
  });
});
