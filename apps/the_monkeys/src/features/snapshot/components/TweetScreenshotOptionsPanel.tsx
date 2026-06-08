'use client';

import { Label } from '@the-monkeys/ui/atoms/label';
import { Switch } from '@the-monkeys/ui/atoms/switch';

import { getThemeById } from '../themes';
import {
  TweetScreenshotAspect,
  TweetScreenshotOptions,
} from '../types/tweetScreenshotOptions';
import { AccentColorPicker } from './AccentColorPicker';
import { ThemePicker } from './ThemePicker';

export interface TweetScreenshotOptionsPanelProps {
  options: TweetScreenshotOptions;
  onChange: (patch: Partial<TweetScreenshotOptions>) => void;
}

const ASPECTS: { id: TweetScreenshotAspect; label: string }[] = [
  { id: '1080x1080', label: 'Square (1:1)' },
  { id: '1080x1350', label: 'Portrait (4:5)' },
  { id: '1200x675', label: 'Landscape (16:9)' },
];

const DropletIcon = () => (
  <svg
    viewBox='0 0 24 24'
    width={16}
    height={16}
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    className='text-foreground/50'
  >
    <path d='M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z' />
  </svg>
);

const MoonIcon = () => (
  <svg
    viewBox='0 0 24 24'
    width={16}
    height={16}
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    className='text-foreground/50'
  >
    <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
  </svg>
);

const AspectRatioIcon = () => (
  <svg
    viewBox='0 0 24 24'
    width={16}
    height={16}
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    className='text-foreground/50'
  >
    <path d='M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7' />
  </svg>
);

const MiniXLogo = () => (
  <svg
    viewBox='0 0 24 24'
    width={16}
    height={16}
    fill='currentColor'
    className='text-foreground/50'
  >
    <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
  </svg>
);

const AvatarIcon = () => (
  <svg
    viewBox='0 0 24 24'
    width={16}
    height={16}
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    className='text-foreground/50'
  >
    <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
    <circle cx='12' cy='7' r='4' />
  </svg>
);

const AtIcon = () => (
  <svg
    viewBox='0 0 24 24'
    width={16}
    height={16}
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    className='text-foreground/50'
  >
    <circle cx='12' cy='12' r='4' />
    <path d='M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94' />
  </svg>
);

const VerifiedIcon = () => (
  <svg
    viewBox='0 0 24 24'
    width={16}
    height={16}
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    className='text-foreground/50'
  >
    <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
    <path d='m9 11 2 2 4-4' />
  </svg>
);

const ClockIcon = () => (
  <svg
    viewBox='0 0 24 24'
    width={16}
    height={16}
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    className='text-foreground/50'
  >
    <circle cx='12' cy='12' r='10' />
    <polyline points='12 6 12 12 16 14' />
  </svg>
);

const HeartIcon = () => (
  <svg
    viewBox='0 0 24 24'
    width={16}
    height={16}
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    className='text-foreground/50'
  >
    <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
  </svg>
);

const VideoIcon = () => (
  <svg
    viewBox='0 0 24 24'
    width={16}
    height={16}
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    className='text-foreground/50'
  >
    <path d='M23 7l-7 5 7 5V7z' />
    <rect x='1' y='5' width='15' height='14' rx='2' ry='2' />
  </svg>
);

const TOGGLES: {
  key: keyof Pick<
    TweetScreenshotOptions,
    | 'showXIcon'
    | 'showProfilePhoto'
    | 'showAuthorInfo'
    | 'showVerified'
    | 'showDateTime'
    | 'showResponses'
  >;
  label: string;
  icon: () => JSX.Element;
}[] = [
  { key: 'showXIcon', label: 'Icon', icon: MiniXLogo },
  { key: 'showProfilePhoto', label: 'Profile Photo', icon: AvatarIcon },
  { key: 'showAuthorInfo', label: 'Username', icon: AtIcon },
  { key: 'showVerified', label: 'Verified', icon: VerifiedIcon },
  { key: 'showDateTime', label: 'Date & Time', icon: ClockIcon },
  { key: 'showResponses', label: 'Responses', icon: HeartIcon },
];

