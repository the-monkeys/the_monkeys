'use client';

import { useState } from 'react';

import { GeoPin, geocodeAddress } from '@/lib/geoSearch';
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

  const useMyLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError('Location is not available in this browser.');
      return;
    }
    setBusy('geo');
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setBusy('');
      },
      () => {
        setError(
          'Could not read your location. You can still save without a pin.'
        );
        setBusy('');
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 60_000 }
    );
  };

  const pinThisAddress = async (el: HTMLElement) => {
    const q = (address || addressFromForm(el)).trim();
    if (!q) {
      setError('Add a place or city first, then pin it.');
      return;
    }
    setBusy('addr');
    setError('');
    const pin = await geocodeAddress(q);
    setBusy('');
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
          onClick={useMyLocation}
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
              onChange(null);
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
