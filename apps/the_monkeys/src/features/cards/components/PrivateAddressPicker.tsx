'use client';

import { useState } from 'react';

import { formatAddress } from '@/services/addresses/addressesApi';
import { UserAddressInput } from '@/services/addresses/addressesTypes';

import { useUserAddresses } from '../hooks/useUserAddresses';

const EMPTY_FORM: UserAddressInput = {
  label: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  is_default: false,
};

const inputCls =
  'w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/40';

/**
 * Manages the user's PRIVATE address book and lets them drop a saved address
 * onto the card. Addresses live server-side (owner-scoped) and are never shown
 * on the public profile; the card only stores the formatted display string.
 */
export const PrivateAddressPicker = ({
  selected,
  onSelect,
  onClear,
}: {
  selected?: string;
  onSelect: (formatted: string) => void;
  onClear: () => void;
}) => {
  const { addresses, isLoading, create, remove } = useUserAddresses();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<UserAddressInput>(EMPTY_FORM);

  const set = (patch: Partial<UserAddressInput>) =>
    setForm((f) => ({ ...f, ...patch }));

  const canSave = form.label.trim() !== '' && form.line1.trim() !== '';

  const handleSave = () => {
    if (!canSave) return;
    create.mutate(
      { ...form, label: form.label.trim(), line1: form.line1.trim() },
      {
        onSuccess: () => {
          setForm(EMPTY_FORM);
          setShowForm(false);
        },
      }
    );
  };

  const handleRemove = (id: string) => {
    if (!window.confirm('Remove this saved address?')) return;
    remove.mutate(id);
  };

  return (
    <div className='flex flex-col gap-3'>
      <p className='text-xs text-foreground/50'>
        Saved addresses are private — never shown on your public profile. Adding
        one to this card is optional; reuse it for billing or physical mail
        later.
      </p>

      {isLoading ? (
        <div className='h-10 animate-pulse rounded-md bg-foreground/5' />
      ) : addresses.length === 0 ? (
        <p className='text-xs text-foreground/40'>No saved addresses yet.</p>
      ) : (
        <ul className='flex flex-col gap-2'>
          {addresses.map((a) => (
            <li
              key={a.id}
              className='flex items-start justify-between gap-2 rounded-md border border-foreground/10 p-2'
            >
              <div className='min-w-0'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium'>{a.label}</span>
                  {a.is_default && (
                    <span className='rounded bg-foreground/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-foreground/60'>
                      Default
                    </span>
                  )}
                </div>
                <p className='truncate text-xs text-foreground/50'>
                  {formatAddress(a)}
                </p>
              </div>
              <div className='flex shrink-0 gap-2'>
                {formatAddress(a) === selected ? (
                  <button
                    type='button'
                    onClick={onClear}
                    className='text-xs font-medium text-brand-orange hover:opacity-80'
                  >
                    On card ✓
                  </button>
                ) : (
                  <button
                    type='button'
                    onClick={() => onSelect(formatAddress(a))}
                    className='text-xs text-foreground/60 hover:text-foreground'
                  >
                    Add to card
                  </button>
                )}
                <button
                  type='button'
                  onClick={() => handleRemove(a.id)}
                  className='text-xs text-foreground/60 hover:text-destructive'
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showForm ? (
        <div className='flex flex-col gap-2 rounded-md border border-foreground/10 p-3'>
          <input
            className={inputCls}
            placeholder='Label (e.g. Home, Office, Billing)'
            maxLength={60}
            value={form.label}
            onChange={(e) => set({ label: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder='Address line 1'
            maxLength={160}
            value={form.line1}
            onChange={(e) => set({ line1: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder='Address line 2 (optional)'
            maxLength={160}
            value={form.line2 ?? ''}
            onChange={(e) => set({ line2: e.target.value })}
          />
          <div className='grid grid-cols-2 gap-2'>
            <input
              className={inputCls}
              placeholder='City'
              maxLength={80}
              value={form.city ?? ''}
              onChange={(e) => set({ city: e.target.value })}
            />
            <input
              className={inputCls}
              placeholder='State / Province'
              maxLength={80}
              value={form.state ?? ''}
              onChange={(e) => set({ state: e.target.value })}
            />
            <input
              className={inputCls}
              placeholder='Postal code'
              maxLength={20}
              value={form.postal_code ?? ''}
              onChange={(e) => set({ postal_code: e.target.value })}
            />
            <input
              className={inputCls}
              placeholder='Country'
              maxLength={80}
              value={form.country ?? ''}
              onChange={(e) => set({ country: e.target.value })}
            />
          </div>
          <label className='flex items-center gap-2 text-xs text-foreground/60'>
            <input
              type='checkbox'
              checked={form.is_default ?? false}
              onChange={(e) => set({ is_default: e.target.checked })}
            />
            Set as default address
          </label>
          <div className='flex gap-2'>
            <button
              type='button'
              onClick={handleSave}
              disabled={!canSave || create.isPending}
              className='rounded-md bg-brand-orange px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50'
            >
              {create.isPending ? 'Saving…' : 'Save address'}
            </button>
            <button
              type='button'
              onClick={() => {
                setForm(EMPTY_FORM);
                setShowForm(false);
              }}
              className='text-xs text-foreground/60 hover:text-foreground'
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type='button'
          onClick={() => setShowForm(true)}
          className='self-start text-xs text-foreground/60 hover:text-foreground'
        >
          + Add address
        </button>
      )}
    </div>
  );
};
