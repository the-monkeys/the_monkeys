'use client';

import { SNAPSHOT_TEMPLATES } from '../registry';

export interface TemplatePickerProps {
  value: string;
  onChange: (templateId: string) => void;
}

const TemplateWireframe = ({ id }: { id: string }) => {
  switch (id) {
    case 'editorial-portrait':
      return (
        <div className='relative w-[44px] h-[55px] rounded border border-foreground/15 bg-background/80 overflow-hidden flex flex-col justify-between p-1 shadow-sm transition-all duration-200'>
          {/* Header */}
          <div className='flex items-center justify-between w-full border-b border-foreground/5 pb-0.5'>
            <div className='w-2 h-2 rounded-full bg-brand-orange/70' />
            <div className='w-4 h-0.5 bg-foreground/15 rounded-full' />
          </div>
          {/* Title Lines */}
          <div className='flex flex-col gap-0.5 w-full my-auto'>
            <div className='w-full h-1 bg-foreground/40 rounded-sm' />
            <div className='w-5/6 h-0.5 bg-foreground/20 rounded-sm' />
            <div className='w-4/6 h-0.5 bg-foreground/20 rounded-sm' />
          </div>
          {/* Accent indicator */}
          <div className='w-3 h-0.5 bg-brand-orange/60 rounded-full' />
        </div>
      );
    case 'editorial-serif':
      return (
        <div className='relative w-[44px] h-[55px] rounded border border-foreground/15 bg-background/80 overflow-hidden flex flex-col justify-between p-1 shadow-sm transition-all duration-200'>
          {/* Header */}
          <div className='flex items-center justify-between w-full border-b border-foreground/5 pb-0.5'>
            <div className='w-2 h-2 rounded-full bg-brand-orange/70' />
            <div className='w-4 h-0.5 bg-foreground/15 rounded-full' />
          </div>
          {/* Serif Title lines */}
          <div className='flex flex-col gap-0.5 w-full my-auto'>
            <div className='w-full h-1 bg-foreground/40 rounded-sm' />
            <div className='w-11/12 h-0.5 bg-foreground/25 rounded-sm' />
            <div className='w-3/4 h-0.5 bg-foreground/20 rounded-sm' />
          </div>
          {/* Footer bar */}
          <div className='w-5 h-0.5 bg-foreground/25 rounded-full' />
        </div>
      );
    case 'quote-card':
      return (
        <div className='relative w-[48px] h-[48px] rounded border border-foreground/15 bg-background/80 overflow-hidden flex flex-col justify-between p-1 shadow-sm transition-all duration-200'>
          <div className='flex justify-between w-full items-center'>
            <div className='w-1.5 h-1.5 rounded-full bg-brand-orange/75' />
            <span className='text-[16px] leading-[1] font-serif font-black text-brand-orange/80 -mt-1 select-none'>
              “
            </span>
          </div>
          {/* Centered quote lines */}
          <div className='flex flex-col gap-0.5 items-center w-full my-auto'>
            <div className='w-4/5 h-0.5 bg-foreground/35 rounded-sm' />
            <div className='w-3/5 h-0.5 bg-foreground/20 rounded-sm' />
          </div>
          <div className='w-3 h-0.5 bg-foreground/20 rounded-full self-end' />
        </div>
      );
    case 'thread-cover':
      return (
        <div className='relative w-[44px] h-[55px] rounded border border-foreground/15 bg-background/80 overflow-hidden flex flex-col justify-between p-1 shadow-sm transition-all duration-200'>
          <div className='w-3 h-1 bg-brand-orange/70 rounded-full' />
          <div className='flex flex-col gap-0.5 w-full my-auto'>
            <div className='w-full h-1 bg-foreground/45 rounded-sm' />
            <div className='w-full h-1 bg-foreground/45 rounded-sm' />
            <div className='w-2/3 h-0.5 bg-foreground/20 rounded-sm' />
          </div>
          <div className='w-4 h-0.5 bg-foreground/20 rounded-full' />
        </div>
      );
    case 'instagram-carousel':
      return (
        <div className='flex gap-0.5 items-center justify-center select-none isolate'>
          <div className='relative w-[30px] h-[38px] rounded-l border border-foreground/10 bg-background/40 overflow-hidden flex flex-col justify-between p-0.5 shadow-sm opacity-40 transition-all duration-200'>
            <div className='w-1.5 h-0.5 bg-foreground/10 rounded-full' />
            <div className='w-full h-0.5 bg-foreground/15 rounded-sm' />
            <div className='w-2 h-0.5 bg-foreground/10 rounded-full' />
          </div>
          <div className='relative w-[34px] h-[44px] rounded border border-foreground/20 bg-background/90 overflow-hidden flex flex-col justify-between p-1 shadow-md z-10 scale-105 transition-all duration-200'>
            <div className='w-2 h-0.5 bg-brand-orange/80 rounded-full' />
            <div className='flex flex-col gap-0.5 w-full my-auto'>
              <div className='w-full h-0.5 bg-foreground/40 rounded-sm' />
              <div className='w-5/6 h-0.5 bg-foreground/20 rounded-sm' />
            </div>
            <div className='flex justify-between items-center w-full'>
              <div className='w-2.5 h-0.5 bg-foreground/15 rounded-full' />
              <div className='flex gap-0.5'>
                <div className='w-0.5 h-0.5 rounded-full bg-brand-orange/60' />
                <div className='w-0.5 h-0.5 rounded-full bg-foreground/20' />
              </div>
            </div>
          </div>
          <div className='relative w-[30px] h-[38px] rounded-r border border-foreground/10 bg-background/40 overflow-hidden flex flex-col justify-between p-0.5 shadow-sm opacity-40 transition-all duration-200'>
            <div className='w-1.5 h-0.5 bg-foreground/10 rounded-full' />
            <div className='w-full h-0.5 bg-foreground/15 rounded-sm' />
            <div className='w-2 h-0.5 bg-foreground/10 rounded-full' />
          </div>
        </div>
      );
    case 'x-share':
      return (
        <div className='relative w-[60px] h-[34px] rounded border border-foreground/15 bg-background/80 overflow-hidden flex flex-col justify-between p-1 shadow-sm transition-all duration-200'>
          <div className='flex items-center gap-1'>
            <div className='w-1.5 h-1.5 rounded-full bg-brand-orange/70' />
            <div className='w-3 h-0.5 bg-foreground/15 rounded-full' />
          </div>
          <div className='flex flex-col gap-0.5 w-full my-auto'>
            <div className='w-11/12 h-0.5 bg-foreground/35 rounded-sm' />
            <div className='w-3/4 h-0.5 bg-foreground/20 rounded-sm' />
          </div>
          <div className='w-5 h-0.5 bg-foreground/20 rounded-full' />
        </div>
      );
    case 'linkedin-share':
      return (
        <div className='relative w-[60px] h-[31px] rounded border border-foreground/15 bg-background/80 overflow-hidden flex flex-col justify-between p-1 shadow-sm transition-all duration-200'>
          <div className='flex justify-between items-center w-full'>
            <div className='w-3 h-0.5 bg-brand-orange/60 rounded-full' />
            <div className='w-1.5 h-1.5 rounded-full bg-foreground/20' />
          </div>
          <div className='flex flex-col gap-0.5 w-full my-auto'>
            <div className='w-5/6 h-0.5 bg-foreground/35 rounded-sm' />
            <div className='w-4/6 h-0.5 bg-foreground/20 rounded-sm' />
          </div>
          <div className='w-4 h-0.5 bg-foreground/20 rounded-full' />
        </div>
      );
    case 'story-vertical':
      return (
        <div className='relative w-[32px] h-[56px] rounded border border-foreground/15 bg-background/80 overflow-hidden flex flex-col justify-between p-1 shadow-sm transition-all duration-200'>
          <div className='w-2 h-2 rounded-full bg-brand-orange/70 self-center' />
          <div className='flex flex-col gap-0.5 w-full my-auto items-center'>
            <div className='w-11/12 h-0.5 bg-foreground/35 rounded-sm' />
            <div className='w-4/5 h-0.5 bg-foreground/25 rounded-sm' />
            <div className='w-3/5 h-0.5 bg-foreground/20 rounded-sm' />
          </div>
          <div className='w-3 h-0.5 bg-foreground/20 rounded-full self-center' />
        </div>
      );
    default:
      return (
        <div className='relative w-[40px] h-[40px] rounded border border-foreground/15 bg-background/80 overflow-hidden flex items-center justify-center p-1 shadow-sm transition-all duration-200'>
          <div className='w-4 h-4 rounded-sm bg-brand-orange/30' />
        </div>
      );
  }
};