export const TweetScreenshotOptionsPanel = ({
  options,
  onChange,
}: TweetScreenshotOptionsPanelProps) => (
  <div className='flex flex-col gap-3.5'>
    <div className='flex flex-col gap-2'>
      <span className='text-xs font-semibold uppercase tracking-wider text-foreground/50 px-1'>
        Theme
      </span>
      <ThemePicker
        value={options.themeId ?? ''}
        onChange={(themeId) => {
          const theme = getThemeById(themeId);
          onChange({
            themeId,
            backgroundColor: theme.background,
            backgroundImage: theme.backgroundImage,
          });
        }}
      />
    </div>

    <div className='flex items-center justify-between gap-4 rounded-xl bg-foreground-light/10 dark:bg-foreground-dark/10 p-3 transition-colors hover:bg-foreground-light/15 dark:hover:bg-foreground-dark/15'>
      <div className='flex items-center gap-3'>
        <DropletIcon />
        <span className='text-sm font-medium text-foreground'>
          Custom color
        </span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='relative w-7 h-7 rounded-full overflow-hidden border border-black/10 shadow-sm'>
          <input
            id='tweet-bg-color'
            type='color'
            value={options.backgroundColor}
            onChange={(e) =>
              onChange({
                themeId: undefined,
                backgroundColor: e.target.value,
                backgroundImage: undefined,
              })
            }
            className='absolute -inset-2 w-12 h-12 cursor-pointer border-0 p-0 bg-transparent'
            aria-label='Custom background color'
          />
        </div>
        <span className='font-mono text-xs text-foreground/50'>
          {options.backgroundColor}
        </span>
      </div>
    </div>

    {/* Dark card row */}
    <div className='flex items-center justify-between gap-4 rounded-xl bg-foreground-light/10 dark:bg-foreground-dark/10 p-3 transition-colors hover:bg-foreground-light/15 dark:hover:bg-foreground-dark/15'>
      <div className='flex items-center gap-3'>
        <MoonIcon />
        <span className='text-sm font-medium text-foreground'>Dark Card</span>
      </div>
      <Switch
        checked={options.darkCard}
        onCheckedChange={(checked) => onChange({ darkCard: checked })}
        className='data-[state=checked]:bg-[#1D9BF0]'
      />
    </div>

    {/* Branded video row */}
    <div className='flex items-center justify-between gap-4 rounded-xl bg-foreground-light/10 dark:bg-foreground-dark/10 p-3 transition-colors hover:bg-foreground-light/15 dark:hover:bg-foreground-dark/15'>
      <div className='flex items-center gap-3'>
        <VideoIcon />
        <span className='text-sm font-medium text-foreground'>
          Branded Video
        </span>
      </div>
      <Switch
        checked={options.enableBrandedVideo}
        onCheckedChange={(checked) => onChange({ enableBrandedVideo: checked })}
        className='data-[state=checked]:bg-brand-orange'
      />
    </div>

    {/* Aspect ratio row */}
    <div className='flex items-center justify-between gap-4 rounded-xl bg-foreground-light/10 dark:bg-foreground-dark/10 p-3 transition-colors hover:bg-foreground-light/15 dark:hover:bg-foreground-dark/15'>
      <div className='flex items-center gap-3'>
        <AspectRatioIcon />
        <span className='text-sm font-medium text-foreground'>
          Aspect Ratio
        </span>
      </div>
      <select
        id='tweet-aspect'
        value={options.aspect}
        onChange={(e) =>
          onChange({ aspect: e.target.value as TweetScreenshotAspect })
        }
        className='rounded-lg border border-border-light/60 dark:border-border-dark/60 bg-background-light px-2.5 py-1 text-sm dark:bg-background-dark text-foreground font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-orange'
      >
        {ASPECTS.map((a) => (
          <option key={a.id} value={a.id}>
            {a.label}
          </option>
        ))}
      </select>
    </div>

    {/* Watermark Section */}
    <div className='flex flex-col gap-3 rounded-xl border border-border-light/50 dark:border-border-dark/50 p-3 bg-foreground-light/5 dark:bg-foreground-dark/5'>
      <h4 className='text-xs font-semibold uppercase tracking-wider text-foreground/50 px-1'>
        Watermark Styling
      </h4>

      {/* Watermark text/logo color row */}
      <div className='flex items-center justify-between gap-4 rounded-lg bg-foreground-light/10 dark:bg-foreground-dark/10 p-2.5 transition-colors hover:bg-foreground-light/15 dark:hover:bg-foreground-dark/15'>
        <div className='flex items-center gap-3'>
          <DropletIcon />
          <span className='text-sm font-medium text-foreground'>
            Text & Logo Color
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='relative w-7 h-7 rounded-full overflow-hidden border border-black/10 shadow-sm'>
            <input
              id='tweet-watermark-color'
              type='color'
              value={options.watermarkColor || '#FFFFFF'}
              onChange={(e) => onChange({ watermarkColor: e.target.value })}
              className='absolute -inset-2 w-12 h-12 cursor-pointer border-0 p-0 bg-transparent'
              aria-label='Watermark text/logo color picker'
            />
          </div>
          <span className='font-mono text-xs text-foreground/50'>
            {options.watermarkColor || '#FFFFFF'}
          </span>
        </div>
      </div>

      {/* Watermark accent color row */}
      <div className='flex flex-col gap-2 rounded-lg bg-foreground-light/10 dark:bg-foreground-dark/10 p-2.5 transition-colors hover:bg-foreground-light/15 dark:hover:bg-foreground-dark/15'>
        <div className='flex items-center gap-3 mb-1'>
          <DropletIcon />
          <span className='text-sm font-medium text-foreground'>
            Accent Dot Color
          </span>
        </div>
        <AccentColorPicker
          value={options.watermarkAccentColor || '#FF5542'}
          onChange={(color) => onChange({ watermarkAccentColor: color })}
        />
      </div>
    </div>

    {/* Toggles list */}
    <div className='flex flex-col gap-2'>
      {TOGGLES.map(({ key, label, icon: IconComponent }) => (
        <div
          key={key}
          className='flex items-center justify-between gap-4 rounded-xl bg-foreground-light/10 dark:bg-foreground-dark/10 p-3 transition-colors hover:bg-foreground-light/15 dark:hover:bg-foreground-dark/15'
        >
          <div className='flex items-center gap-3'>
            <IconComponent />
            <span className='text-sm font-medium text-foreground'>{label}</span>
          </div>
          <Switch
            checked={options[key]}
            onCheckedChange={(checked) => onChange({ [key]: checked })}
            className='data-[state=checked]:bg-[#1D9BF0]'
          />
        </div>
      ))}
    </div>
  </div>
);
