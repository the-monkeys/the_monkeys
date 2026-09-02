'use client';

type TabItem<T extends string> = {
  id: T;
  label: string;
};

export function TextTabs<T extends string>({
  items,
  value,
  onChange,
  'aria-label': ariaLabel,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  'aria-label'?: string;
}) {
  return (
    <div
      role='tablist'
      aria-label={ariaLabel}
      className='mb-4 flex items-center gap-1 border-b border-border-light dark:border-border-dark'
    >
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type='button'
            role='tab'
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={`-mb-px min-h-[44px] border-b-2 px-3 font-inter text-sm transition-colors ${
              active
                ? 'border-brand-orange text-brand-orange'
                : 'border-transparent text-gray-500 hover:text-text-light dark:hover:text-text-dark'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
