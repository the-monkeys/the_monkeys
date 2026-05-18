'use client';

import { Input } from '@the-monkeys/ui/atoms/input';
import { Label } from '@the-monkeys/ui/atoms/label';
import { TextArea } from '@the-monkeys/ui/atoms/text-area';

import { SnapshotInput } from '../types';

export interface OptionsPanelProps {
  input: SnapshotInput;
  onChange: (patch: Partial<SnapshotInput>) => void;
}

export const OptionsPanel = ({ input, onChange }: OptionsPanelProps) => {
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-col gap-1'>
        <Label htmlFor='snap-title' className='text-xs'>
          Title
        </Label>
        <Input
          id='snap-title'
          value={input.title}
          maxLength={240}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>

      <div className='flex flex-col gap-1'>
        <Label htmlFor='snap-description' className='text-xs'>
          Description
        </Label>
        <TextArea
          id='snap-description'
          value={input.description ?? ''}
          maxLength={600}
          rows={3}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>

      <div className='flex flex-col gap-1'>
        <Label htmlFor='snap-quote' className='text-xs'>
          Pull-quote (used by quote templates)
        </Label>
        <TextArea
          id='snap-quote'
          value={input.quote ?? ''}
          maxLength={280}
          rows={2}
          onChange={(e) => onChange({ quote: e.target.value })}
        />
      </div>
    </div>
  );
};
