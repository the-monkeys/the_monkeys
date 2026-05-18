/**
 * Satori-safe primitives. ONLY use inline styles, flex layouts, and <div>/<span>/<img>.
 * If you add a new primitive, audit it against https://github.com/vercel/satori#documentation.
 */
import { CSSProperties } from 'react';

import { SnapshotInput, SnapshotTheme } from '../types';

export const FONT_STACK =
  '"DM Sans","Inter","Helvetica Neue",Helvetica,Arial,sans-serif';

/**
 * Resolves the root background for a template, honouring (in order):
 *   1. `input.backgroundImageUrl` — full-bleed image with darken overlay.
 *   2. `theme.backgroundImage` — gradient or other CSS background.
 *   3. `theme.background` — solid colour fallback.
 *
 * Returned style is meant to be spread onto the template's root `<div>`.
 */
export const getShellBackground = (
  theme: SnapshotTheme,
  input: SnapshotInput
): CSSProperties => {
  if (input.backgroundImageUrl) {
    const overlay = Math.max(0, Math.min(1, input.backgroundOverlay ?? 0.55));
    const tint =
      theme.mode === 'light'
        ? `rgba(255,255,255,${overlay})`
        : `rgba(0,0,0,${overlay})`;
    return {
      backgroundColor: theme.background,
      backgroundImage: `linear-gradient(${tint}, ${tint}), url("${input.backgroundImageUrl}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }
  if (theme.backgroundImage) {
    return {
      backgroundColor: theme.background,
      backgroundImage: theme.backgroundImage,
    };
  }
  return { backgroundColor: theme.background };
};

export const SHELL_BASE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  fontFamily: FONT_STACK,
  position: 'relative',
  overflow: 'hidden',
};

export const Row: React.FC<{
  children: React.ReactNode;
  style?: CSSProperties;
}> = ({ children, style }) => (
  <div style={{ display: 'flex', flexDirection: 'row', ...style }}>
    {children}
  </div>
);

export const Col: React.FC<{
  children: React.ReactNode;
  style?: CSSProperties;
}> = ({ children, style }) => (
  <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
    {children}
  </div>
);

export const AccentBar: React.FC<{
  color: string;
  width?: number;
  height?: number;
}> = ({ color, width = 64, height = 6 }) => (
  <div
    style={{
      display: 'flex',
      width,
      height,
      backgroundColor: color,
      borderRadius: 999,
    }}
  />
);

export const Tag: React.FC<{ label: string; color: string; bg: string }> = ({
  label,
  color,
  bg,
}) => (
  <div
    style={{
      display: 'flex',
      paddingLeft: 14,
      paddingRight: 14,
      paddingTop: 6,
      paddingBottom: 6,
      borderRadius: 999,
      backgroundColor: bg,
      color,
      fontSize: 22,
      fontWeight: 500,
      letterSpacing: -0.2,
    }}
  >
    {label}
  </div>
);

export const Avatar: React.FC<{
  src?: string;
  fallback: string;
  size?: number;
  accent: string;
}> = ({ src, fallback, size = 64, accent }) => {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=''
        width={size}
        height={size}
        style={{
          width: size,
          height: size,
          borderRadius: size,
          objectFit: 'cover',
          display: 'flex',
        }}
      />
    );
  }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: accent,
        color: '#FFFFFF',
        fontWeight: 700,
        fontSize: size * 0.42,
      }}
    >
      {fallback.slice(0, 2).toUpperCase()}
    </div>
  );
};

/**
 * Public logo asset. Resolved by the browser via Next's /public folder for
 * `html-to-image`. For Satori (server-side render) callers must pre-inline
 * this as a data URI — track via `LOGO_ASSET_PATH`.
 */
export const LOGO_ASSET_PATH = '/logo-brand.svg';
export const BRAND_URL = 'monkeys.com.co';

export const Logo: React.FC<{
  color: string;
  accent: string;
  size?: number;
}> = ({ color, accent, size = 26 }) => {
  const iconSize = Math.round(size * 1.6);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_ASSET_PATH}
        alt=''
        width={iconSize}
        height={iconSize}
        style={{ width: iconSize, height: iconSize, display: 'flex' }}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          color,
          fontWeight: 700,
          fontSize: size,
          letterSpacing: -0.5,
        }}
      >
        <span style={{ display: 'flex' }}>{BRAND_URL}</span>
        <span style={{ display: 'flex', color: accent }}>.</span>
      </div>
    </div>
  );
};

/** Truncate-by-words helper (Satori has no `text-overflow`). */
export const clip = (text: string | undefined, max: number): string => {
  if (!text) return '';
  const t = text.trim();
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + '…';
};
