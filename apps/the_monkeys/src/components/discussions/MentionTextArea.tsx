'use client';

import {
  type ComponentProps,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import { DiscussionAvatar } from '@/components/discussions/DiscussionAvatar';
import { useSearchPeopleV2 } from '@/hooks/search/useSearchV2';
import {
  type ActiveMention,
  activeMention,
  insertMention,
} from '@/lib/discussionMentions';
import { cn } from '@/lib/utils';
import { TextArea } from '@the-monkeys/ui/atoms/text-area';

const SEARCH_DELAY_MS = 250;
const SUGGESTION_LIMIT = 5;

type MentionTextAreaProps = Omit<
  ComponentProps<'textarea'>,
  'value' | 'onChange'
> & {
  value: string;
  onValueChange: (value: string) => void;
};

export function MentionTextArea({
  value,
  onValueChange,
  onKeyDown,
  ...props
}: MentionTextAreaProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [mention, setMention] = useState<ActiveMention | null>(null);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);

  const typed = mention?.query ?? '';
  useEffect(() => {
    const id = setTimeout(() => setQuery(typed), SEARCH_DELAY_MS);
    return () => clearTimeout(id);
  }, [typed]);

  const { users } = useSearchPeopleV2({
    query,
    limit: SUGGESTION_LIMIT,
    enabled: Boolean(mention) && query.length > 0,
    keepPrevious: true,
  });
  const options = mention && users ? users : [];
  const open = options.length > 0;
  const active = Math.min(highlight, options.length - 1);
  const optionId = (i: number) => `${listId}-option-${i}`;

  function sync(el: HTMLTextAreaElement) {
    const next = activeMention(el.value, el.selectionStart ?? el.value.length);
    if (next?.query !== mention?.query) setHighlight(0);
    setMention(next);
  }

  function choose(username: string) {
    if (!mention) return;
    const next = insertMention(value, mention, username);
    onValueChange(next.value);
    setMention(null);
    requestAnimationFrame(() => {
      const el = wrapperRef.current?.querySelector('textarea');
      el?.focus();
      el?.setSelectionRange(next.caret, next.caret);
    });
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const step = e.key === 'ArrowDown' ? 1 : -1;
        setHighlight((active + step + options.length) % options.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        choose(options[active].username);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setMention(null);
        return;
      }
    }
    onKeyDown?.(e);
  }

  return (
    <div className='relative' ref={wrapperRef}>
      <TextArea
        {...props}
        aria-activedescendant={open ? optionId(active) : undefined}
        aria-autocomplete='list'
        aria-controls={open ? listId : undefined}
        onBlur={() => setMention(null)}
        onChange={(e) => {
          onValueChange(e.target.value);
          sync(e.target);
        }}
        onKeyDown={handleKeyDown}
        onSelect={(e) => sync(e.currentTarget)}
        value={value}
      />
      {open ? (
        <ul
          aria-label='Suggested people'
          className='absolute inset-x-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-lg border border-border-light bg-background-light py-1 shadow-lg dark:border-border-dark dark:bg-background-dark'
          id={listId}
          role='listbox'
        >
          {options.map((person, i) => {
            const name =
              `${person.first_name ?? ''} ${person.last_name ?? ''}`.trim();
            return (
              <li
                aria-selected={i === active}
                className={cn(
                  'flex min-h-[44px] cursor-pointer items-center gap-2 px-3 py-1.5',
                  i === active &&
                    'bg-foreground-light/40 dark:bg-foreground-dark'
                )}
                id={optionId(i)}
                key={person.account_id}
                onClick={() => choose(person.username)}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setHighlight(i)}
                role='option'
              >
                <DiscussionAvatar small username={person.username} />
                <span className='min-w-0 font-inter'>
                  {name ? (
                    <span className='block truncate text-sm font-medium'>
                      {name}
                    </span>
                  ) : null}
                  <span className='block truncate text-xs text-gray-500'>
                    @{person.username}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
