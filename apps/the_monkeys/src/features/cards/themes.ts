import { CardTheme } from './types';

export const CARD_THEMES: CardTheme[] = [
  {
    id: 'light',
    label: 'Light',
    mode: 'light',
    background: '#FFFFFF',
    surface: '#F7F7F5',
    foreground: '#0A0A0A',
    muted: '#6B7280',
    border: '#E5E7EB',
    accent: '#2563EB',
  },
  {
    id: 'dark',
    label: 'Dark',
    mode: 'dark',
    background: '#0F0F0F',
    surface: '#1A1A1A',
    foreground: '#F5F5F5',
    muted: '#9CA3AF',
    border: '#262626',
    accent: '#60A5FA',
  },
  {
    id: 'brand',
    label: 'Brand',
    mode: 'dark',
    background: '#1A0E0B',
    surface: '#2A1714',
    foreground: '#FFF4F1',
    muted: '#E8B8AE',
    border: '#4A2520',
    accent: '#FF5542',
  },
  {
    id: 'minimal',
    label: 'Minimal',
    mode: 'light',
    background: '#FAFAFA',
    surface: '#F0F0F0',
    foreground: '#333333',
    muted: '#888888',
    border: '#E0E0E0',
    accent: '#555555',
  },
  {
    id: 'corporate',
    label: 'Corporate',
    mode: 'dark',
    background: '#0D1B2A',
    surface: '#1B2838',
    foreground: '#E0E1DD',
    muted: '#778DA9',
    border: '#2A3F54',
    accent: '#778DA9',
  },
  {
    id: 'ocean',
    label: 'Ocean',
    mode: 'dark',
    background: '#0B1E2D',
    backgroundImage:
      'linear-gradient(160deg, #0F2F4F 0%, #0E7490 55%, #14B8A6 100%)',
    surface: 'rgba(255,255,255,0.10)',
    foreground: '#F0FAFE',
    muted: 'rgba(240,250,254,0.78)',
    border: 'rgba(240,250,254,0.28)',
    accent: '#14B8A6',
  },
];

export const DEFAULT_THEME_ID = 'light';

export const ACCENT_PALETTE: string[] = [
  '#2563EB', // blue
  '#FF5542', // brand orange
  '#10B981', // emerald
  '#8B5CF6', // violet
  '#EC4899', // pink
  '#F59E0B', // amber
  '#0EA5E9', // sky
  '#0A0A0A', // ink
];

export const getThemeById = (id: string | undefined): CardTheme =>
  CARD_THEMES.find((t) => t.id === id) ?? CARD_THEMES[0];
