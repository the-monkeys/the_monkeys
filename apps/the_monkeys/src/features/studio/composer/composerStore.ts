import type { SocialPlatform } from '@/features/studio/types';
import { create } from 'zustand';

export interface ComposerMedia {
  id: string;
  url: string;
  name: string;
  mime_type?: string;
  size_bytes?: number;
}

export interface ComposerStoreState {
  baseText: string;
  selectedPlatforms: SocialPlatform[];
  activeTab: 'base' | SocialPlatform;
  overrides: Record<string, string>;
  isSynced: Record<string, boolean>;
  mediaAssets: ComposerMedia[];
  isScheduleDrawerOpen: boolean;
  isMediaLibraryOpen: boolean;
  activeViewMobile: 'edit' | 'preview';

  setBaseText: (text: string) => void;
  setSelectedPlatforms: (platforms: SocialPlatform[]) => void;
  togglePlatform: (platform: SocialPlatform) => void;
  selectAllPlatforms: (platforms: SocialPlatform[]) => void;
  clearAllPlatforms: () => void;
  setActiveTab: (tab: 'base' | SocialPlatform) => void;
  setOverride: (platform: SocialPlatform, text: string) => void;
  unsyncPlatform: (platform: SocialPlatform) => void;
  resetPlatformToBase: (platform: SocialPlatform) => void;
  addMedia: (media: ComposerMedia[]) => void;
  removeMedia: (id: string) => void;
  clearMedia: () => void;
  setIsScheduleDrawerOpen: (open: boolean) => void;
  setIsMediaLibraryOpen: (open: boolean) => void;
  setActiveViewMobile: (view: 'edit' | 'preview') => void;
  reset: () => void;
}

const DEFAULT_PLATFORMS: SocialPlatform[] = ['x', 'linkedin'];

export const useComposerStore = create<ComposerStoreState>((set) => ({
  baseText: '',
  selectedPlatforms: DEFAULT_PLATFORMS,
  activeTab: 'base',
  overrides: {},
  isSynced: {
    x: true,
    linkedin: true,
    instagram: true,
    facebook: true,
    youtube: true,
    tiktok: true,
  },
  mediaAssets: [],
  isScheduleDrawerOpen: false,
  isMediaLibraryOpen: false,
  activeViewMobile: 'edit',

  setBaseText: (baseText) => set({ baseText }),
  setSelectedPlatforms: (selectedPlatforms) => set({ selectedPlatforms }),
  togglePlatform: (platform) =>
    set((state) => {
      const exists = state.selectedPlatforms.includes(platform);
      const next = exists
        ? state.selectedPlatforms.filter((p) => p !== platform)
        : [...state.selectedPlatforms, platform];

      // If the currently active tab was deselected, switch to 'base'
      const activeTab =
        state.activeTab === platform && exists ? 'base' : state.activeTab;

      return { selectedPlatforms: next, activeTab };
    }),
  selectAllPlatforms: (platforms) => set({ selectedPlatforms: platforms }),
  clearAllPlatforms: () => set({ selectedPlatforms: [], activeTab: 'base' }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setOverride: (platform, text) =>
    set((state) => ({
      overrides: { ...state.overrides, [platform]: text },
      isSynced: { ...state.isSynced, [platform]: false },
    })),
  unsyncPlatform: (platform) =>
    set((state) => ({
      overrides: {
        ...state.overrides,
        [platform]: state.overrides[platform] ?? state.baseText,
      },
      isSynced: { ...state.isSynced, [platform]: false },
    })),
  resetPlatformToBase: (platform) =>
    set((state) => {
      const nextOverrides = { ...state.overrides };
      delete nextOverrides[platform];
      return {
        overrides: nextOverrides,
        isSynced: { ...state.isSynced, [platform]: true },
      };
    }),
  addMedia: (newMedia) =>
    set((state) => {
      const existingIds = new Set(state.mediaAssets.map((m) => m.id));
      const unique = newMedia.filter((m) => !existingIds.has(m.id));
      return { mediaAssets: [...state.mediaAssets, ...unique] };
    }),
  removeMedia: (id) =>
    set((state) => ({
      mediaAssets: state.mediaAssets.filter((m) => m.id !== id),
    })),
  clearMedia: () => set({ mediaAssets: [] }),
  setIsScheduleDrawerOpen: (isScheduleDrawerOpen) =>
    set({ isScheduleDrawerOpen }),
  setIsMediaLibraryOpen: (isMediaLibraryOpen) => set({ isMediaLibraryOpen }),
  setActiveViewMobile: (activeViewMobile) => set({ activeViewMobile }),
  reset: () =>
    set({
      baseText: '',
      selectedPlatforms: DEFAULT_PLATFORMS,
      activeTab: 'base',
      overrides: {},
      isSynced: {
        x: true,
        linkedin: true,
        instagram: true,
        facebook: true,
        youtube: true,
        tiktok: true,
      },
      mediaAssets: [],
      isScheduleDrawerOpen: false,
      isMediaLibraryOpen: false,
      activeViewMobile: 'edit',
    }),
}));
