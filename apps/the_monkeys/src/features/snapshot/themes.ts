import { SnapshotTheme } from './types';

export const SNAPSHOT_THEMES: SnapshotTheme[] = [
  {
    id: 'light',
    label: 'Light',
    mode: 'light',
    background: '#FFFFFF',
    surface: '#F7F7F5',
    foreground: '#0A0A0A',
    muted: '#525252',
    border: '#E5E5E5',
    accent: '#FF5542',
  },
  {
    id: 'dark',
    label: 'Dark',
    mode: 'dark',
    background: '#0A0A0A',
    surface: '#161616',
    foreground: '#F5F5F5',
    muted: '#A3A3A3',
    border: '#262626',
    accent: '#FF5542',
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
    id: 'sunset',
    label: 'Sunset',
    mode: 'dark',
    background: '#2A0E1F',
    backgroundImage:
      'linear-gradient(135deg, #FF5542 0%, #B91C5C 45%, #6B21A8 100%)',
    surface: 'rgba(255,255,255,0.10)',
    foreground: '#FFF5F0',
    muted: 'rgba(255,245,240,0.78)',
    border: 'rgba(255,245,240,0.28)',
    accent: '#FFE066',
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
    accent: '#FACC15',
  },
  {
    id: 'aurora',
    label: 'Aurora',
    mode: 'dark',
    background: '#0E0B1F',
    backgroundImage:
      'linear-gradient(145deg, #1E1B4B 0%, #6D28D9 50%, #DB2777 100%)',
    surface: 'rgba(255,255,255,0.10)',
    foreground: '#FAF5FF',
    muted: 'rgba(250,245,255,0.78)',
    border: 'rgba(250,245,255,0.28)',
    accent: '#34D399',
  },
  {
    id: 'paper',
    label: 'Paper',
    mode: 'light',
    background: '#F5F1E8',
    backgroundImage: 'linear-gradient(180deg, #F8F4EA 0%, #ECE3CC 100%)',
    surface: '#FFFFFF',
    foreground: '#1A1410',
    muted: '#5F574A',
    border: '#D9CFB8',
    accent: '#9B2C2C',
  },
  {
    id: 'forbes-gray',
    label: 'Forbes Gray',
    mode: 'light',
    background: '#E8E8E8',
    surface: '#F2F2F2',
    foreground: '#0A0A0A',
    muted: '#333333',
    border: '#C8C8C8',
    accent: '#0A0A0A',
  },
  {
    id: 'editorial-cream',
    label: 'Editorial Cream',
    mode: 'light',
    background: '#FAF8F5',
    surface: '#FFFFFF',
    foreground: '#121212',
    muted: '#4A4A4A',
    border: '#E0DDD6',
    accent: '#1A1A1A',
  },
  {
    id: 'ink',
    label: 'Ink',
    mode: 'dark',
    background: '#111111',
    surface: '#1C1C1C',
    foreground: '#FAFAFA',
    muted: '#B0B0B0',
    border: '#2E2E2E',
    accent: '#FFFFFF',
  },
  {
    id: 'forest',
    label: 'Forest',
    mode: 'dark',
    background: '#0F1A14',
    backgroundImage:
      'linear-gradient(160deg, #0F1A14 0%, #1B4332 55%, #2D6A4F 100%)',
    surface: 'rgba(255,255,255,0.08)',
    foreground: '#F0FFF4',
    muted: 'rgba(240,255,244,0.75)',
    border: 'rgba(240,255,244,0.22)',
    accent: '#95D5B2',
  },
  {
    id: 'slate',
    label: 'Slate',
    mode: 'light',
    background: '#E2E8F0',
    surface: '#F8FAFC',
    foreground: '#0F172A',
    muted: '#475569',
    border: '#CBD5E1',
    accent: '#2563EB',
  },
];

export const DEFAULT_THEME_ID = 'light';

/** Curated accent swatches the user can apply on top of any theme. */
export const ACCENT_PALETTE: string[] = [
  '#FF5542', // brand orange
  '#F59E0B', // amber
  '#10B981', // emerald
  '#0EA5E9', // sky
  '#6366F1', // indigo
  '#A855F7', // violet
  '#EC4899', // pink
  '#0A0A0A', // ink
];

export const getThemeById = (id: string | undefined): SnapshotTheme =>
  SNAPSHOT_THEMES.find((t) => t.id === id) ?? SNAPSHOT_THEMES[0];
