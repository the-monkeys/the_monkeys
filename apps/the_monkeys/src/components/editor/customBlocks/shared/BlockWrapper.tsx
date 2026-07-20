'use client';

import React, { type ReactNode } from 'react';

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
      className={`
        my-4 rounded-xl border
        border-slate-300/40 dark:border-slate-600/40
        bg-slate-50/60 dark:bg-slate-800/30
        p-4
        transition-colors duration-150
        ${readOnly ? '' : 'hover:border-slate-400/50 dark:hover:border-slate-500/50'}
        ${className}
      `.trim()}
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
    <span className='block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
      {children}
    </span>
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
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <SectionLabel>{label}</SectionLabel>
      {children}
    </label>
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
    <input
      ref={ref}
      className={`
        w-full rounded-lg border border-slate-300/50 bg-white px-3 py-2
        text-sm text-slate-800 placeholder-slate-400
        transition-colors
        focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20
        dark:border-slate-600/50 dark:bg-slate-900/60 dark:text-slate-100
        dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20
        ${className}
      `.trim()}
      {...props}
    />
  )
);
StyledInput.displayName = 'StyledInput';

export const StyledTextarea = React.forwardRef<
  HTMLTextAreaElement,
  StyledTextareaProps
>(({ className = '', ...props }, ref) => (
  <textarea
    ref={ref}
    className={`
      w-full rounded-lg border border-slate-300/50 bg-white px-3 py-2
      text-sm text-slate-800 placeholder-slate-400
      transition-colors resize-y min-h-[60px]
      focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20
      dark:border-slate-600/50 dark:bg-slate-900/60 dark:text-slate-100
      dark:placeholder-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20
      ${className}
    `.trim()}
    {...props}
  />
));
StyledTextarea.displayName = 'StyledTextarea';

/* ------------------------------------------------------------------ */
/*  StyledSelect                                                       */
/* ------------------------------------------------------------------ */

interface StyledSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const StyledSelect = React.forwardRef<
  HTMLSelectElement,
  StyledSelectProps
>(({ className = '', children, ...props }, ref) => (
  <select
    ref={ref}
    className={`
      w-full rounded-lg border border-slate-300/50 bg-white px-3 py-2
      text-sm text-slate-800
      transition-colors
      focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20
      dark:border-slate-600/50 dark:bg-slate-900/60 dark:text-slate-100
      dark:focus:border-blue-500 dark:focus:ring-blue-500/20
      ${className}
    `.trim()}
    {...props}
  >
    {children}
  </select>
));
StyledSelect.displayName = 'StyledSelect';

/* ------------------------------------------------------------------ */
/*  Badge — inline label for tags/stats                                */
/* ------------------------------------------------------------------ */

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const BADGE_VARIANTS: Record<string, string> = {
  default:
    'border-slate-300/50 bg-slate-100/60 text-slate-700 dark:border-slate-600/50 dark:bg-slate-800/60 dark:text-slate-300',
  success:
    'border-emerald-300/50 bg-emerald-50/60 text-emerald-700 dark:border-emerald-700/40 dark:bg-emerald-950/30 dark:text-emerald-300',
  warning:
    'border-amber-300/50 bg-amber-50/60 text-amber-700 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-300',
  danger:
    'border-red-300/50 bg-red-50/60 text-red-700 dark:border-red-700/40 dark:bg-red-950/30 dark:text-red-300',
  info: 'border-blue-300/50 bg-blue-50/60 text-blue-700 dark:border-blue-700/40 dark:bg-blue-950/30 dark:text-blue-300',
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5
        text-xs font-medium
        ${BADGE_VARIANTS[variant] || BADGE_VARIANTS.default}
      `.trim()}
    >
      {children}
    </span>
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
