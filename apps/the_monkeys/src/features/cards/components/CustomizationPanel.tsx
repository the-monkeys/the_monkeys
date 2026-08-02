'use client';

import { Label } from '@the-monkeys/ui/atoms/label';

import { ACCENT_PALETTE } from '../themes';
import { CardCustomization, CardFontFamily } from '../types';

export interface CustomizationPanelProps {
  customization: CardCustomization;
  onChange: (patch: Partial<CardCustomization>) => void;
}

const FONT_OPTIONS: { value: CardFontFamily; label: string }[] = [
  { value: 'inter', label: 'Inter' },
  { value: 'poppins', label: 'Poppins' },
  { value: 'playfair', label: 'Playfair Display' },
  { value: 'jetbrains', label: 'JetBrains Mono' },
  { value: 'georgia', label: 'Georgia' },
  { value: 'montserrat', label: 'Montserrat' },
  { value: 'raleway', label: 'Raleway' },
  { value: 'roboto-slab', label: 'Roboto Slab' },
];

const ToggleRow = ({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <label
    htmlFor={id}
    className='flex cursor-pointer items-center justify-between gap-3 rounded-md border border-input bg-background px-3 py-2'
  >
    <span className='flex flex-col'>
      <span className='text-sm font-medium'>{label}</span>
      {hint && <span className='text-xs text-foreground/50'>{hint}</span>}
    </span>
    <span className='relative inline-flex h-5 w-9 shrink-0 items-center'>
      <input
        id={id}
        type='checkbox'
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className='peer sr-only'
      />
      <span className='h-5 w-9 rounded-full bg-foreground/20 transition-colors peer-checked:bg-brand-orange' />
      <span className='absolute left-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4' />
    </span>
  </label>
);

const SelectRow = ({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) => (
  <div className='flex flex-col gap-1'>
    <Label htmlFor={id} className='text-xs'>
      {label}
    </Label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='h-9 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40'
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

const ColorSwatch = ({
  label,
  value,
  palette,
  onChange,
}: {
  label: string;
  value: string;
  palette: string[];
  onChange: (color: string) => void;
}) => (
  <div className='flex flex-col gap-1'>
    <Label className='text-xs'>{label}</Label>
    <div className='flex flex-wrap gap-1.5'>
      {palette.map((color) => {
        const selected = color.toLowerCase() === value.toLowerCase();
        return (
          <button
            key={color}
            type='button'
            onClick={() => onChange(color)}
            aria-label={`Color ${color}`}
            aria-pressed={selected}
            className='h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-orange/40'
            style={{
              backgroundColor: color,
              borderColor: selected ? '#000' : 'transparent',
              boxShadow: selected ? '0 0 0 2px white inset' : 'none',
            }}
          />
        );
      })}
      <label className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-dashed border-foreground/30 text-xs'>
        <input
          type='color'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className='h-0 w-0 opacity-0'
          aria-label={`Custom ${label}`}
        />
        +
      </label>
    </div>
  </div>
);

export const CustomizationPanel = ({
  customization: c,
  onChange,
}: CustomizationPanelProps) => (
  <div className='flex flex-col gap-4'>
    <ColorSwatch
      label='Accent Color'
      value={c.accentColor}
      palette={ACCENT_PALETTE}
      onChange={(accentColor) => onChange({ accentColor })}
    />

    <ColorSwatch
      label='Primary Color'
      value={c.primaryColor}
      palette={[
        '#0A0A0A',
        '#1A1A2E',
        '#2D3436',
        '#0D1B2A',
        '#1B4332',
        '#450A0A',
        '#3C1874',
        '#7C2D12',
      ]}
      onChange={(primaryColor) => onChange({ primaryColor })}
    />

    <SelectRow
      id='card-font'
      label='Font Family'
      value={c.fontFamily}
      options={FONT_OPTIONS}
      onChange={(v) => onChange({ fontFamily: v as CardFontFamily })}
    />

    <div className='grid grid-cols-2 gap-3'>
      <SelectRow
        id='card-font-size'
        label='Font Size'
        value={c.fontSize}
        options={[
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ]}
        onChange={(v) => onChange({ fontSize: v as 'sm' | 'md' | 'lg' })}
      />

      <SelectRow
        id='card-avatar-shape'
        label='Avatar Shape'
        value={c.avatarShape}
        options={[
          { value: 'circle', label: 'Circle' },
          { value: 'rounded', label: 'Rounded' },
          { value: 'square', label: 'Square' },
        ]}
        onChange={(v) =>
          onChange({ avatarShape: v as 'circle' | 'rounded' | 'square' })
        }
      />
    </div>

    <div className='grid grid-cols-2 gap-3'>
      <SelectRow
        id='card-logo-size'
        label='Logo Size'
        value={c.logoSize}
        options={[
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ]}
        onChange={(v) => onChange({ logoSize: v as 'sm' | 'md' | 'lg' })}
      />
    </div>

    <ToggleRow
      id='card-show-avatar'
      label='Profile Photo'
      hint='Show your profile picture on the card'
      checked={c.showAvatar !== false}
      onChange={(showAvatar) => onChange({ showAvatar })}
    />

    <ToggleRow
      id='card-show-qr'
      label='QR Code'
      hint='Adds a scannable code that saves your contact'
      checked={c.showQr}
      onChange={(showQr) => onChange({ showQr })}
    />
  </div>
);
