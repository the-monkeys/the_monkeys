/**
 * Business Card — Satori-safe template primitives.
 * Only inline styles, flex layouts, <div>/<span>/<img>.
 */
import { CSSProperties } from 'react';

import {
  AVATAR_SIZE_MAP,
  CardContact,
  CardCustomization,
  CardRenderProps,
  CardTheme,
  FONT_FAMILY_MAP,
  FONT_SIZE_MAP,
  LOGO_SIZE_MAP,
  SocialNetwork,
} from '../types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Standard business card: 3.5 × 2 inches at 300 DPI = 1050 × 600 */
export const CARD_WIDTH = 1050;
export const CARD_HEIGHT = 600;

export const CARD_BASE: CSSProperties = {
  display: 'flex',
  position: 'relative',
  overflow: 'hidden',
};

// ---------------------------------------------------------------------------
// Color / size helpers
// ---------------------------------------------------------------------------

/** Convert a hex color to an rgba() string with the given alpha. */
export const hexToRgba = (hex: string, alpha: number): string => {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h.slice(0, 6);
  const int = parseInt(full, 16);
  if (Number.isNaN(int)) return hex;
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return `rgba(${r},${g},${b},${alpha})`;
};

export const getCardFont = (c: CardCustomization): string =>
  FONT_FAMILY_MAP[c.fontFamily];

export const getScaledSize = (base: number, c: CardCustomization): number =>
  Math.round(base * FONT_SIZE_MAP[c.fontSize]);

export const getLogoSize = (c: CardCustomization): number =>
  LOGO_SIZE_MAP[c.logoSize];

export const getAvatarSize = (c: CardCustomization): number =>
  AVATAR_SIZE_MAP[c.fontSize]; // scale avatar with font size

export const getAvatarRadius = (
  size: number,
  shape: CardCustomization['avatarShape']
): number => {
  switch (shape) {
    case 'circle':
      return size;
    case 'rounded':
      return size * 0.2;
    case 'square':
      return 4;
  }
};

export const getCardBackground = (theme: CardTheme): CSSProperties => {
  if (theme.backgroundImage) {
    return {
      backgroundColor: theme.background,
      backgroundImage: theme.backgroundImage,
    };
  }
  return { backgroundColor: theme.background };
};

export const fullName = (first: string, last: string): string =>
  `${first} ${last}`.trim();

// ---------------------------------------------------------------------------
// Social Icons — real brand glyphs (simple-icons paths, 24×24 viewBox).
// Rendered as inline SVG. The card is exported via html-to-image (DOM), so
// SVG is fully supported. The glyph inherits the theme icon color; networks
// without a brand path fall back to a short text label.
// ---------------------------------------------------------------------------

const SOCIAL_ICON_PATHS: Partial<Record<SocialNetwork, string>> = {
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  github:
    'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  instagram:
    'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  facebook:
    'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  youtube:
    'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  dribbble:
    'M12 0C5.372 0 0 5.373 0 12s5.372 12 12 12c6.627 0 12-5.373 12-12S18.627 0 12 0zm9.885 11.441c-2.575-.422-4.943-.445-7.103-.073-.244-.563-.497-1.125-.767-1.68 2.31-1 4.165-2.358 5.548-4.082a9.863 9.863 0 012.322 5.835zm-3.842-7.282c-1.205 1.554-2.868 2.783-4.986 3.68a46.287 46.287 0 00-3.488-5.438A9.894 9.894 0 0112 2.087c2.275 0 4.368.779 6.043 2.072zM7.527 3.166a44.59 44.59 0 013.537 5.381c-2.43.715-5.331 1.082-8.684 1.105a9.931 9.931 0 015.147-6.486zM2.113 12.29c3.664-.023 6.868-.451 9.596-1.284.246.478.479.965.71 1.469-.201.06-.4.126-.598.196-2.803.984-5.09 2.717-6.842 5.229a9.849 9.849 0 01-2.866-5.61zm4.394 7.36c1.582-2.309 3.636-3.891 6.176-4.766.849 2.213 1.454 4.507 1.813 6.887a9.836 9.836 0 01-7.989-2.121zm10.13.943a52.53 52.53 0 00-1.653-6.293c1.936-.267 3.994-.19 6.183.23a9.882 9.882 0 01-4.53 6.063z',
  behance:
    'M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.201 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z',
  medium:
    'M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z',
  website:
    'M12 2a10 10 0 100 20 10 10 0 000-20zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14a7.96 7.96 0 010-4h3.38a16.6 16.6 0 000 4H4.26zm.81 2h2.95c.3 1.28.77 2.5 1.38 3.56A7.99 7.99 0 015.07 16zm2.95-8H5.07a7.99 7.99 0 014.33-3.56A15.65 15.65 0 008.02 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66a14.9 14.9 0 010-4h4.68a14.9 14.9 0 010 4zm.25 5.56c.61-1.06 1.08-2.28 1.38-3.56h2.95a7.99 7.99 0 01-4.33 3.56zM16.36 14a16.6 16.6 0 000-4h3.38a7.96 7.96 0 010 4h-3.38z',
};

