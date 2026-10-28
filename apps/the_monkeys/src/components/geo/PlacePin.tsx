'use client';

import { useEffect, useRef, useState } from 'react';

import { useIPLocation } from '@/hooks/useIPLocation';
import { GeoPin, geocodeAddress, normalizePlaceText } from '@/lib/geoSearch';
import { Button } from '@the-monkeys/ui/atoms/button';

function addressFromForm(el: HTMLElement): string {
  const form = el.closest('form');
  if (!form) return '';
  const loc = form.querySelector<HTMLInputElement>(
    'input[name="location"], input[name="city"]'
  );
  return loc?.value.trim() || '';
}

export function PlacePin({
  value,
  onChange,
  disabled,
  address,
  label = 'Map pin (optional)',
  hint = 'Helps people nearby find this. Skip it and we will try the address.',
}: {
  value: GeoPin | null;
  onChange: (pin: GeoPin | null) => void;
  disabled?: boolean;
  address?: string;
  label?: string;
  hint?: string;
}) {
  const [busy, setBusy] = useState<'geo' | 'addr' | ''>('');
  const [error, setError] = useState('');
  const ipLocation = useIPLocation();
  const requestId = useRef(0);
  const normalizedAddress = normalizePlaceText(address ?? '');

  useEffect(() => {
    // An older lookup must not put a pin back after an address edit or unmount.
    const pending = requestId;
    pending.current++;
    setBusy('');
    setError('');
    return () => {
      pending.current++;
    };
  }, [normalizedAddress, disabled]);

  const startLookup = (el: HTMLElement) => {
    const id = ++requestId.current;
    const formAddress = normalizePlaceText(addressFromForm(el));
    return () => {
      if (id !== requestId.current || !el.isConnected) return false;
      setBusy('');
      return formAddress === normalizePlaceText(addressFromForm(el));
    };
  };

  const handleDeviceLocation = (el: HTMLElement) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError('Location is not available in this browser.');
      return;
    }
    setBusy('geo');
    setError('');
    const isCurrent = startLookup(el);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!isCurrent()) return;
        onChange({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setBusy('');
      },
      () => {
        if (!isCurrent()) return;
        setError(
          'Could not read your location. You can still save without a pin.'
        );
        setBusy('');
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 }
    );
  };

  const pinThisAddress = async (el: HTMLElement) => {
    const q = (address ?? addressFromForm(el)).trim();
    if (!q) {
      setError('Add a place or city first, then pin it.');
      return;
    }
    setBusy('addr');
    setError('');
    const isCurrent = startLookup(el);
    let pin: GeoPin | null = null;
    try {
      pin = await geocodeAddress(q, ipLocation.city);
    } catch {
      // A failed lookup is retryable and must not restore a previous pin.
    }
    if (!isCurrent()) return;
    if (!pin) {
      setError('Could not pin that address. Try Use my location.');
      return;
    }
    onChange(pin);
  };

  return (
    <div className='rounded-lg border border-border-light px-3 py-3 dark:border-border-dark/60'>
      <p className='font-inter text-sm font-medium'>{label}</p>
      <p className='mt-0.5 font-inter text-xs text-gray-500'>{hint}</p>
      {value ? (
        <p className='mt-2 font-inter text-sm text-gray-600 dark:text-gray-300'>
          Pinned · {value.latitude.toFixed(4)}, {value.longitude.toFixed(4)}
        </p>
      ) : (
        <p className='mt-2 font-inter text-sm text-gray-400'>No pin yet</p>
      )}
      <div className='mt-3 flex flex-wrap gap-2'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='min-h-11'
          disabled={disabled || !!busy}
          onClick={(e) => handleDeviceLocation(e.currentTarget)}
        >
          {busy === 'geo' ? 'Finding you…' : 'Use my location'}
        </Button>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='min-h-11'
          disabled={disabled || !!busy}
          onClick={(e) => void pinThisAddress(e.currentTarget)}
        >
          {busy === 'addr' ? 'Pinning…' : 'Pin this address'}
        </Button>
        {value && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='min-h-11'
            disabled={disabled}
            onClick={() => {
              requestId.current++;
              onChange(null);
              setBusy('');
              setError('');
            }}
          >
            Clear pin
          </Button>
        )}
      </div>
      {error && (
        <p className='mt-2 font-inter text-sm text-brand-orange'>{error}</p>
      )}
    </div>
  );
}
