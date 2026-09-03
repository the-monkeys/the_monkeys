'use client';

import { FormEvent, useState } from 'react';

import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import {
  useAddGroupRule,
  useDeleteGroupRule,
  useUpdateGroupRule,
} from '@/hooks/groups/useGroupQueries';
import { groupError } from '@/services/groups/groupsApi';
import { GroupRule } from '@/services/groups/groupsTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import { TextArea } from '@the-monkeys/ui/atoms/text-area';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

/**
 * Organizer surface for authoring group rules. Add, edit inline and delete;
 * ordering is driven by the numeric sort_order the organizer assigns.
 */
export function GroupRulesEditor({
  slug,
  rules,
}: {
  slug: string;
  rules?: GroupRule[];
}) {
  const { toast } = useToast();
  const add = useAddGroupRule(slug);
  const [adding, setAdding] = useState(false);

  const sorted = [...(rules || [])].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );

  const onAdd = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const title = String(form.get('title') || '').trim();
    if (!title) return;
    try {
      await add.mutateAsync({
        title,
        body: String(form.get('body') || '').trim(),
        sort_order: Number(form.get('sort_order') || 0) || sorted.length + 1,
      });
      toast({ title: 'Rule added' });
      formEl.reset();
      setAdding(false);
    } catch (err) {
      toast({ title: 'Could not add rule', description: groupError(err) });
    }
  };

  return (
    <section className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='font-dm_sans text-xl font-semibold'>Rules</h2>
        <Button
          size='sm'
          variant='outline'
          onClick={() => setAdding((v) => !v)}
        >
          {adding ? 'Close' : 'Add rule'}
        </Button>
      </div>

      {adding && (
        <form
          onSubmit={onAdd}
          className='space-y-2 rounded-lg border border-border-light p-4 dark:border-border-dark/60'
        >
          <Input
            name='title'
            required
            placeholder='Rule title'
            maxLength={120}
          />
          <TextArea name='body' rows={2} placeholder='Details (optional)' />
          <div className='flex items-center gap-2'>
            <Input
              name='sort_order'
              type='number'
              min={0}
              placeholder='Order'
              className='w-28'
            />
            <Button
              type='submit'
              size='sm'
              variant='brand'
              disabled={add.isPending}
            >
              Add
            </Button>
          </div>
        </form>
      )}

      {sorted.length === 0 ? (
        <p className='font-inter text-sm text-gray-500'>No rules yet.</p>
      ) : (
        <ul className='space-y-3'>
          {sorted.map((rule) => (
            <RuleRow key={rule.id} slug={slug} rule={rule} />
          ))}
        </ul>
      )}
    </section>
  );
}

function RuleRow({ slug, rule }: { slug: string; rule: GroupRule }) {
  const { toast } = useToast();
  const update = useUpdateGroupRule(slug);
  const remove = useDeleteGroupRule(slug);
  const [editing, setEditing] = useState(false);

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = String(form.get('title') || '').trim();
    if (!title) return;
    try {
      await update.mutateAsync({
        id: rule.id,
        body: {
          title,
          body: String(form.get('body') || '').trim(),
          sort_order:
            Number(form.get('sort_order') || 0) || rule.sort_order || 0,
        },
      });
      toast({ title: 'Rule updated' });
      setEditing(false);
    } catch (err) {
      toast({ title: 'Could not update rule', description: groupError(err) });
    }
  };

  const onDelete = async () => {
    try {
      await remove.mutateAsync(rule.id);
      toast({ title: 'Rule deleted' });
    } catch (err) {
      toast({ title: 'Could not delete rule', description: groupError(err) });
    }
  };

  if (editing) {
    return (
      <li className='rounded-lg border border-border-light p-4 dark:border-border-dark/60'>
        <form onSubmit={onSave} className='space-y-2'>
          <Input
            name='title'
            required
            defaultValue={rule.title}
            maxLength={120}
          />
          <TextArea name='body' rows={2} defaultValue={rule.body} />
          <div className='flex items-center gap-2'>
            <Input
              name='sort_order'
              type='number'
              min={0}
              defaultValue={rule.sort_order ?? 0}
              className='w-28'
            />
            <Button
              type='submit'
              size='sm'
              variant='brand'
              disabled={update.isPending}
            >
              Save
            </Button>
            <Button
              type='button'
              size='sm'
              variant='ghost'
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className='flex items-start justify-between gap-3 rounded-lg border border-border-light p-4 dark:border-border-dark/60'>
      <div className='min-w-0'>
        <p className='font-dm_sans font-semibold'>{rule.title}</p>
        {rule.body && (
          <p className='mt-0.5 font-inter text-sm text-gray-500'>{rule.body}</p>
        )}
      </div>
      <div className='flex shrink-0 items-center gap-1'>
        <Button size='sm' variant='ghost' onClick={() => setEditing(true)}>
          Edit
        </Button>
        <ConfirmDialog
          trigger={
            <Button size='sm' variant='ghost' className='text-alert-red'>
              Delete
            </Button>
          }
          title='Delete this rule?'
          description={rule.title}
          confirmLabel='Delete'
          destructive
          onConfirm={onDelete}
        />
      </div>
    </li>
  );
}
