'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import Icon, { IconName } from '@/components/icon';
import { LOGIN_ROUTE } from '@/constants/routeConstants';
import {
  EventItem,
  REACTION_TYPES,
  ReactionType,
} from '@/services/events/eventTypes';
import {
  addReaction,
  eventError,
  removeReaction,
} from '@/services/events/eventsApi';
import { IUser } from '@/services/models/user';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';

// Each reaction maps to a Remix glyph. Line = idle, Fill = active — the Icon
// component appends the variant, so we only store the base name here.
const META: Record<ReactionType, { label: string; icon: IconName }> = {
  like: { label: 'Like', icon: 'RiThumbUp' },
  love: { label: 'Love', icon: 'RiHeart3' },
  celebrate: { label: 'Celebrate', icon: 'RiTrophy' },
  insightful: { label: 'Insight', icon: 'RiLightbulb' },
  curious: { label: 'Curious', icon: 'RiQuestion' },
};

export function EventReactions({
  event,
  session,
}: {
  event: EventItem;
  session?: IUser | null;
}) {
  const { toast } = useToast();
  const router = useRouter();

  // Seed counts from the server once; from then on the client owns them so the
  // UI updates instantly (optimistically) without waiting for the network.
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    const seed: Record<string, number> = {};
    for (const r of event.reactions || []) seed[r.reaction_type] = r.count;
    return seed;
  });
  const [mine, setMine] = useState<Record<string, boolean>>(() => {
    const seed: Record<string, boolean> = {};
    for (const t of event.viewer_reactions || []) seed[t] = true;
    return seed;
  });
  // Per-type in-flight guard: prevents a second request racing the first while
  // still keeping the other reactions fully interactive.
  const [pending, setPending] = useState<Record<string, boolean>>({});
  // Drives the one-shot pop animation; cleared on animationend so it retriggers.
  const [pop, setPop] = useState<string>('');

  const onToggle = async (type: ReactionType) => {
    if (!session) {
      router.push(LOGIN_ROUTE);
      return;
    }
    if (pending[type]) return;

    const wasOn = !!mine[type];
    const delta = wasOn ? -1 : 1;

    // --- Optimistic update: flip state + adjust count immediately. ---
    setMine((p) => ({ ...p, [type]: !wasOn }));
    setCounts((p) => ({ ...p, [type]: Math.max(0, (p[type] || 0) + delta) }));
    setPop(type);
    setPending((p) => ({ ...p, [type]: true }));

    try {
      // The backend is idempotent (ON CONFLICT DO NOTHING on add, plain DELETE
      // on remove), so a repeated add/remove never errors — the UI stays truthful.
      if (wasOn) await removeReaction(event.slug, type);
      else await addReaction(event.slug, type);
    } catch (err) {
      // Roll the optimistic change back only if the network genuinely failed.
      setMine((p) => ({ ...p, [type]: wasOn }));
      setCounts((p) => ({ ...p, [type]: Math.max(0, (p[type] || 0) - delta) }));
      toast({ title: 'Could not react', description: eventError(err) });
    } finally {
      setPending((p) => ({ ...p, [type]: false }));
    }
  };

  return (
    <div className='flex flex-wrap gap-2'>
      {REACTION_TYPES.map((type) => {
        const on = !!mine[type];
        const count = counts[type] || 0;
        return (
          <button
            key={type}
            type='button'
            aria-pressed={on}
            aria-label={META[type].label}
            onClick={() => onToggle(type)}
            className={`group inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-inter transition-colors ${
              on
                ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                : 'border-border-light text-text-light/70 hover:border-brand-orange hover:text-brand-orange dark:border-border-dark dark:text-text-dark/70'
            }`}
          >
            <span
              onAnimationEnd={() => setPop((c) => (c === type ? '' : c))}
              className={`inline-flex transition-transform duration-150 group-active:scale-90 ${
                on ? 'scale-110' : ''
              } ${pop === type ? 'animate-scale-up' : ''}`}
            >
              <Icon
                name={META[type].icon}
                type={on ? 'Fill' : 'Line'}
                size={16}
              />
            </span>
            <span className='font-medium'>{META[type].label}</span>
            {count > 0 && (
              <span className='tabular-nums opacity-80'>{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
