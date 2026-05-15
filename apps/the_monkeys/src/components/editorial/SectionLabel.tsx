import { cn } from '@/lib/utils';

/**
 * Uppercase, tracked-out label used as a divider header between feed sections.
 * Renders a thin top rule for visual separation.
 *
 * Example: <SectionLabel>Weekly Analysis</SectionLabel>
 */
export const SectionLabel = ({
  children,
  className,
  as: Tag = 'h2',
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'h2' | 'h3' | 'p';
}) => {
  return (
    <div
      className={cn(
        'border-t border-border-light dark:border-border-dark/40 pt-4 mt-8 mb-4',
        className
      )}
    >
      <Tag className='font-inter font-extrabold text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-[0.22em]'>
        {children}
      </Tag>
    </div>
  );
};

export default SectionLabel;
