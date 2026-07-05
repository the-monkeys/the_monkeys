'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { format } from 'date-fns';

import { useTweetSyndication } from '../hooks/useTweetSyndication';
import { isLightBackground } from '../lib/canvasContrast';
import { formatTweetCount } from '../lib/formatTweetCounts';
import { parseTweetId } from '../lib/parseTweetUrl';
import { getTweetCanvasBackground } from '../lib/tweetCanvasBackground';
import { formatTweetDisplayText } from '../lib/tweetDisplayText';
import {
  collectTweetMedia,
  getBestTweetVideoVariant,
  getTweetImageAspectRatio,
  getTweetMediaAspectRatio,
  isTweetVideoMedia,
} from '../lib/tweetMedia';
import { Logo } from '../templates/_shared';
import {
  TWEET_ASPECT_DIMENSIONS,
  TweetScreenshotOptions,
} from '../types/tweetScreenshotOptions';
import {
  MediaFrameRect,
  TweetScreenshotPreviewHandle,
} from '../types/tweetScreenshotPreview';
import {
  TweetSyndication,
  TweetSyndicationMedia,
} from '../types/tweetSyndication';

export { TWEET_ASPECT_DIMENSIONS };

const CANVAS_PADDING = 72;

export interface TweetScreenshotPreviewProps {
  tweetUrl: string;
  options: TweetScreenshotOptions;
  onReady?: (size: { width: number; height: number }) => void;
  onError?: (message: string | null) => void;
  onTweetReady?: (tweet: TweetSyndication | null) => void;
  className?: string;
  exportMode?: 'image' | 'video-overlay';
}

const hiResAvatar = (url: string) =>
  url.replace(/_normal|_bigger|_mini/gi, '_400x400');

const XLogo = ({ color }: { color: string }) => (
  <svg viewBox='0 0 24 24' width={26} height={26} aria-hidden>
    <path
      fill={color}
      d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'
    />
  </svg>
);

const VerifiedBadge = () => (
  <svg viewBox='0 0 22 22' width={17} height={17} aria-label='Verified'>
    <path
      fill='#1D9BF0'
      d='M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.211-.882-1.642-.445-.431-1.022-.737-1.656-.867-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 4.62 11 4.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.213.436-1.645.882-.432.445-.738 1.021-.868 1.655-.13.634-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.436 1.211.882 1.642.446.43 1.022.736 1.656.866.633.131 1.29.084 1.897-.136.274.586.705 1.084 1.245 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.265.296 1.903.164.636-.132 1.22-.44 1.66-.886.44-.445.748-1.027.878-1.663.13-.635.085-1.29-.136-1.895.587-.274 1.087-.705 1.443-1.245.356-.54.555-1.17.573-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z'
    />
  </svg>
);

