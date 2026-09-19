'use client';

import { useMemo } from 'react';

import type { SocialAccount, SocialPlatform } from '@/features/studio/types';
import {
  RiBookmarkLine,
  RiChat1Line,
  RiEyeLine,
  RiHeart3Line,
  RiMoreFill,
  RiRepeatLine,
  RiShareForwardLine,
  RiThumbUpLine,
  RiVerifiedBadgeFill,
} from '@remixicon/react';

import { PLATFORM_DEFINITIONS } from './PlatformSelector';
import type { ComposerMedia } from './composerStore';

interface SocialPlatformPreviewProps {
  platform: SocialPlatform;
  text: string;
  media: ComposerMedia[];
  account?: SocialAccount;
  allSelectedPlatforms: SocialPlatform[];
  onSelectPlatform: (platform: SocialPlatform) => void;
}

export default function SocialPlatformPreview({
  platform,
  text,
  media,
  account,
  allSelectedPlatforms,
  onSelectPlatform,
}: SocialPlatformPreviewProps) {
  const definition =
    PLATFORM_DEFINITIONS.find((p) => p.id === platform) ??
    PLATFORM_DEFINITIONS[0];
  const charLimit = definition.limit;
  const isOverLimit = text.length > charLimit;

  const displayName = account?.display_name || 'Your Brand';
  const handle = account?.handle || 'yourhandle';

  // Highlight hashtags, mentions, and links in preview
  const formattedText = useMemo(() => {
    if (!text) return null;
    const parts = text.split(/(\s+)/);
    return parts.map((part, idx) => {
      if (part.startsWith('#') && part.length > 1) {
        return (
          <span key={idx} className='text-blue-500 font-medium'>
            {part}
          </span>
        );
      }
      if (part.startsWith('@') && part.length > 1) {
        return (
          <span key={idx} className='text-blue-500 font-medium'>
            {part}
          </span>
        );
      }
      if (part.startsWith('http://') || part.startsWith('https://')) {
        return (
          <span
            key={idx}
            className='text-blue-500 underline underline-offset-2'
          >
            {part}
          </span>
        );
      }
      return part;
    });
  }, [text]);

  return (
    <div className='flex flex-col rounded-2xl border border-border-light bg-background-light p-4 dark:border-border-dark/60 dark:bg-background-dark shadow-sm'>
      {/* Preview Header & Platform Switcher */}
      <div className='flex items-center justify-between border-b border-border-light pb-3 dark:border-border-dark/60'>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-semibold uppercase tracking-wider text-foreground/50'>
            Live Preview
          </span>
          <span className='rounded bg-brand-orange/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand-orange'>
            {definition.label}
          </span>
        </div>

        {/* Platform Quick Toggle in Preview */}
        {allSelectedPlatforms.length > 1 && (
          <div className='flex items-center gap-1'>
            {allSelectedPlatforms.map((pId) => {
              const pDef = PLATFORM_DEFINITIONS.find((p) => p.id === pId);
              if (!pDef) return null;
              const PIcon = pDef.icon;
              const isCurrent = pId === platform;
              return (
                <button
                  key={pId}
                  type='button'
                  onClick={() => onSelectPlatform(pId)}
                  title={`Preview for ${pDef.label}`}
                  className={`flex h-6 w-6 items-center justify-center rounded-md transition-all ${
                    isCurrent
                      ? 'bg-foreground-light text-foreground dark:bg-foreground-dark'
                      : 'text-foreground/40 hover:text-foreground'
                  }`}
                >
                  <PIcon
                    size={13}
                    className={isCurrent ? pDef.color : 'text-inherit'}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Character Limit Gauge */}
      <div className='py-2.5'>
        <div className='flex items-center justify-between text-xs'>
          <span className='text-foreground/50 text-[11px]'>
            Character count
          </span>
          <span
            className={`font-mono text-xs font-semibold ${
              isOverLimit ? 'text-alert-red' : 'text-foreground/70'
            }`}
          >
            {text.length} / {charLimit}
          </span>
        </div>
        <div className='mt-1 h-1 w-full overflow-hidden rounded-full bg-foreground-light/30 dark:bg-foreground-dark/30'>
          <div
            className={`h-full transition-all duration-200 ${
              isOverLimit
                ? 'bg-alert-red'
                : text.length > charLimit * 0.9
                  ? 'bg-amber-500'
                  : 'bg-brand-orange'
            }`}
            style={{
              width: `${Math.min(100, (text.length / charLimit) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Platform Mockup Surface */}
      <div className='mt-2 flex-1 rounded-xl border border-border-light/70 bg-white p-4 text-zinc-900 dark:border-border-dark/50 dark:bg-zinc-950 dark:text-zinc-100'>
        {/* X / Twitter Mockup */}
        {platform === 'x' && (
          <div className='space-y-3 text-xs sm:text-sm'>
            <div className='flex items-start gap-3'>
              <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-800 font-bold text-white text-xs'>
                {displayName.charAt(0)}
              </div>
              <div className='min-w-0 flex-1 leading-tight'>
                <div className='flex items-center gap-1'>
                  <span className='font-bold truncate text-zinc-900 dark:text-zinc-100'>
                    {displayName}
                  </span>
                  <RiVerifiedBadgeFill
                    size={14}
                    className='text-blue-400 shrink-0'
                  />
                  <span className='text-zinc-500 text-xs truncate'>
                    @{handle}
                  </span>
                  <span className='text-zinc-500 text-xs'>· 1m</span>
                </div>
                <div className='mt-2 whitespace-pre-wrap leading-relaxed text-zinc-800 dark:text-zinc-200'>
                  {formattedText || (
                    <span className='text-zinc-400 italic'>
                      Preview will appear here...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Media Rendering */}
            {media.length > 0 && (
              <div
                className={`overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 ${
                  media.length === 1 ? 'grid-cols-1' : 'grid grid-cols-2 gap-1'
                }`}
              >
                {media.slice(0, 4).map((m) => (
                  <img
                    key={m.id}
                    src={m.url}
                    alt={m.name}
                    className='aspect-video w-full object-cover'
                  />
                ))}
              </div>
            )}

            {/* Twitter Action Bar */}
            <div className='flex items-center justify-between border-t border-zinc-100 pt-2 text-zinc-400 dark:border-zinc-900 text-xs'>
              <div className='flex items-center gap-1 hover:text-blue-500'>
                <RiChat1Line size={14} />
                <span>12</span>
              </div>
              <div className='flex items-center gap-1 hover:text-green-500'>
                <RiRepeatLine size={14} />
                <span>4</span>
              </div>
              <div className='flex items-center gap-1 hover:text-red-500'>
                <RiHeart3Line size={14} />
                <span>48</span>
              </div>
              <div className='flex items-center gap-1 hover:text-blue-500'>
                <RiEyeLine size={14} />
                <span>1.2K</span>
              </div>
              <RiShareForwardLine size={14} />
            </div>
          </div>
        )}

        {/* LinkedIn Mockup */}
        {platform === 'linkedin' && (
          <div className='space-y-3 text-xs sm:text-sm'>
            <div className='flex items-start justify-between'>
              <div className='flex items-center gap-2.5'>
                <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0A66C2] font-bold text-white text-xs'>
                  {displayName.charAt(0)}
                </div>
                <div>
                  <h4 className='font-bold leading-tight text-zinc-900 dark:text-zinc-100'>
                    {displayName}
                  </h4>
                  <p className='text-[11px] text-zinc-500'>
                    Creator at Monkeys • 1st
                  </p>
                  <p className='text-[10px] text-zinc-400'>Just now • 🌐</p>
                </div>
              </div>
              <RiMoreFill size={16} className='text-zinc-400' />
            </div>

            <div className='whitespace-pre-wrap leading-relaxed text-zinc-800 dark:text-zinc-200'>
              {formattedText || (
                <span className='text-zinc-400 italic'>
                  Preview will appear here...
                </span>
              )}
            </div>

            {media.length > 0 && (
              <div className='overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800'>
                <img
                  src={media[0].url}
                  alt={media[0].name}
                  className='max-h-64 w-full object-cover'
                />
              </div>
            )}

            <div className='flex items-center justify-around border-t border-zinc-100 pt-2 text-zinc-600 dark:border-zinc-900 dark:text-zinc-400 text-xs font-semibold'>
              <div className='flex items-center gap-1.5 hover:text-[#0A66C2]'>
                <RiThumbUpLine size={15} />
                <span>Like</span>
              </div>
              <div className='flex items-center gap-1.5 hover:text-[#0A66C2]'>
                <RiChat1Line size={15} />
                <span>Comment</span>
              </div>
              <div className='flex items-center gap-1.5 hover:text-[#0A66C2]'>
                <RiRepeatLine size={15} />
                <span>Repost</span>
              </div>
              <div className='flex items-center gap-1.5 hover:text-[#0A66C2]'>
                <RiShareForwardLine size={15} />
                <span>Send</span>
              </div>
            </div>
          </div>
        )}

        {/* Instagram Mockup */}
        {platform === 'instagram' && (
          <div className='space-y-2.5 text-xs sm:text-sm'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-500 to-pink-500 p-0.5 text-white'>
                  <div className='h-full w-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-900 dark:text-white'>
                    {displayName.charAt(0)}
                  </div>
                </div>
                <span className='font-bold text-xs'>{handle}</span>
              </div>
              <RiMoreFill size={16} className='text-zinc-400' />
            </div>

            {/* Instagram Media Container */}
            <div className='overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900'>
              {media.length > 0 ? (
                <img
                  src={media[0].url}
                  alt={media[0].name}
                  className='aspect-square w-full object-cover'
                />
              ) : (
                <div className='flex aspect-square w-full items-center justify-center text-xs text-zinc-400'>
                  Add media to preview Instagram post
                </div>
              )}
            </div>

            <div className='flex items-center justify-between pt-1'>
              <div className='flex items-center gap-3 text-zinc-800 dark:text-zinc-200'>
                <RiHeart3Line size={18} />
                <RiChat1Line size={18} />
                <RiShareForwardLine size={18} />
              </div>
              <RiBookmarkLine
                size={18}
                className='text-zinc-800 dark:text-zinc-200'
              />
            </div>

            <p className='leading-tight text-xs text-zinc-800 dark:text-zinc-200'>
              <strong className='mr-1'>{handle}</strong>
              {formattedText || (
                <span className='text-zinc-400 italic'>Caption...</span>
              )}
            </p>
          </div>
        )}

        {/* Facebook / YouTube / TikTok Generic Mockup */}
        {['facebook', 'youtube', 'tiktok'].includes(platform) && (
          <div className='space-y-3 text-xs sm:text-sm'>
            <div className='flex items-center gap-2.5'>
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-white text-xs ${definition.activeBg.split(' ')[0]}`}
              >
                {displayName.charAt(0)}
              </div>
              <div>
                <h4 className='font-bold leading-tight'>{displayName}</h4>
                <p className='text-[10px] text-zinc-400'>
                  Just now • {definition.label}
                </p>
              </div>
            </div>

            <div className='whitespace-pre-wrap leading-relaxed text-zinc-800 dark:text-zinc-200'>
              {formattedText || (
                <span className='text-zinc-400 italic'>Post preview...</span>
              )}
            </div>

            {media.length > 0 && (
              <div className='overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800'>
                <img
                  src={media[0].url}
                  alt={media[0].name}
                  className='aspect-video w-full object-cover'
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
