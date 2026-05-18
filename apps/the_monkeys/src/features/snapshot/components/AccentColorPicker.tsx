'use client';

import { ACCENT_PALETTE } from '../themes';

export interface AccentColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export const AccentColorPicker = ({
  value,
  onChange,
}: AccentColorPickerProps) => {
  return (
    <div className='flex flex-wrap gap-2'>
      {ACCENT_PALETTE.map((color) => {
        const selected = color.toLowerCase() === value.toLowerCase();
        return (
          <button
            key={color}
            type='button'
            onClick={() => onChange(color)}
            aria-label={`Accent ${color}`}
            aria-pressed={selected}
            className='h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-orange/40'
            style={{
              backgroundColor: color,
              borderColor: selected ? '#000' : 'transparent',
              boxShadow: selected ? '0 0 0 2px white inset' : 'none',
            }}
          />
        );
      })}
      <label className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-dashed border-foreground/30 text-xs'>
        <input
          type='color'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className='h-0 w-0 opacity-0'
          aria-label='Custom accent color'
        />
        +
      </label>
    </div>
  );
};
