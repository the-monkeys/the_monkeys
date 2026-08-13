import { create } from 'zustand';

interface ImageUploadStore {
  activeUploads: number;
  isImageUploading: boolean;
  beginUpload: () => void;
  endUpload: () => void;
}

export const useImageUploadStore = create<ImageUploadStore>((set) => ({
  activeUploads: 0,
  isImageUploading: false,
  beginUpload: () =>
    set((state) => ({
      activeUploads: state.activeUploads + 1,
      isImageUploading: true,
    })),
  endUpload: () =>
    set((state) => {
      const activeUploads = Math.max(0, state.activeUploads - 1);
      return { activeUploads, isImageUploading: activeUploads > 0 };
    }),
}));

export const useIsImageUploading = () =>
  useImageUploadStore((state) => state.isImageUploading);
