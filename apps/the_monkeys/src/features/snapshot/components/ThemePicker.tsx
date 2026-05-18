'use client';

import { SNAPSHOT_THEMES } from '../themes';

export interface ThemePickerProps {
  value: string;
  onChange: (themeId: string) => void;
}

export const ThemePicker = ({ value, onChange }: ThemePickerProps) => {
  return (
    <div className='flex flex-wrap gap-2'>
      {SNAPSHOT_THEMES.map((theme) => {
        const selected = theme.id === value;
        return (
          <button
            key={theme.id}
            type='button'
            onClick={() => onChange(theme.id)}
            className='flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange/40'
            style={{
              borderColor: selected ? theme.accent : 'rgba(127,127,127,0.3)',
              backgroundColor: selected ? `${theme.accent}10` : 'transparent',
            }}
          >
            <span
              className='h-4 w-4 rounded-full border'
              style={{
                backgroundColor: theme.background,
                backgroundImage: theme.backgroundImage,
                borderColor: theme.border,
              }}
            />
            <span className='font-medium'>{theme.label}</span>
          </button>
        );
      })}
    </div>
  );
};
