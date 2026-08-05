'use client';

import { Input } from '@the-monkeys/ui/atoms/input';
import { Label } from '@the-monkeys/ui/atoms/label';

import { SocialLink, SocialNetwork } from '../types';

const NETWORK_OPTIONS: { value: SocialNetwork; label: string }[] = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'x', label: 'X / Twitter' },
  { value: 'github', label: 'GitHub' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'dribbble', label: 'Dribbble' },
  { value: 'behance', label: 'Behance' },
  { value: 'medium', label: 'Medium' },
  { value: 'monkeys', label: 'Monkeys' },
  { value: 'website', label: 'Other' },
];

export interface SocialLinkEditorProps {
  links: SocialLink[];
  onChange: (links: SocialLink[]) => void;
}

export const SocialLinkEditor = ({
  links,
  onChange,
}: SocialLinkEditorProps) => {
  const addLink = () => {
    if (links.length >= 6) return;
    onChange([...links, { network: 'linkedin', url: '' }]);
  };

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, patch: Partial<SocialLink>) => {
    onChange(links.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  };

  return (
    <div className='flex flex-col gap-3'>
      <Label className='text-xs'>Social Links</Label>

      {links.map((link, i) => (
        <div key={i} className='flex items-center gap-2'>
          <select
            value={link.network}
            onChange={(e) =>
              updateLink(i, { network: e.target.value as SocialNetwork })
            }
            className='h-9 rounded-md border border-input bg-background px-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/40'
          >
            {NETWORK_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <Input
            value={link.url}
            placeholder='https://...'
            className='flex-1'
            onChange={(e) => updateLink(i, { url: e.target.value })}
          />
          <button
            type='button'
            onClick={() => removeLink(i)}
            className='flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-input text-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive'
            aria-label='Remove link'
          >
            ×
          </button>
        </div>
      ))}

      {links.length < 6 && (
        <button
          type='button'
          onClick={addLink}
          className='flex h-9 items-center justify-center rounded-md border border-dashed border-foreground/30 text-sm text-foreground/60 transition-colors hover:border-foreground/50 hover:text-foreground'
        >
          + Add Social Link
        </button>
      )}
    </div>
  );
};
