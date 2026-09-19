'use client';

import MediaGalleryView from '@/features/studio/components/media/MediaGalleryView';
import { useSocialMedia } from '@/hooks/studio/useSocialPosts';

export default function MediaPage() {
  const { data, isLoading, isError } = useSocialMedia();
  const assets = Array.isArray(data) ? data : [];

  return (
    <MediaGalleryView
      assets={assets}
      isLoading={Boolean(isLoading)}
      isError={Boolean(isError)}
    />
  );
}
