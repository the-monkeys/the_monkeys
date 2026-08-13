'use client';

import React, { type ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { Badge as UiBadge } from '@the-monkeys/ui/atoms/badge';
import { Input } from '@the-monkeys/ui/atoms/input';
import { Label } from '@the-monkeys/ui/atoms/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@the-monkeys/ui/atoms/select';
import { TextArea } from '@the-monkeys/ui/atoms/text-area';

/* ------------------------------------------------------------------ */
/*  BlockWrapper — consistent container for all custom blocks          */
/*  Uses Tailwind classes so dark mode & theming are inherited         */
/* ------------------------------------------------------------------ */

interface BlockWrapperProps {
  /** Unique block ID (for data attributes) */
  blockId?: string;
  /** Main content */
  children: ReactNode;
  /** Extra classes to merge onto the outer section */
  className?: string;
  /** Whether this is a read-only view */
  readOnly?: boolean;
}

export function BlockWrapper({
  blockId,
  children,
  className = '',
  readOnly = false,
}: BlockWrapperProps) {
  return (
    <section
      data-block-wrapper
      data-readonly={readOnly ? 'true' : undefined}
      id={blockId}
      className={cn(
        'my-4 rounded-xl border',
        'border-slate-300/40 dark:border-slate-600/40',
        'bg-slate-50/60 dark:bg-slate-800/30',
        'p-4',
        'transition-colors duration-150',
        !readOnly && 'hover:border-slate-400/50 dark:hover:border-slate-500/50',
        className
      )}
    >
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  SectionLabel — small uppercase label for form sections             */
/* ------------------------------------------------------------------ */

interface SectionLabelProps {
  children: ReactNode;
}

export function SectionLabel({ children }: SectionLabelProps) {
  return (
    <Label className='block text-xs font-semibold uppercase tracking-wider'>
      {children}
    </Label>
  );
}

/* ------------------------------------------------------------------ */
/*  FormField — labeled input/textarea wrapper                         */
/* ------------------------------------------------------------------ */

interface FormFieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ label, children, className = '' }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <SectionLabel>{label}</SectionLabel>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  StyledInput / StyledTextarea                                       */
/* ------------------------------------------------------------------ */

interface StyledInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}
interface StyledTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const StyledInput = React.forwardRef<HTMLInputElement, StyledInputProps>(
  ({ className = '', ...props }, ref) => (
    <Input ref={ref} className={cn('text-sm', className)} {...props} />
  )
);
StyledInput.displayName = 'StyledInput';

export const StyledTextarea = React.forwardRef<
  HTMLTextAreaElement,
  StyledTextareaProps
>(({ className = '', ...props }, ref) => (
  <TextArea ref={ref} className={cn('text-sm', className)} {...props} />
));
StyledTextarea.displayName = 'StyledTextarea';

/* ------------------------------------------------------------------ */
/*  StyledSelect — thin adapter over the Select atom for call sites    */
/*  that only need a flat list of value/label options.                 */
/* ------------------------------------------------------------------ */

interface StyledSelectOption {
  value: string;
  label: string;
}

interface StyledSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: StyledSelectOption[];
  placeholder?: string;
  className?: string;
}

export function StyledSelect({
  value,
  onValueChange,
  options,
  placeholder,
  className = '',
}: StyledSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn('h-10 text-sm', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ------------------------------------------------------------------ */
/*  Badge — inline label for tags/stats                                */
/* ------------------------------------------------------------------ */

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const BADGE_VARIANT_CLASSES: Record<string, string> = {
  default: '',
  success:
    'border-emerald-300/50 bg-emerald-50/60 text-emerald-700 dark:border-emerald-700/40 dark:bg-emerald-950/30 dark:text-emerald-300',
  warning:
    'border-amber-300/50 bg-amber-50/60 text-amber-700 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-300',
  danger: '',
  info: 'border-blue-300/50 bg-blue-50/60 text-blue-700 dark:border-blue-700/40 dark:bg-blue-950/30 dark:text-blue-300',
};

const BADGE_UI_VARIANT: Record<
  string,
  'default' | 'secondary' | 'outline' | 'destructive' | 'brand'
> = {
  default: 'secondary',
  success: 'outline',
  warning: 'outline',
  danger: 'destructive',
  info: 'outline',
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <UiBadge
      variant={BADGE_UI_VARIANT[variant] || 'secondary'}
      className={cn('text-xs font-medium', BADGE_VARIANT_CLASSES[variant])}
    >
      {children}
    </UiBadge>
  );
}

/* ------------------------------------------------------------------ */
/*  EmptyState — shown when a block has no data                        */
/* ------------------------------------------------------------------ */

interface EmptyStateProps {
  message: string;
  icon?: string;
}

export function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center gap-2 py-8 text-center'>
      {icon && (
        <span
          className='text-2xl opacity-40'
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      )}
      <p className='text-sm text-slate-400 dark:text-slate-500'>{message}</p>
    </div>
  );
}
