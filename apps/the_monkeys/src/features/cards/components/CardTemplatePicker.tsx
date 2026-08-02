'use client';

import { Label } from '@the-monkeys/ui/atoms/label';

import { CARD_TEMPLATES } from '../registry';

export interface CardTemplatePickerProps {
  value: string;
  onChange: (templateId: string) => void;
}

export const CardTemplatePicker = ({
  value,
  onChange,
}: CardTemplatePickerProps) => (
  <div className='flex flex-col gap-2'>
    <Label className='text-xs'>Template</Label>
    <div className='grid grid-cols-2 gap-2'>
      {CARD_TEMPLATES.map((tpl) => {
        const selected = tpl.id === value;
        return (
          <button
            key={tpl.id}
            type='button'
            onClick={() => onChange(tpl.id)}
            className={`flex flex-col items-start gap-1 rounded-lg border p-3 text-left text-sm transition-all ${
              selected
                ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange/30'
                : 'border-foreground/10 hover:border-foreground/30'
            }`}
          >
            <span className='font-medium'>{tpl.label}</span>
            <span className='text-xs text-foreground/50 line-clamp-2'>
              {tpl.description}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);