const MediaGrid = ({
  media,
  dark,
  exportMode,
  onMediaRef,
}: {
  media: TweetSyndicationMedia[];
  dark: boolean;
  exportMode?: 'image' | 'video-overlay';
  onMediaRef?: (el: HTMLElement | null) => void;
}) => {
  if (!media.length) return null;
  const border = dark ? '#38444D' : '#E0DDD6';

  // X's standard layouts:
  // 1: auto height
  // 2: 1x2 grid (side by side)
  // 3: 1 tall on left, 2 on right
  // 4: 2x2 grid
  const count = media.length;
  const firstMedia = media[0];
  const firstMediaIsVideo = isTweetVideoMedia(firstMedia);
  const singleMediaRatio =
    count === 1
      ? firstMediaIsVideo
        ? getTweetMediaAspectRatio(firstMedia)
        : getTweetImageAspectRatio(firstMedia)
      : null;
  const singleDisplayRatio =
    count === 1 && singleMediaRatio
      ? firstMediaIsVideo
        ? Math.max(singleMediaRatio, 4 / 3)
        : singleMediaRatio
      : null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: count === 1 ? '1fr' : '1fr 1fr',
        gridTemplateRows: count <= 2 ? '1fr' : '1fr 1fr',
        gap: 2,
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        border: `1px solid ${border}`,
        aspectRatio:
          count === 1 && singleDisplayRatio
            ? `${singleDisplayRatio} / 1`
            : count === 1
              ? 'auto'
              : '1.75 / 1',
        maxHeight: count === 1 ? (firstMediaIsVideo ? 640 : 560) : undefined,
        minHeight: count === 1 ? (firstMediaIsVideo ? 260 : 220) : undefined,
        backgroundColor: border,
      }}
    >
      {media.map((m, i) => {
        const isFirstOfThree = count === 3 && i === 0;
        const isVideo = isTweetVideoMedia(m);
        const bestVideo = getBestTweetVideoVariant(m);
        const isFirst = i === 0;

        return (
          <div
            key={m.media_url_https}
            ref={isFirst ? onMediaRef : undefined}
            style={{
              width: '100%',
              height: '100%',
              gridRow: isFirstOfThree ? 'span 2' : 'auto',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            {isVideo && bestVideo && exportMode === 'video-overlay' ? (
              <div
                data-snapshot-video-hole='true'
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'transparent',
                }}
              />
            ) : isVideo && bestVideo ? (
              <video
                src={bestVideo.url}
                poster={m.media_url_https}
                autoPlay
                muted
                loop
                playsInline
                crossOrigin='anonymous'
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.media_url_https}
                alt=''
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  maxHeight: count === 1 ? 560 : 'none',
                  minHeight: count === 1 ? 200 : 'none',
                }}
              />
            )}

            {m.type === 'video' && exportMode !== 'video-overlay' && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 48,
                  height: 48,
                  backgroundColor: 'rgba(29, 155, 240, 0.9)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  pointerEvents: 'none',
                  border: '4px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
              >
                <svg
                  viewBox='0 0 24 24'
                  width={24}
                  height={24}
                  fill='currentColor'
                >
                  <path d='M8 5v14l11-7z' />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const ScreenshotCard = ({
  tweet,
  options,
  canvasWidth,
  exportMode,
  onMediaRef,
}: {
  tweet: TweetSyndication;
  options: TweetScreenshotOptions;
  canvasWidth: number;
  exportMode?: 'image' | 'video-overlay';
  onMediaRef?: (el: HTMLElement | null) => void;
}): JSX.Element => {
  const dark = options.darkCard;
  const cardBg = dark ? '#15202B' : '#FFFFFF';
  const fg = dark ? '#F7F9F9' : '#0F1419';
  const muted = dark ? '#8B98A5' : '#536471';
  const divider = dark ? '#38444D' : '#E0DDD6';
  const user = tweet.user;
  const verified = Boolean(user?.is_blue_verified || user?.verified);
  const media = collectTweetMedia(tweet);
  const displayText = formatTweetDisplayText(tweet.text, media.length > 0);
  const when = tweet.created_at ? new Date(tweet.created_at) : null;
  const timeLabel =
    when && !Number.isNaN(when.getTime())
      ? format(when, 'h:mm a · d MMM, yyyy')
      : tweet.created_at;
  const views = formatTweetCount(tweet.views_count);
  const replies = formatTweetCount(tweet.reply_count);
  const shares = formatTweetCount(tweet.retweet_count);
  const likes = formatTweetCount(tweet.favorite_count);
  const hasEngagement =
    views != null || replies != null || shares != null || likes != null;
  const cardWidth = Math.min(980, canvasWidth - CANVAS_PADDING * 2);
  const showAuthor = options.showProfilePhoto || options.showAuthorInfo;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: cardWidth,
        maxWidth: '100%',
        backgroundColor: cardBg,
        borderRadius: 24,
        padding: 40,
        paddingTop: options.showXIcon ? 44 : 40,
        boxShadow: dark
          ? '0 16px 48px rgba(0,0,0,0.45)'
          : '0 14px 40px rgba(0,0,0,0.14)',
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
        color: fg,
        gap: 20,
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {options.showXIcon ? (
        <div
          style={{
            position: 'absolute',
            top: 24,
            right: 28,
            display: 'flex',
          }}
        >
          <XLogo color={fg} />
        </div>
      ) : null}

      {showAuthor ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingRight: options.showXIcon ? 36 : 0,
          }}
        >
          {options.showProfilePhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hiResAvatar(user?.profile_image_url_https ?? '')}
              alt=''
              width={52}
              height={52}
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
          ) : null}

          {options.showAuthorInfo ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                minWidth: 0,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: 17 }}>
                  {user?.name ?? 'Unknown'}
                </span>
                {options.showVerified && verified ? <VerifiedBadge /> : null}
              </div>
              <span style={{ color: muted, fontSize: 14 }}>
                @{user?.screen_name ?? 'unknown'}
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      {displayText ? (
        <div
          style={{
            fontSize: 24,
            lineHeight: 1.45,
            fontWeight: 400,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            letterSpacing: -0.15,
          }}
        >
          {displayText}
        </div>
      ) : null}

      <MediaGrid
        media={media}
        dark={dark}
        exportMode={exportMode}
        onMediaRef={onMediaRef}
      />

      {options.showDateTime ? (
        <div style={{ fontSize: 14, color: muted, lineHeight: 1.3 }}>
          {timeLabel}
        </div>
      ) : null}

      {options.showResponses && hasEngagement ? (
        <>
          <div
            style={{
              display: 'flex',
              height: 1,
              backgroundColor: divider,
              width: '100%',
              marginTop: 4,
              marginBottom: 4,
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 24,
              fontSize: 15,
              color: muted,
              lineHeight: 1.4,
            }}
          >
            {views != null && (
              <div>
                <span style={{ fontWeight: 700, color: fg }}>{views}</span>
                <span style={{ color: muted, marginLeft: 4 }}>views</span>
              </div>
            )}
            {replies != null && (
              <div>
                <span style={{ fontWeight: 700, color: fg }}>{replies}</span>
                <span style={{ color: muted, marginLeft: 4 }}>replies</span>
              </div>
            )}
            {shares != null && (
              <div>
                <span style={{ fontWeight: 700, color: fg }}>{shares}</span>
                <span style={{ color: muted, marginLeft: 4 }}>shares</span>
              </div>
            )}
            {likes != null && (
              <div>
                <span style={{ fontWeight: 700, color: fg }}>{likes}</span>
                <span style={{ color: muted, marginLeft: 4 }}>likes</span>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

// No interface needed if we use a hybrid approach or just expose methods on the element

export const TweetScreenshotPreview = forwardRef<
  TweetScreenshotPreviewHandle,
  TweetScreenshotPreviewProps
>(function TweetScreenshotPreview(
  {
    tweetUrl,
    options,
    onReady,
    onError,
    onTweetReady,
    className,
    exportMode = 'image',
  },
  ref
) {
  const tweetId = parseTweetId(tweetUrl);
  const { tweet, isLoading, error } = useTweetSyndication(tweetId);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const { width, height } = TWEET_ASPECT_DIMENSIONS[options.aspect];

  const updateScale = useCallback(() => {
    if (!contentRef.current || !tweet) {
      setScale(1);
      return;
    }

    const frame = contentRef.current.parentElement;
    const availableHeight =
      (frame?.clientHeight || height - CANVAS_PADDING * 2 - 92) - 16;
    const availableWidth =
      (frame?.clientWidth || width - CANVAS_PADDING * 2) - 16;
    const actualHeight = contentRef.current.offsetHeight;
    const actualWidth = contentRef.current.offsetWidth;

    if (!availableHeight || !availableWidth || !actualHeight || !actualWidth) {
      return;
    }

    const scaleH =
      actualHeight > availableHeight ? availableHeight / actualHeight : 1;
    const scaleW =
      actualWidth > availableWidth ? availableWidth / actualWidth : 1;

    setScale(Math.min(scaleH, scaleW));
  }, [tweet, width, height]);

  const mediaRef = useRef<HTMLElement | null>(null);

  const getMediaFrame = useCallback((): MediaFrameRect | null => {
    if (!mediaRef.current || !innerRef.current) return null;
    const rect = mediaRef.current.getBoundingClientRect();
    const canvasRect = innerRef.current.getBoundingClientRect();
    if (!canvasRect.width) return null;
    const ratio = width / canvasRect.width;
    return {
      x: (rect.left - canvasRect.left) * ratio,
      y: (rect.top - canvasRect.top) * ratio,
      width: rect.width * ratio,
      height: rect.height * ratio,
    };
  }, [width]);

  useImperativeHandle(
    ref,
    () => ({
      getExportRoot: () => innerRef.current,
      getMediaFrame,
    }),
    [getMediaFrame]
  );

  const measure = useCallback(() => {
    onReady?.({ width, height });
  }, [onReady, width, height]);

  useLayoutEffect(() => {
    measure();
  }, [tweet, options, measure]);

  useLayoutEffect(() => {
    updateScale();
  }, [tweet, options, updateScale]);

  useLayoutEffect(() => {
    if (!contentRef.current || !tweet) return;
    const frame = contentRef.current.parentElement;
    const ro = new ResizeObserver(updateScale);
    ro.observe(contentRef.current);
    if (frame) ro.observe(frame);
    return () => ro.disconnect();
  }, [tweet, updateScale]);

  useEffect(() => {
    onError?.(error);
  }, [error, onError]);

  useEffect(() => {
    onTweetReady?.(tweet ?? null);
  }, [tweet, onTweetReady]);

  useEffect(() => {
    if (!tweet) return;
    const t = window.setTimeout(() => {
      updateScale();
      measure();
    }, 400);
    const t2 = window.setTimeout(() => {
      updateScale();
      measure();
    }, 1200);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [tweet, measure, updateScale]);

  // Hide the canvas background for video tweets — the exported video is
  // BBC-style (watermark on raw video), so the preview should match.
  const tweetHasVideo = useMemo(
    () => !!tweet && collectTweetMedia(tweet).some(isTweetVideoMedia),
    [tweet]
  );

  const canvasStyle = useMemo(
    () => ({
      width,
      height,
      display: 'flex' as const,
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
      justifyContent: 'flex-start' as const,
      padding: CANVAS_PADDING,
      boxSizing: 'border-box' as const,
      ...(tweetHasVideo ? {} : getTweetCanvasBackground(options)),
      position: 'relative' as const,
      overflow: 'hidden' as const,
      flexShrink: 0,
    }),
    [
      width,
      height,
      options.backgroundColor,
      options.backgroundImage,
      tweetHasVideo,
    ]
  );

  const placeholder = (message: string, sub?: string) => (
    <div ref={innerRef} className={className} style={canvasStyle}>
      {/* Watermark Header */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 24,
          boxSizing: 'border-box',
        }}
      >
        <Logo
          color={options.watermarkColor || '#FFFFFF'}
          accent={options.watermarkAccentColor || '#FF5542'}
          size={30}
        />
        <div
          style={{
            display: 'flex',
            color: options.watermarkColor || '#FFFFFF',
            opacity: 0.7,
            fontSize: 22,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            fontWeight: 500,
            fontFamily:
              '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
          }}
        >
          X-Screenshot
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p
          style={{
            color: isLightBackground(options.backgroundColor)
              ? 'rgba(15,20,25,0.85)'
              : 'rgba(255,255,255,0.92)',
            fontSize: 16,
            textAlign: 'center',
            maxWidth: 420,
            lineHeight: 1.5,
          }}
        >
          {message}
          {sub ? (
            <>
              <br />
              <span style={{ fontSize: 13, opacity: 0.85 }}>{sub}</span>
            </>
          ) : null}
        </p>
      </div>
    </div>
  );

  if (!tweetUrl.trim()) {
    return placeholder(
      'Paste an X post URL to generate a clean screenshot card.',
      'Profile photo, verification, time, media, and engagement stats.'
    );
  }

  if (!tweetId) {
    return placeholder('Invalid X post URL.');
  }

  if (isLoading) {
    return placeholder('Loading post…');
  }

  if (error || !tweet) {
    return placeholder(error ?? 'Tweet unavailable');
  }

  return (
    <div ref={innerRef} className={className} style={canvasStyle}>
      {/* Watermark Header — shown for image tweets only; video tweets get the
          watermark burned directly into the exported video file instead. */}
      {!tweetHasVideo && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 24,
            boxSizing: 'border-box',
          }}
        >
          <Logo
            color={options.watermarkColor || '#FFFFFF'}
            accent={options.watermarkAccentColor || '#FF5542'}
            size={30}
          />
          <div
            style={{
              display: 'flex',
              color: options.watermarkColor || '#FFFFFF',
              opacity: 0.7,
              fontSize: 22,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
              fontWeight: 500,
              fontFamily:
                '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
            }}
          >
            X-Screenshot
          </div>
        </div>
      )}

      {/* Content */}
      <div
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
        }}
      >
        <div
          ref={contentRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <ScreenshotCard
            tweet={tweet}
            options={options}
            canvasWidth={width}
            exportMode={exportMode}
            onMediaRef={(el) => (mediaRef.current = el)}
          />
        </div>
      </div>
    </div>
  );
});
