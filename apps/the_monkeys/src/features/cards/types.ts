/**
 * Business Card Generator — Type contracts
 *
 * Same Satori-safe rules as Snapshot v2: only <div>, <span>, <img>,
 * inline styles, flex layouts, explicit pixel sizes on root.
 */

// ---------------------------------------------------------------------------
// Social link
// ---------------------------------------------------------------------------

export type SocialNetwork =
  | 'linkedin'
  | 'x'
  | 'github'
  | 'dribbble'
  | 'behance'
  | 'instagram'
  | 'facebook'
  | 'youtube'
  | 'medium'
  | 'monkeys'
  | 'website';

export interface SocialLink {
  network: SocialNetwork;
  url: string;
}

// ---------------------------------------------------------------------------
// Card data
// ---------------------------------------------------------------------------

export interface CardContact {
  firstName: string;
  lastName: string;
  jobTitle?: string;
  department?: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
}

export interface CardCustomization {
  primaryColor: string;
  accentColor: string;
  fontFamily: CardFontFamily;
  fontSize: 'sm' | 'md' | 'lg';
  avatarShape: 'circle' | 'square' | 'rounded';
  logoSize: 'sm' | 'md' | 'lg';
  /** Render a scannable QR code (encodes the contact vCard). */
  showQr: boolean;
  /** Show the profile photo on the card (users may prefer initials only). */
  showAvatar: boolean;
}

export type CardFontFamily =
  | 'inter'
  | 'poppins'
  | 'playfair'
  | 'jetbrains'
  | 'georgia'
  | 'montserrat'
  | 'raleway'
  | 'roboto-slab';

export const FONT_FAMILY_MAP: Record<CardFontFamily, string> = {
  inter: 'var(--font-inter),"Helvetica Neue",Helvetica,Arial,sans-serif',
  poppins: 'var(--font-poppins),"Helvetica Neue",Helvetica,Arial,sans-serif',
  playfair: 'var(--font-playfair),Georgia,"Times New Roman",serif',
  jetbrains: 'var(--font-jetbrains),"Fira Code",monospace',
  georgia: 'Georgia,"Times New Roman",Times,serif',
  montserrat:
    'var(--font-montserrat),"Helvetica Neue",Helvetica,Arial,sans-serif',
  raleway: 'var(--font-raleway),"Helvetica Neue",Helvetica,Arial,sans-serif',
  'roboto-slab': 'var(--font-roboto-slab),Georgia,"Times New Roman",serif',
};

export const FONT_SIZE_MAP: Record<'sm' | 'md' | 'lg', number> = {
  sm: 0.85,
  md: 1,
  lg: 1.15,
};

export const LOGO_SIZE_MAP: Record<'sm' | 'md' | 'lg', number> = {
  sm: 40,
  md: 56,
  lg: 72,
};

export const AVATAR_SIZE_MAP: Record<'sm' | 'md' | 'lg', number> = {
  sm: 64,
  md: 80,
  lg: 100,
};

// ---------------------------------------------------------------------------
// Card input (what the user fills in)
// ---------------------------------------------------------------------------

export interface CardInput {
  contact: CardContact;
  socialLinks: SocialLink[];
  avatarUrl?: string;
  logoUrl?: string;
}

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

export interface CardTheme {
  id: string;
  label: string;
  mode: 'light' | 'dark';
  background: string;
  backgroundImage?: string;
  surface: string;
  foreground: string;
  muted: string;
  border: string;
  accent: string;
}

// ---------------------------------------------------------------------------
// Template
// ---------------------------------------------------------------------------

export interface CardRenderProps {
  input: CardInput;
  theme: CardTheme;
  customization: CardCustomization;
  /** Pre-generated QR data URL (PNG). Present only when showQr is enabled. */
  qrDataUrl?: string;
}

export interface CardTemplate {
  id: string;
  label: string;
  description: string;
  width: number;
  height: number;
  Render: (props: CardRenderProps) => JSX.Element;
}

// ---------------------------------------------------------------------------
// Editor state
// ---------------------------------------------------------------------------

export interface CardState {
  input: CardInput;
  templateId: string;
  themeId: string;
  customization: CardCustomization;
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export interface CardExportOptions {
  pixelRatio?: number;
  format?: 'png' | 'jpeg';
  quality?: number;
  filename?: string;
  download?: boolean;
}
