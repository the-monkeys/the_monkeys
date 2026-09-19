'use client';

import { useCallback, useMemo } from 'react';

import type { SocialPlatform } from '@/features/studio/types';
import {
  RiCloseLine,
  RiExternalLinkLine,
  RiGitForkLine,
  RiGlobalLine,
  RiLinkM,
  RiRestartLine,
} from '@remixicon/react';

import { PLATFORM_DEFINITIONS } from './PlatformSelector';
import type { ComposerMedia } from './composerStore';

interface RichComposerEditorProps {
  activeTab: 'base' | SocialPlatform;
  selectedPlatforms?: SocialPlatform[];
  baseText: string;
  overrides: Record<string, string>;
  isSynced: Record<string, boolean>;
  onChangeBaseText: (text: string) => void;
  onChangeOverride: (platform: SocialPlatform, text: string) => void;
  onUnsync: (platform: SocialPlatform) => void;
  onResetToBase: (platform: SocialPlatform) => void;
  onAddMedia: (media: ComposerMedia[]) => void;
  disabled?: boolean;
}

// Regex to detect first URL in text
const URL_REGEX = /(https?:\/\/[^\s]+)/i;

export default function RichComposerEditor({
  activeTab,
  selectedPlatforms,
  baseText,
  overrides,
  isSynced,
  onChangeBaseText,
  onChangeOverride,
  onUnsync,
  onResetToBase,
  onAddMedia,
  disabled = false,
}: RichComposerEditorProps) {
  const currentText =
    activeTab === 'base' ? baseText : overrides[activeTab] ?? baseText;

  // Link preview detection
  const detectedUrl = useMemo(() => {
    const match = currentText.match(URL_REGEX);
    if (!match) return null;
    try {
      const cleanUrl = match[0].replace(/[.,!?;:\])}]+$/, '');
      const parsed = new URL(cleanUrl);
      return {
        url: cleanUrl,
        hostname: parsed.hostname.replace(/^www\./, ''),
      };
    } catch {
      return null;
    }
  }, [currentText]);

  // Paste anywhere handler for images/videos
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const mediaToAdd: ComposerMedia[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/') || item.type.startsWith('video/')) {
          const file = item.getAsFile();
          if (file) {
            const url = URL.createObjectURL(file);
            mediaToAdd.push({
              id: `paste-${Date.now()}-${i}`,
              url,
              name: file.name || `Pasted ${item.type.split('/')[0]}`,
              mime_type: item.type,
              size_bytes: file.size,
            });
          }
        }
      }

      if (mediaToAdd.length > 0) {
        onAddMedia(mediaToAdd);
      }
    },
    [onAddMedia]
  );

  const activePlatformDef =
    activeTab !== 'base'
      ? PLATFORM_DEFINITIONS.find((p) => p.id === activeTab)
      : null;

  const isCurrentPlatformSynced =
    activeTab !== 'base' ? isSynced[activeTab] ?? true : false;

  return (
    <div className='space-y-4'>
      {/* Platform Rendition Sync / Unsync Banner */}
      {activePlatformDef && (
        <div
          className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border p-3.5 text-xs transition-colors ${
            isCurrentPlatformSynced
              ? 'border-border-light bg-foreground-light/20 text-foreground/75 dark:border-border-dark/60 dark:bg-foreground-dark/20'
              : 'border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300'
          }`}
        >
          <div className='flex items-center gap-2'>
            {isCurrentPlatformSynced ? (
              <>
                <RiGlobalLine
                  size={16}
                  className='text-brand-orange shrink-0'
                />
                <span>
                  <strong>Synced with Base Post:</strong> Edits to the base post
                  automatically update {activePlatformDef.label}.
                </span>
              </>
            ) : (
              <>
                <RiGitForkLine size={16} className='text-amber-500 shrink-0' />
                <span>
                  <strong>Customized for {activePlatformDef.label}:</strong>{' '}
                  This rendition has diverged from the base post.
                </span>
              </>
            )}
          </div>

          <div className='flex items-center gap-2 shrink-0'>
            {isCurrentPlatformSynced ? (
              <button
                type='button'
                onClick={() => onUnsync(activeTab as SocialPlatform)}
                className='rounded-lg bg-brand-orange/10 px-3 py-1 font-semibold text-brand-orange hover:bg-brand-orange/20 transition-colors'
              >
                Unsync to customize
              </button>
            ) : (
              <button
                type='button'
                onClick={() => onResetToBase(activeTab as SocialPlatform)}
                className='flex items-center gap-1 rounded-lg border border-border-light bg-background-light px-2.5 py-1 text-xs font-medium text-foreground/70 hover:bg-foreground-light/40 dark:border-border-dark dark:bg-background-dark'
              >
                <RiRestartLine size={13} />
                <span>Reset to base</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Editor Surface */}
      <div className='relative rounded-2xl border border-border-light bg-background-light p-4 dark:border-border-dark/60 dark:bg-background-dark shadow-sm'>
        {activeTab === 'base' ? (
          <div>
            <label htmlFor='base-text' className='sr-only'>
              Base post
            </label>
            <textarea
              id='base-text'
              value={baseText}
              onChange={(e) => onChangeBaseText(e.target.value)}
              onPaste={handlePaste}
              disabled={disabled}
              placeholder='Write the thought you want to share...'
              className='min-h-44 w-full resize-y bg-transparent text-sm sm:text-base leading-relaxed text-foreground placeholder:text-foreground/40 outline-none dark:text-text-dark disabled:opacity-50'
            />

            {/* Optional Platform Overrides when viewing Base Post */}
            {selectedPlatforms && selectedPlatforms.length > 0 && (
              <div className='mt-4 border-t border-border-light/60 pt-4 dark:border-border-dark/40 space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-semibold text-foreground/70 dark:text-text-dark/70'>
                    Platform Customizations
                  </span>
                  <span className='text-[11px] text-foreground/40'>
                    Optional overrides per channel
                  </span>
                </div>
                <div className='space-y-3'>
                  {selectedPlatforms.map((platform) => {
                    const def = PLATFORM_DEFINITIONS.find(
                      (p) => p.id === platform
                    );
                    return (
                      <div key={platform} className='space-y-1'>
                        <label
                          htmlFor={`override-${platform}`}
                          className='block text-xs font-medium text-foreground/70 dark:text-text-dark/70'
                        >
                          {def?.label ?? platform} override{' '}
                          <span className='text-foreground/40'>(optional)</span>
                        </label>
                        <textarea
                          id={`override-${platform}`}
                          value={overrides[platform] ?? ''}
                          onChange={(e) =>
                            onChangeOverride(platform, e.target.value)
                          }
                          onPaste={handlePaste}
                          disabled={disabled}
                          placeholder='Use the base post, or tailor this rendition...'
                          className='min-h-16 w-full resize-y rounded-xl border border-border-light/70 bg-foreground-light/10 p-2.5 text-xs text-foreground placeholder:text-foreground/40 outline-none transition-all dark:border-border-dark/60 dark:bg-foreground-dark/10 dark:text-text-dark focus:border-brand-orange focus:ring-1 focus:ring-brand-orange'
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <label
              htmlFor={`override-${activeTab}`}
              className='mb-1.5 block text-xs font-semibold text-foreground/60'
            >
              {activePlatformDef?.label} override{' '}
              <span className='text-foreground/40'>(optional)</span>
            </label>
            <textarea
              id={`override-${activeTab}`}
              value={
                overrides[activeTab] ??
                (isCurrentPlatformSynced ? baseText : '')
              }
              onChange={(e) =>
                onChangeOverride(activeTab as SocialPlatform, e.target.value)
              }
              onPaste={handlePaste}
              disabled={disabled || isCurrentPlatformSynced}
              placeholder='Use the base post, or tailor this rendition...'
              className={`min-h-44 w-full resize-y bg-transparent text-sm sm:text-base leading-relaxed text-foreground placeholder:text-foreground/40 outline-none dark:text-text-dark disabled:opacity-75 ${
                isCurrentPlatformSynced
                  ? 'cursor-not-allowed text-foreground/60'
                  : ''
              }`}
            />
          </div>
        )}

        {/* Live Detected Link Card */}
        {detectedUrl && (
          <div className='mt-3 flex items-center justify-between rounded-xl border border-border-light/80 bg-foreground-light/15 p-3 text-xs dark:border-border-dark/60 dark:bg-foreground-dark/15'>
            <div className='flex items-center gap-2.5 min-w-0'>
              <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange'>
                <RiLinkM size={16} />
              </div>
              <div className='min-w-0'>
                <p className='font-medium text-foreground dark:text-text-dark truncate'>
                  {detectedUrl.url}
                </p>
                <p className='text-[10px] text-foreground/50'>
                  Source Link • {detectedUrl.hostname}
                </p>
              </div>
            </div>
            <a
              href={detectedUrl.url}
              target='_blank'
              rel='noopener noreferrer'
              className='shrink-0 text-foreground/40 hover:text-foreground p-1'
              title='Visit link'
            >
              <RiExternalLinkLine size={14} />
            </a>
          </div>
        )}

        {/* Footer info & helper */}
        <div className='mt-3 flex items-center justify-between border-t border-border-light/60 pt-3 text-[11px] text-foreground/50 dark:border-border-dark/40'>
          <span>
            Paste images (Ctrl+V) or drag & drop files directly onto the editor.
          </span>
          <span>{currentText.length} characters</span>
        </div>
      </div>
    </div>
  );
}
