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
    id: 'material',
    label: 'Material',
    mode: 'light',
    background: '#E3F2FD',
    backgroundImage:
      'linear-gradient(160deg, #E8EAF6 0%, #C5CAE9 40%, #90CAF9 100%)',
    surface: '#FFFFFF',
    foreground: '#0D47A1',
    muted: '#455A64',
    border: '#90CAF9',
    accent: '#1976D2',
  },
  {
    id: 'material-dark',
    label: 'Material Dark',
    mode: 'dark',
    background: '#121212',
    backgroundImage:
      'linear-gradient(160deg, #121212 0%, #1E1E1E 50%, #4527A0 100%)',
    surface: '#1E1E1E',
    foreground: '#E8EAF6',
    muted: '#9E9E9E',
    border: '#424242',
    accent: '#BB86FC',
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
    id: 'rose',
    label: 'Rose',
    mode: 'light',
    background: '#FFF1F2',
    backgroundImage:
      'linear-gradient(180deg, #FFF1F2 0%, #FECDD3 45%, #F9A8D4 100%)',
    surface: '#FFFFFF',
    foreground: '#881337',
    muted: '#9F1239',
    border: '#FDA4AF',
    accent: '#E11D48',
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
    id: 'midnight',
    label: 'Midnight',
    mode: 'dark',
    background: '#0A1628',
    backgroundImage:
      'linear-gradient(145deg, #0A1628 0%, #1A237E 55%, #00838F 100%)',
    surface: 'rgba(255,255,255,0.08)',
    foreground: '#E3F2FD',
    muted: 'rgba(227,242,253,0.72)',
    border: 'rgba(227,242,253,0.22)',
    accent: '#00E5FF',
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
    id: 'ember',
    label: 'Ember',
    mode: 'dark',
    background: '#1A0A00',
    backgroundImage:
      'linear-gradient(135deg, #450A0A 0%, #C2410C 50%, #FBBF24 100%)',
    surface: 'rgba(255,255,255,0.10)',
    foreground: '#FFF7ED',
    muted: 'rgba(255,247,237,0.78)',
    border: 'rgba(255,247,237,0.28)',
    accent: '#FDE047',
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
