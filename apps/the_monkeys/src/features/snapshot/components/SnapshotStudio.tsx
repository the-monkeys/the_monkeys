'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@the-monkeys/ui/atoms/accordion';

import { useDataUrlImage } from '../hooks/useDataUrlImage';
import { useExport } from '../hooks/useExport';
import { useSnapshotState } from '../hooks/useSnapshotState';
import { inlineImagesForExport } from '../lib/inlineImagesForExport';
import { parseTweetId } from '../lib/parseTweetUrl';
import { punchOverlayVideoHole } from '../lib/punchOverlayVideoHole';
import { getTweetDownloadVideoVariant } from '../lib/tweetMedia';
import { getTemplateById } from '../registry';
import { SnapshotInput } from '../types';
import {
  DEFAULT_TWEET_SCREENSHOT_OPTIONS,
  TWEET_ASPECT_DIMENSIONS,
  TweetScreenshotOptions,
} from '../types/tweetScreenshotOptions';
import { TweetScreenshotPreviewHandle } from '../types/tweetScreenshotPreview';
import { TweetSyndication } from '../types/tweetSyndication';
import { AccentColorPicker } from './AccentColorPicker';
import { BackgroundPicker } from './BackgroundPicker';
import { DownloadButton } from './DownloadButton';
import { OptionsPanel } from './OptionsPanel';
import { SnapshotPreview } from './SnapshotPreview';
import { TemplatePicker } from './TemplatePicker';
import { ThemePicker } from './ThemePicker';
import { TweetScreenshotOptionsPanel } from './TweetScreenshotOptionsPanel';
import { TweetScreenshotPreview } from './TweetScreenshotPreview';
import { TweetUrlPanel } from './TweetUrlPanel';

type PreviewMode = 'template' | 'x';

