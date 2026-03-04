import axiosInstanceV2 from '../api/axiosInstanceV2';

export interface StorageV2FileMeta {
  object: string;
  etag: string;
  size: number;
  contentType: string;
  lastModified: string;
  cacheControl: string;
  blurhash?: string;
  width?: number;
  height?: number;
  url: string;
}

export interface StorageV2UploadResponse {
  bucket: string;
  object: string;
  fileName: string;
  etag: string;
  size: number;
  contentType: string;
}

export interface StorageV2UrlResponse {
  url: string;
  expiresIn: number;
}

export const storageV2 = {
  // Profile Image
  uploadProfileImage: async (userId: string, file: File) => {
    const formData = new FormData();
    formData.append('profile_pic', file);

    const response = await axiosInstanceV2.post<StorageV2UploadResponse>(
      `/storage/profiles/${userId}/profile`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  getProfileImageMeta: async (userId: string) => {
    const response = await axiosInstanceV2.get<StorageV2FileMeta>(
      `/storage/profiles/${userId}/profile/meta`
    );
    return response.data;
  },

  getProfileImageUrl: async (userId: string) => {
    const response = await axiosInstanceV2.get<StorageV2UrlResponse>(
      `/storage/profiles/${userId}/profile/url`
    );
    return response.data;
  },

  deleteProfileImage: async (userId: string) => {
    const response = await axiosInstanceV2.delete(
      `/storage/profiles/${userId}/profile`
    );
    return response.data;
  },

  // Blog Images
  uploadBlogImage: async (blogId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstanceV2.post<StorageV2UploadResponse>(
      `/storage/posts/${blogId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  getBlogImageMeta: async (blogId: string, fileName: string) => {
    const response = await axiosInstanceV2.get<StorageV2FileMeta>(
      `/storage/posts/${blogId}/${fileName}/meta`
    );
    return response.data;
  },

  getBlogImageUrl: async (blogId: string, fileName: string) => {
    const response = await axiosInstanceV2.get<StorageV2UrlResponse>(
      `/storage/posts/${blogId}/${fileName}/url`
    );
    return response.data;
  },

  // Generic File Support (Aliases for clarity)
  uploadBlogFile: async (blogId: string, file: File) => {
    return storageV2.uploadBlogImage(blogId, file);
  },

  getBlogFileUrl: async (blogId: string, fileName: string) => {
    return storageV2.getBlogImageUrl(blogId, fileName);
  },

  deleteBlogFile: async (blogId: string, fileName: string) => {
    const response = await axiosInstanceV2.delete(
      `/storage/posts/${blogId}/${fileName}`
    );
    return response.data;
  },
};
