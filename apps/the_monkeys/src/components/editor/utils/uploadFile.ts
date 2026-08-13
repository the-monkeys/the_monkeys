import { useImageUploadStore } from '@/lib/store/useFileUpload';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';

export const uploadImage = async (blogId: string, file: File) => {
  const { beginUpload, endUpload } = useImageUploadStore.getState();
  beginUpload();

  try {
    const formData = new FormData();
    formData.append('file', file);

    // Upload via v2 storage API (MinIO-backed).
    // The v2 response includes a CDN URL in `response.data.url`
    // generated server-side from MINIO_CDN_URL config.
    // Storing the CDN URL directly means:
    //   - No runtime URL resolution on read
    //   - CDN/domain change = one-time ES migration, not code change
    //   - v1 routes are untouched, no frontend dependency on them
    const response = await axiosInstanceV2.post(
      `/storage/posts/${blogId}`,
      formData
    );

    return {
      success: 1,
      file: {
        url: response?.data?.url,
      },
    };
  } finally {
    endUpload();
  }
};
