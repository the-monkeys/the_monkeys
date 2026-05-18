'use client';

import { SNAPSHOT_TEMPLATES } from '../registry';

export interface TemplatePickerProps {
  value: string;
  onChange: (templateId: string) => void;
}

export const TemplatePicker = ({ value, onChange }: TemplatePickerProps) => {
  return (
    <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
      {SNAPSHOT_TEMPLATES.map((tpl) => {
        const selected = tpl.id === value;
        return (
          <button
            key={tpl.id}
            type='button'
            onClick={() => onChange(tpl.id)}
            className='group flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange/40'
            style={{
              borderColor: selected ? '#FF5542' : 'rgba(127,127,127,0.3)',
              backgroundColor: selected ? '#FF55420F' : 'transparent',
            }}
          >
            <div className='flex w-full items-center justify-between'>
              <span className='text-sm font-semibold'>{tpl.label}</span>
              <span className='font-mono text-[10px] text-foreground/50'>
                {tpl.aspect}
              </span>
            </div>
            <span className='text-xs text-foreground/60'>
              {tpl.description}
            </span>
          </button>
        );
      })}
    </div>
  );
};