const SOCIAL_FALLBACK: Record<SocialNetwork, string> = {
  linkedin: 'in',
  x: '𝕏',
  github: 'GH',
  dribbble: 'Dr',
  behance: 'Bē',
  instagram: 'IG',
  facebook: 'fb',
  youtube: 'YT',
  medium: 'M',
  monkeys: '🐵',
  website: '@',
};

export const SocialIcon: React.FC<{
  network: SocialNetwork;
  color: string;
  bg: string;
  size?: number;
}> = ({ network, color, bg, size = 28 }) => {
  const path = SOCIAL_ICON_PATHS[network];
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: bg,
        color,
        fontSize: size * 0.42,
        fontWeight: 700,
      }}
    >
      {path ? (
        <svg
          width={size * 0.58}
          height={size * 0.58}
          viewBox='0 0 24 24'
          fill={color}
          xmlns='http://www.w3.org/2000/svg'
        >
          <path d={path} />
        </svg>
      ) : (
        SOCIAL_FALLBACK[network]
      )}
    </div>
  );
};

export const SocialLinksRow: React.FC<{
  links: CardRenderProps['input']['socialLinks'];
  iconColor: string;
  iconBg: string;
  iconSize?: number;
  gap?: number;
}> = ({ links, iconColor, iconBg, iconSize = 24, gap = 8 }) => {
  if (!links.length) return null;
  return (
    <div
      style={{ display: 'flex', flexDirection: 'row', gap, flexWrap: 'wrap' }}
    >
      {links.slice(0, 6).map((link) => (
        <SocialIcon
          key={link.network}
          network={link.network}
          color={iconColor}
          bg={iconBg}
          size={iconSize}
        />
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Media primitives
// ---------------------------------------------------------------------------

export const CardAvatar: React.FC<{
  src?: string;
  fallback: string;
  size: number;
  shape: CardCustomization['avatarShape'];
  accent: string;
  ring?: string;
}> = ({ src, fallback, size, shape, accent, ring }) => {
  const radius = getAvatarRadius(size, shape);
  const ringStyle: CSSProperties = ring ? { border: `3px solid ${ring}` } : {};
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
          borderRadius: radius,
          objectFit: 'cover',
          display: 'flex',
          ...ringStyle,
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
        borderRadius: radius,
        backgroundColor: accent,
        color: '#FFFFFF',
        fontWeight: 700,
        fontSize: size * 0.38,
        ...ringStyle,
      }}
    >
      {fallback.slice(0, 2).toUpperCase() || '★'}
    </div>
  );
};

export const CardLogo: React.FC<{
  src?: string;
  size: number;
}> = ({ src, size }) => {
  if (!src) return null;
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
        objectFit: 'contain',
        display: 'flex',
      }}
    />
  );
};

