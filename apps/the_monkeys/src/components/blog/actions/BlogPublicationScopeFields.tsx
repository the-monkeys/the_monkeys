'use client';

import { useMemo } from 'react';

import { SelectInputStyles } from '@/components/styles/SelectInputStyles';
import { useUserGroups } from '@/hooks/groups/useGroupQueries';
import {
  BlogPublicationSelection,
  activePublishGroups,
  effectiveBlogAudience,
} from '@/services/blog/blogPublication';
import { BlogAudience } from '@/services/blog/blogTypes';
import { GroupItem } from '@/services/groups/groupsTypes';
import { Label } from '@the-monkeys/ui/atoms/label';
import { RadioGroup, RadioGroupItem } from '@the-monkeys/ui/atoms/radio-group';
import { useTheme } from 'next-themes';
import Select, { SingleValue, StylesConfig } from 'react-select';

type GroupOption = {
  value: GroupItem;
  label: string;
};

type Props = {
  username?: string;
  value: BlogPublicationSelection;
  onChange: (selection: BlogPublicationSelection) => void;
};

export function BlogPublicationScopeFields({
  username,
  value,
  onChange,
}: Props) {
  const { resolvedTheme } = useTheme();
  const { data, isLoading } = useUserGroups(
    username,
    { limit: 100, offset: 0 },
    !!username
  );
  const options = useMemo<GroupOption[]>(
    () =>
      activePublishGroups(data?.groups).map((group) => ({
        value: group,
        label: group.name,
      })),
    [data?.groups]
  );
  const selectedOption =
    options.find((option) => option.value.slug === value.group?.slug) ?? null;
  const publicGroup = value.group?.visibility === 'public';

  const selectGroup = (option: SingleValue<GroupOption>) => {
    if (!option) {
      onChange({ group: null, audience: 'public' });
      return;
    }

    onChange({
      group: option.value,
      audience: effectiveBlogAudience(option.value, value.audience),
    });
  };

  const selectAudience = (audience: string) => {
    if (!value.group) return;
    onChange({
      group: value.group,
      audience: effectiveBlogAudience(value.group, audience as BlogAudience),
    });
  };

  return (
    <section className='space-y-4 rounded-xl border border-border-light p-4 dark:border-border-dark sm:p-5'>
      <div className='space-y-1'>
        <Label htmlFor='publication-group' className='font-dm_sans font-medium'>
          Publish to a group
        </Label>
        <p className='font-inter text-xs leading-relaxed text-gray-500'>
          Only active memberships are listed.
        </p>
      </div>

      <Select<GroupOption, false>
        inputId='publication-group'
        aria-label='Publish to a group'
        value={selectedOption}
        onChange={selectGroup}
        options={options}
        isClearable
        isSearchable
        isLoading={isLoading}
        isDisabled={!username}
        placeholder='No group'
        noOptionsMessage={() => 'No active groups found'}
        classNamePrefix='react-select'
        styles={
          SelectInputStyles(resolvedTheme === 'dark') as StylesConfig<
            GroupOption,
            false
          >
        }
      />

      {value.group && (
        <button
          type='button'
          onClick={() => selectGroup(null)}
          className='min-h-11 font-inter text-sm font-medium text-brand-orange underline-offset-4 hover:underline sm:min-h-0'
        >
          Remove group
        </button>
      )}

      {!isLoading && options.length === 0 && (
        <p className='font-inter text-sm text-gray-500'>
          You have no active group memberships.
        </p>
      )}

      {!value.group ? (
        <p className='rounded-lg bg-foreground-light/40 px-3 py-3 font-inter text-sm text-gray-600 dark:bg-foreground-dark/30 dark:text-gray-400'>
          This post will publish without a group.
        </p>
      ) : publicGroup ? (
        <div className='space-y-2'>
          <p className='font-dm_sans text-sm font-medium'>Who can read it?</p>
          <RadioGroup
            value={value.audience}
            onValueChange={selectAudience}
            className='grid grid-cols-1 gap-2 sm:grid-cols-2'
          >
            <Label
              htmlFor='publication-public'
              className='flex min-h-[68px] cursor-pointer items-start gap-3 rounded-lg border border-border-light p-3 dark:border-border-dark'
            >
              <RadioGroupItem
                id='publication-public'
                value='public'
                className='mt-0.5'
              />
              <span>
                <span className='block font-dm_sans text-sm font-semibold'>
                  Public
                </span>
                <span className='mt-0.5 block font-inter text-xs font-normal leading-relaxed text-gray-500'>
                  Anyone can discover and read this post.
                </span>
              </span>
            </Label>
            <Label
              htmlFor='publication-members'
              className='flex min-h-[68px] cursor-pointer items-start gap-3 rounded-lg border border-border-light p-3 dark:border-border-dark'
            >
              <RadioGroupItem
                id='publication-members'
                value='group_only'
                className='mt-0.5'
              />
              <span>
                <span className='block font-dm_sans text-sm font-semibold'>
                  Members only
                </span>
                <span className='mt-0.5 block font-inter text-xs font-normal leading-relaxed text-gray-500'>
                  Only active members of this group can read it.
                </span>
              </span>
            </Label>
          </RadioGroup>
        </div>
      ) : (
        <div className='rounded-lg border border-brand-orange/20 bg-brand-orange/10 p-3'>
          <p className='font-dm_sans text-sm font-semibold text-brand-orange'>
            Members only
          </p>
          <p className='mt-1 font-inter text-xs leading-relaxed text-gray-600 dark:text-gray-400'>
            Private and unlisted groups limit posts to active members.
          </p>
        </div>
      )}
    </section>
  );
}
