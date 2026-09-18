import type {
  SocialAccount,
  SocialHistoryEntry,
  SocialJob,
  SocialMediaAsset,
  SocialPost,
  SocialPostFilters,
  SocialPostInput,
  SocialPostList,
  SocialPostRendition,
  SocialScheduleInput,
  ValidationMetadata,
} from '@/features/studio/types';
import axiosInstance from '@/services/api/axiosInstance';

const root = '/social-posts';

const idempotencyKey = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const mutationConfig = (expectedVersion?: number) => ({
  headers: { 'Idempotency-Key': idempotencyKey() },
  ...(expectedVersion === undefined
    ? {}
    : { params: { expected_version: expectedVersion } }),
});

export const socialPostsApi = {
  async list(filters: SocialPostFilters = {}) {
    const { data } = await axiosInstance.get<SocialPostList>(root, {
      params: { ...filters, states: filters.states?.join(',') },
    });
    return data;
  },
  async calendar(
    params: Pick<SocialPostFilters, 'from' | 'to' | 'page_size'> = {}
  ) {
    const { data } = await axiosInstance.get<SocialPostList>(
      `${root}/calendar`,
      { params }
    );
    return data;
  },
  async queue(page_size?: number) {
    const { data } = await axiosInstance.get<SocialPostList>(`${root}/queue`, {
      params: { page_size },
    });
    return data;
  },
  async reorderQueue(post_ids_in_order: string[]) {
    const { data } = await axiosInstance.put<SocialPostList>(
      `${root}/queue/order`,
      { post_ids_in_order }
    );
    return data;
  },
  async get(id: string): Promise<SocialPost> {
    const { data } = await axiosInstance.get<any>(`${root}/${id}`);
    return ((data as any)?.post ?? data) as SocialPost;
  },
  async create(input: SocialPostInput): Promise<SocialPost> {
    const { data } = await axiosInstance.post<any>(
      root,
      input,
      mutationConfig()
    );
    return ((data as any)?.post ?? data) as SocialPost;
  },
  async update(
    id: string,
    input: SocialPostInput,
    expected_version: number
  ): Promise<SocialPost> {
    const { data } = await axiosInstance.patch<any>(
      `${root}/${id}`,
      { ...input, expected_version },
      mutationConfig(expected_version)
    );
    return ((data as any)?.post ?? data) as SocialPost;
  },
  async delete(id: string, expectedVersion?: number): Promise<void> {
    await axiosInstance.delete(`${root}/${id}`, {
      ...(expectedVersion !== undefined
        ? { data: { expected_version: expectedVersion } }
        : {}),
      ...mutationConfig(expectedVersion),
    });
  },
  async upsertRendition(
    id: string,
    rendition: SocialPostRendition,
    expected_version: number
  ): Promise<SocialPost> {
    const { data } = await axiosInstance.put<any>(
      `${root}/${id}/renditions`,
      { ...rendition, expected_version },
      mutationConfig(expected_version)
    );
    return ((data as any)?.post ?? data) as SocialPost;
  },
  async setRenditionMedia(
    id: string,
    social_account_id: string,
    asset_ids: string[],
    expected_version: number
  ): Promise<SocialPost> {
    const { data } = await axiosInstance.put<any>(
      `${root}/${id}/renditions/media`,
      { social_account_id, asset_ids, expected_version },
      mutationConfig(expected_version)
    );
    return ((data as any)?.post ?? data) as SocialPost;
  },
  async schedule(
    id: string,
    input: SocialScheduleInput,
    reschedule = false
  ): Promise<SocialPost> {
    const method = reschedule ? 'put' : 'post';
    const { data } = await axiosInstance.request<any>({
      method,
      url: `${root}/${id}/schedule`,
      data: input,
      ...mutationConfig(input.expected_version),
    });
    return ((data as any)?.post ?? data) as SocialPost;
  },
  async cancelSchedule(id: string, expected_version: number): Promise<void> {
    await axiosInstance.delete(`${root}/${id}/schedule`, {
      ...(expected_version !== undefined ? { data: { expected_version } } : {}),
      ...mutationConfig(expected_version),
    });
  },
  async publishNow(id: string, expected_version: number): Promise<SocialPost> {
    const { data } = await axiosInstance.post<any>(
      `${root}/${id}/publish-now`,
      { expected_version },
      mutationConfig(expected_version)
    );
    return ((data as any)?.post ?? data) as SocialPost;
  },
  async history(id: string, page_size?: number) {
    const { data } = await axiosInstance.get<SocialHistoryEntry[]>(
      `${root}/${id}/history`,
      { params: { page_size } }
    );
    return data;
  },
  async job(id: string) {
    const { data } = await axiosInstance.get<SocialJob>(`${root}/jobs/${id}`);
    return data;
  },
  async replayJob(id: string) {
    const { data } = await axiosInstance.post<SocialJob>(
      `${root}/jobs/${id}/replay`
    );
    return data;
  },
  async accounts(): Promise<SocialAccount[]> {
    const { data } = await axiosInstance.get<any>(`${root}/accounts`);
    const accounts = (data as any)?.accounts ?? data;
    return Array.isArray(accounts) ? (accounts as SocialAccount[]) : [];
  },
  async validationMetadata(): Promise<ValidationMetadata[]> {
    const { data } = await axiosInstance.get<any>(
      `${root}/validation-metadata`
    );
    return (data as any)?.platforms ?? data;
  },
  async media(page_size?: number): Promise<SocialMediaAsset[]> {
    const { data } = await axiosInstance.get<any>(`${root}/media`, {
      params: { page_size },
    });
    const assets = (data as any)?.assets ?? (data as any)?.items ?? data;
    return Array.isArray(assets) ? (assets as SocialMediaAsset[]) : [];
  },
  async importMedia(source_asset_ref: string, source_kind: string) {
    const { data } = await axiosInstance.post<any>(
      `${root}/media/import`,
      { source_asset_ref, source_kind },
      mutationConfig()
    );
    const assets = (data as any)?.assets ?? (data as any)?.items ?? data;
    return Array.isArray(assets) ? (assets as SocialMediaAsset[]) : assets;
  },
  async deleteMedia(assetID: string) {
    await axiosInstance.delete(`${root}/media/${assetID}`);
  },
};