/** Scannable QR on a white, print-safe plate. */
export const CardQr: React.FC<{
  src?: string;
  size: number;
  border?: string;
}> = ({ src, size, border }) => {
  if (!src) return null;
  const pad = Math.round(size * 0.09);
  return (
    <div
      style={{
        display: 'flex',
        padding: pad,
        backgroundColor: '#FFFFFF',
        borderRadius: Math.round(size * 0.14),
        border: border ? `1px solid ${border}` : 'none',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=''
        width={size}
        height={size}
        style={{ width: size, height: size, display: 'flex' }}
      />
    </div>
  );
};

export const Divider: React.FC<{
  color: string;
  vertical?: boolean;
  thickness?: number;
  length?: string | number;
}> = ({ color, vertical, thickness = 1, length = '100%' }) => (
  <div
    style={{
      display: 'flex',
      width: vertical ? thickness : length,
      height: vertical ? length : thickness,
      backgroundColor: color,
      flexShrink: 0,
    }}
  />
);

// ---------------------------------------------------------------------------
// Text composites
// ---------------------------------------------------------------------------

/** Name + role + company, with alignment and color overrides. */
export const NameBlock: React.FC<{
  name: string;
  jobTitle?: string;
  company?: string;
  department?: string;
  nameSize: number;
  foreground: string;
  accent: string;
  muted: string;
  align?: 'left' | 'center' | 'right';
  nameWeight?: number;
  nameColor?: string;
  titleUppercase?: boolean;
  gap?: number;
}> = ({
  name,
  jobTitle,
  company,
  department,
  nameSize,
  foreground,
  accent,
  muted,
  align = 'left',
  nameWeight = 700,
  nameColor,
  titleUppercase = false,
  gap = 4,
}) => {
  const org = [company, department].filter(Boolean).join(' · ');
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap,
        alignItems:
          align === 'center'
            ? 'center'
            : align === 'right'
              ? 'flex-end'
              : 'flex-start',
        textAlign: align,
      }}
    >
      <div
        style={{
          display: 'flex',
          fontSize: nameSize,
          fontWeight: nameWeight,
          color: nameColor ?? foreground,
          letterSpacing: -0.5,
          lineHeight: 1.08,
        }}
      >
        {name || 'Your Name'}
      </div>
      {jobTitle && (
        <div
          style={{
            display: 'flex',
            fontSize: Math.round(nameSize * 0.4),
            fontWeight: 600,
            color: accent,
            letterSpacing: titleUppercase ? 2 : 0,
            textTransform: titleUppercase ? ('uppercase' as const) : 'none',
          }}
        >
          {jobTitle}
        </div>
      )}
      {org && (
        <div
          style={{
            display: 'flex',
            fontSize: Math.round(nameSize * 0.36),
            fontWeight: 500,
            color: muted,
          }}
        >
          {org}
        </div>
      )}
    </div>
  );
};

/** Single contact row: an accent marker + text. */
export const ContactLine: React.FC<{
  text: string;
  color: string;
  fontSize: number;
  accent: string;
}> = ({ text, color, fontSize, accent }) => {
  if (!text) return null;
  const dot = Math.max(5, Math.round(fontSize * 0.4));
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        color,
        fontSize,
        lineHeight: 1.35,
      }}
    >
      <span
        style={{
          display: 'flex',
          width: dot,
          height: dot,
          borderRadius: dot,
          backgroundColor: accent,
          flexShrink: 0,
        }}
      />
      <span style={{ display: 'flex' }}>{text}</span>
    </div>
  );
};

/** The full contact list (email/phone/website/address), skipping empties. */
export const ContactList: React.FC<{
  contact: CardContact;
  color: string;
  fontSize: number;
  accent: string;
  gap?: number;
}> = ({ contact, color, fontSize, accent, gap = 8 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap }}>
    <ContactLine
      text={contact.email ?? ''}
      color={color}
      fontSize={fontSize}
      accent={accent}
    />
    <ContactLine
      text={contact.phone ?? ''}
      color={color}
      fontSize={fontSize}
      accent={accent}
    />
    <ContactLine
      text={contact.website ?? ''}
      color={color}
      fontSize={fontSize}
      accent={accent}
    />
    <ContactLine
      text={contact.address ?? ''}
      color={color}
      fontSize={fontSize}
      accent={accent}
    />
  </div>
);