const downloadTweetVideo = (videoUrl: string, filename: string) => {
  const params = new URLSearchParams({
    url: videoUrl,
    filename,
  });
  const a = document.createElement('a');
  a.href = `/api/snapshot/tweet/video?${params.toString()}`;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export interface SnapshotStudioProps {
  input: SnapshotInput;
  /**
   * Pool of candidate background images (e.g. every image embedded in the
   * source blog). Falsy or empty means "no background picker".
   */
  availableImages?: string[];
  /** Optional initial template, defaults to editorial-portrait. */
  initialTemplateId?: string;
  initialThemeId?: string;
  initialAccent?: string;
}

/**
 * Top-level orchestrator. Composer-ready: when the Cast composer is built it
 * will mount this same component inside its media panel with no rewrites.
 */
export const SnapshotStudio = ({
  input,
  availableImages = [],
  initialTemplateId,
  initialThemeId,
  initialAccent,
}: SnapshotStudioProps) => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('template');
  const [tweetUrl, setTweetUrl] = useState('');
  const [tweetOptions, setTweetOptions] = useState<TweetScreenshotOptions>(
    DEFAULT_TWEET_SCREENSHOT_OPTIONS
  );
  const [tweetLoadError, setTweetLoadError] = useState<string | null>(null);
  const [tweetForDownload, setTweetForDownload] =
    useState<TweetSyndication | null>(null);
  const [isDownloadingVideo, setIsDownloadingVideo] = useState(false);
  const [exportMode, setExportMode] = useState<'image' | 'video-overlay'>(
    'image'
  );

  const tweetCanvasSize = TWEET_ASPECT_DIMENSIONS[tweetOptions.aspect];

  const tweetId = useMemo(() => parseTweetId(tweetUrl), [tweetUrl]);

  const { state, updateInput, setTemplate, setTheme, setAccent } =
    useSnapshotState({
      initialInput: input,
      initialTemplateId,
      initialThemeId,
      initialAccent,
    });

  const bgDataUrl = useDataUrlImage(state.input.backgroundImageUrl);
  const renderedInput = useMemo<SnapshotInput>(
    () => ({
      ...state.input,
      backgroundImageUrl: bgDataUrl,
    }),
    [state.input, bgDataUrl]
  );

  const template = getTemplateById(state.templateId);
  const snapshotRef = useRef<HTMLDivElement | null>(null);
  const tweetPreviewRef = useRef<TweetScreenshotPreviewHandle | null>(null);

  const xStageRef = useRef<HTMLDivElement | null>(null);
  const [xScale, setXScale] = useState(1);

  useEffect(() => {
    if (previewMode !== 'x' || !xStageRef.current) return;
    const el = xStageRef.current;
    const update = () => {
      const available = el.clientWidth;
      if (!available) return;
      const next = Math.min(1, (available - 16) / tweetCanvasSize.width);
      setXScale(next);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [previewMode, tweetCanvasSize.width]);

  const { exportImage, isExporting, error } = useExport(snapshotRef, {
    width: template.width,
    height: template.height,
    slice: template.slice,
  });

  const {
    exportImage: exportTweetScreenshot,
    isExporting: isExportingTweet,
    error: tweetExportError,
  } = useExport(
    { current: null },
    {
      width: tweetCanvasSize.width,
      height: tweetCanvasSize.height,
      getNode: () => tweetPreviewRef.current?.getExportRoot() ?? null,
    }
  );

  const filename = `${state.input.title || 'snapshot'}-${template.id}`;
  const tweetFilename = tweetId
    ? `x-post-${tweetId}`
    : `${state.input.title || 'snapshot'}-x-post`;
  const tweetVideoVariant = useMemo(
    () => getTweetDownloadVideoVariant(tweetForDownload),
    [tweetForDownload]
  );

  const activeExporting =
    previewMode === 'x' ? isExportingTweet || isDownloadingVideo : isExporting;
  const activeError =
    previewMode === 'x' ? tweetExportError ?? tweetLoadError : error;

  const handleExport = async () => {
    if (previewMode === 'x') {
      if (!tweetId) return null;

      if (tweetVideoVariant) {
        if (!tweetOptions.enableBrandedVideo) {
          setIsDownloadingVideo(true);
          try {
            downloadTweetVideo(tweetVideoVariant.url, `${tweetFilename}.mp4`);
            return null;
          } finally {
            window.setTimeout(() => setIsDownloadingVideo(false), 500);
          }
        }

        setIsDownloadingVideo(true);
        setTweetLoadError(null);
        try {
          const exportRoot = tweetPreviewRef.current?.getExportRoot();
          if (!exportRoot) throw new Error('Preview not ready');

          setExportMode('video-overlay');
          await new Promise((r) => setTimeout(r, 120));

          const root = tweetPreviewRef.current?.getExportRoot();
          if (root) await inlineImagesForExport(root);
          await document.fonts?.ready;

          const blob = await exportTweetScreenshot({
            filename: tweetFilename,
            download: false,
            transparent: true,
            // Match canvas resolution — 2x PNGs blow up gateway FFmpeg memory.
            pixelRatio: 1,
          });
          if (!blob) throw new Error('Overlay capture failed');

          const frame = tweetPreviewRef.current?.getMediaFrame();
          if (!frame) throw new Error('Could not measure video frame');

          const overlayBlob = await punchOverlayVideoHole(
            blob,
            frame,
            tweetCanvasSize.width
          );

          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
          });
          reader.readAsDataURL(overlayBlob);
          const overlayBase64 = await base64Promise;

          const response = await fetch('/api/snapshot/tweet/video/render', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tweetId,
              videoUrl: tweetVideoVariant.url,
              overlay: overlayBase64,
              backgroundColor: tweetOptions.backgroundColor,
              frameX: frame.x,
              frameY: frame.y,
              frameW: frame.width,
              frameH: frame.height,
              canvasW: tweetCanvasSize.width,
              canvasH: tweetCanvasSize.height,
            }),
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error || 'Server render failed');
          }

          const resultBlob = await response.blob();
          const url = URL.createObjectURL(resultBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${tweetFilename}-branded.mp4`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          return null;
        } catch (err) {
          setTweetLoadError(
            err instanceof Error ? err.message : 'Branded video export failed'
          );
          return null;
        } finally {
          setExportMode('image');
          setIsDownloadingVideo(false);
        }
      }

      const root = tweetPreviewRef.current?.getExportRoot();
      if (root) await inlineImagesForExport(root);
      await document.fonts?.ready;
      return exportTweetScreenshot({ filename: tweetFilename, download: true });
    }
    return exportImage({ filename });
  };

  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    if (previewMode === 'x' && !tweetId) return;
    setIsCopying(true);
    try {
      let blob: Blob | null = null;
      if (previewMode === 'x') {
        const root = tweetPreviewRef.current?.getExportRoot();
        if (!root) return;
        await inlineImagesForExport(root);
        await document.fonts?.ready;
        blob = await exportTweetScreenshot({
          filename: tweetFilename,
          download: false,
        });
      } else {
        blob = await exportImage({ filename, download: false });
      }

      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    } finally {
      setIsCopying(false);
    }
  };

  const patchTweetOptions = useCallback(
    (patch: Partial<TweetScreenshotOptions>) => {
      setTweetOptions((o) => ({ ...o, ...patch }));
    },
    []
  );

  return (
    <div
      className={cn(
        'grid w-full grid-cols-1 gap-6',
        previewMode === 'x'
          ? 'lg:grid-cols-[minmax(320px,400px)_1fr]'
          : 'lg:grid-cols-[1fr_minmax(320px,420px)]'
      )}
    >
      <section
        className={cn(
          'flex min-w-0 flex-col gap-3',
          previewMode === 'x' ? 'lg:order-2' : ''
        )}
      >
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <div>
            <h2 className='font-newsreader text-2xl'>
              {previewMode === 'x' ? 'X post screenshot' : template.label}
            </h2>
            <p className='text-xs text-foreground/60'>
              {previewMode === 'x'
                ? tweetId
                  ? `${tweetCanvasSize.width}×${tweetCanvasSize.height} · Clean screenshot card`
                  : 'Paste a public X post URL'
                : `${template.width}×${template.height} · ${template.aspect}`}
            </p>
          </div>
          <div
            className='inline-flex rounded-lg border p-0.5 text-xs'
            role='tablist'
            aria-label='Preview mode'
          >
            <button
              type='button'
              role='tab'
              aria-selected={previewMode === 'template'}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                previewMode === 'template'
                  ? 'bg-brand-orange text-white'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
              onClick={() => setPreviewMode('template')}
            >
              Image template
            </button>
            <button
              type='button'
              role='tab'
              aria-selected={previewMode === 'x'}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                previewMode === 'x'
                  ? 'bg-brand-orange text-white'
                  : 'text-foreground/70 hover:text-foreground'
              }`}
              onClick={() => setPreviewMode('x')}
            >
              X screenshot
            </button>
          </div>
        </div>

        <div className='rounded-2xl border bg-foreground-light/30 p-2 dark:bg-foreground-dark/20 sm:p-4'>
          {previewMode === 'template' ? (
            <SnapshotPreview
              ref={snapshotRef}
              input={renderedInput}
              templateId={state.templateId}
              themeId={state.themeId}
              accent={state.accent}
            />
          ) : (
            <div className='flex flex-col items-center w-full'>
              <div
                ref={xStageRef}
                className='flex justify-center p-2 w-full overflow-hidden'
              >
                <div
                  style={{
                    width: tweetCanvasSize.width * xScale,
                    height: tweetCanvasSize.height * xScale,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div
                    className='relative'
                    style={{
                      width: tweetCanvasSize.width,
                      height: tweetCanvasSize.height,
                      transform: `scale(${xScale})`,
                      transformOrigin: 'top left',
                    }}
                  >
                    <TweetScreenshotPreview
                      ref={tweetPreviewRef}
                      tweetUrl={tweetUrl}
                      options={tweetOptions}
                      onError={setTweetLoadError}
                      onTweetReady={setTweetForDownload}
                      exportMode={exportMode}
                    />

                    {/* Decorative drag handles to replicate layout design */}
                    <div
                      className='absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-7 bg-white rounded-full border border-black/10 shadow-lg z-10'
                      style={{ pointerEvents: 'none' }}
                    />
                    <div
                      className='absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2.5 h-7 bg-white rounded-full border border-black/10 shadow-lg z-10'
                      style={{ pointerEvents: 'none' }}
                    />
                    <div
                      className='absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-7 h-2.5 bg-white rounded-full border border-black/10 shadow-lg z-10'
                      style={{ pointerEvents: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Stage description footer */}
              <div className='mt-6 text-center text-xs text-foreground/50 flex flex-col gap-1.5'>
                <p>
                  But if you like this tool, you can always{' '}
                  <a
                    href='https://github.com/sponsors/the-monkeys'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-brand-orange hover:underline font-medium'
                  >
                    fund us on github.com.co
                  </a>
                </p>
                <p>
                  Issues?{' '}
                  <a
                    href='mailto:support@monkeys.com.co'
                    className='text-brand-orange hover:underline font-medium'
                  >
                    Contact us
                  </a>
                </p>
                <p className='text-[10px] text-foreground/40 mt-1'>
                  Works instantly on mobile or desktop and every browser
                </p>
              </div>
            </div>
          )}
        </div>

        {activeError ? (
          <p role='alert' className='text-sm text-alert-red'>
            {activeError instanceof Error
              ? activeError.message
              : String(activeError)}
          </p>
        ) : null}
      </section>

      <aside
        className={cn(
          'flex flex-col gap-5',
          previewMode === 'x' ? 'lg:order-1' : ''
        )}
      >
        {previewMode === 'template' ? (
          <>
            <div className='flex flex-col gap-2'>
              <h3 className='text-sm font-semibold uppercase tracking-wide text-foreground/60'>
                Template
              </h3>
              <TemplatePicker value={state.templateId} onChange={setTemplate} />
            </div>

            <div className='flex flex-col gap-2'>
              <h3 className='text-sm font-semibold uppercase tracking-wide text-foreground/60'>
                Theme
              </h3>
              <ThemePicker value={state.themeId} onChange={setTheme} />
            </div>

            <div className='flex flex-col gap-2'>
              <h3 className='text-sm font-semibold uppercase tracking-wide text-foreground/60'>
                Accent
              </h3>
              <AccentColorPicker value={state.accent} onChange={setAccent} />
            </div>

            <div className='flex flex-col gap-2'>
              <h3 className='text-sm font-semibold uppercase tracking-wide text-foreground/60'>
                Background
              </h3>
              <BackgroundPicker
                value={state.input.backgroundImageUrl}
                images={availableImages}
                overlay={state.input.backgroundOverlay ?? 0.55}
                onChangeImage={(url) =>
                  updateInput({ backgroundImageUrl: url })
                }
                onChangeOverlay={(overlay) =>
                  updateInput({ backgroundOverlay: overlay })
                }
              />
            </div>

            <div className='flex flex-col gap-2'>
              <h3 className='text-sm font-semibold uppercase tracking-wide text-foreground/60'>
                Content
              </h3>
              <OptionsPanel input={state.input} onChange={updateInput} />
            </div>
          </>
        ) : (
          <Accordion
            type='multiple'
            defaultValue={[
              'x-post',
              'screenshot-style',
              'watermark-styling',
              'x-post-style',
            ]}
            className='w-full flex flex-col gap-2'
          >
            <AccordionItem value='x-post' className='border-none'>
              <AccordionTrigger className='text-sm font-semibold uppercase tracking-wide text-foreground/60 py-2 hover:no-underline'>
                X post
              </AccordionTrigger>
              <AccordionContent className='pt-2'>
                <TweetUrlPanel
                  value={tweetUrl}
                  onChange={setTweetUrl}
                  tweetId={tweetId}
                  error={tweetLoadError}
                />
              </AccordionContent>
            </AccordionItem>

            <TweetScreenshotOptionsPanel
              options={tweetOptions}
              onChange={patchTweetOptions}
            />
          </Accordion>
        )}

        <div className='sticky bottom-0 -mx-1 mt-2 flex flex-col gap-2 border-t bg-background-light/95 px-1 py-3 dark:bg-background-dark/95'>
          {previewMode === 'x' ? (
            <div className='flex items-center gap-2 w-full'>
              {/* Sponsor button */}
              <a
                href='https://github.com/sponsors/the-monkeys'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center justify-center h-10 w-12 rounded-lg border border-border-light/60 dark:border-border-dark/60 bg-background-light dark:bg-background-dark text-foreground hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5 transition-colors focus:outline-none'
                title='Sponsor us on GitHub'
              >
                <svg
                  viewBox='0 0 24 24'
                  width={18}
                  height={18}
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' />
                </svg>
              </a>

              {/* Copy to clipboard button */}
              <button
                type='button'
                onClick={handleCopy}
                disabled={isCopying || activeExporting || !tweetId}
                className='flex items-center justify-center h-10 w-12 rounded-lg border border-border-light/60 dark:border-border-dark/60 bg-background-light dark:bg-background-dark text-foreground hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
                title='Copy to Clipboard'
              >
                {copied ? (
                  <svg
                    viewBox='0 0 24 24'
                    width={18}
                    height={18}
                    fill='none'
                    stroke='#10B981'
                    strokeWidth={2.5}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                ) : isCopying ? (
                  <svg
                    className='animate-spin h-5 w-5 text-foreground/50'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox='0 0 24 24'
                    width={18}
                    height={18}
                    fill='none'
                    stroke='currentColor'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <rect x='9' y='9' width='13' height='13' rx='2' ry='2' />
                    <path d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1' />
                  </svg>
                )}
              </button>

              {/* Download button */}
              <button
                type='button'
                onClick={() => handleExport()}
                disabled={activeExporting || isCopying || !tweetId}
                className='flex-1 flex items-center justify-center gap-2 h-10 px-4 rounded-lg border border-border-light/60 dark:border-border-dark/60 bg-background-light dark:bg-background-dark text-foreground hover:bg-foreground-light/5 dark:hover:bg-foreground-dark/5 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm'
              >
                {activeExporting ? (
                  <>
                    <svg
                      className='animate-spin h-4 w-4 text-foreground/50'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    {isDownloadingVideo ? 'Downloading…' : 'Rendering…'}
                  </>
                ) : (
                  <>
                    <svg
                      viewBox='0 0 24 24'
                      width={16}
                      height={16}
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    >
                      <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
                      <polyline points='7 10 12 15 17 10' />
                      <line x1='12' y1='15' x2='12' y2='3' />
                    </svg>
                    {tweetVideoVariant ? 'Download video' : 'Download'}
                  </>
                )}
              </button>

              {/* Post button */}
              <button
                type='button'
                disabled={!tweetId}
                onClick={() => {
                  alert(
                    'To schedule or post this screenshot, please use the Monkeys Composer in the Cast module.'
                  );
                }}
                className='flex items-center justify-center gap-1.5 h-10 px-5 rounded-lg bg-[#1D9BF0] text-white hover:bg-[#1A8CD8] transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm'
              >
                <svg
                  viewBox='0 0 24 24'
                  width={16}
                  height={16}
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <line x1='22' y1='2' x2='11' y2='13' />
                  <polygon points='22 2 15 22 11 13 2 9 22 2' />
                </svg>
                Post
              </button>
            </div>
          ) : (
            <DownloadButton
              isExporting={activeExporting}
              onExport={handleExport}
              filename={filename}
              disabled={false}
            />
          )}
        </div>
      </aside>
    </div>
  );
};