export const TemplatePicker = ({ value, onChange }: TemplatePickerProps) => {
  return (
    <div className='grid grid-cols-2 gap-2.5 w-full'>
      {SNAPSHOT_TEMPLATES.map((tpl) => {
        const selected = tpl.id === value;
        return (
          <button
            key={tpl.id}
            type='button'
            onClick={() => onChange(tpl.id)}
            className={`group flex flex-col h-[184px] items-stretch rounded-xl border bg-background overflow-hidden text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 ${
              selected
                ? 'border-brand-orange ring-1 ring-brand-orange/20 shadow-sm bg-brand-orange/[0.02]'
                : 'border-border-light/60 dark:border-border-dark/60 hover:border-brand-orange/40 hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5'
            }`}
          >
            {/* Visual Preview Wireframe */}
            <div className='h-[82px] bg-foreground-light/10 dark:bg-foreground-dark/20 flex items-center justify-center border-b border-border-light/40 dark:border-border-dark/40 shrink-0 p-2'>
              <TemplateWireframe id={tpl.id} />
            </div>

            {/* Label and Info */}
            <div className='p-2.5 flex flex-col justify-between flex-1 min-w-0'>
              <div className='flex flex-col gap-0.5 min-w-0'>
                <span
                  className={`text-[13px] font-semibold tracking-tight truncate transition-colors ${selected ? 'text-brand-orange' : 'text-foreground'}`}
                >
                  {tpl.label}
                </span>
                <span className='text-[10px] text-foreground/50 leading-normal line-clamp-2'>
                  {tpl.description}
                </span>
              </div>
              <div className='flex items-center justify-between mt-1 text-[9px] font-medium'>
                <span className='font-mono text-foreground/40 bg-foreground-light/40 dark:bg-foreground-dark/50 px-1 py-0 rounded border border-border-light/20 dark:border-border-dark/20 shrink-0'>
                  {tpl.aspect}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
