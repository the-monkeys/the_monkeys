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
  async get(id: string) {
    const { data } = await axiosInstance.get<SocialPost>(`${root}/${id}`);
    return data;
  },
  async create(input: SocialPostInput) {
    const { data } = await axiosInstance.post<SocialPost>(
      root,
      input,
      mutationConfig()
    );
    return data;
  },
  async update(id: string, input: SocialPostInput, expected_version: number) {
    const { data } = await axiosInstance.patch<SocialPost>(
      `${root}/${id}`,
      { ...input, expected_version },
      mutationConfig(expected_version)
    );
    return data;
  },
  async delete(id: string, expected_version: number) {
    await axiosInstance.delete(`${root}/${id}`, {
      data: { expected_version },
      ...mutationConfig(expected_version),
    });
  },
  async upsertRendition(
    id: string,
    rendition: SocialPostRendition,
    expected_version: number
  ) {
    const { data } = await axiosInstance.put<SocialPost>(
      `${root}/${id}/renditions`,
      { ...rendition, expected_version },
      mutationConfig(expected_version)
    );
    return data;
  },
  async setRenditionMedia(
    id: string,
    social_account_id: string,
    asset_ids: string[],
    expected_version: number
  ) {
    const { data } = await axiosInstance.put<SocialPost>(
      `${root}/${id}/renditions/media`,
      { social_account_id, asset_ids, expected_version },
      mutationConfig(expected_version)
    );
    return data;
  },
  async schedule(id: string, input: SocialScheduleInput, reschedule = false) {
    const method = reschedule ? 'put' : 'post';
    const { data } = await axiosInstance.request<SocialPost>({
      method,
      url: `${root}/${id}/schedule`,
      data: input,
      ...mutationConfig(input.expected_version),
    });
    return data;
  },
  async cancelSchedule(id: string, expected_version: number) {
    await axiosInstance.delete(`${root}/${id}/schedule`, {
      data: { expected_version },
      ...mutationConfig(expected_version),
    });
  },
  async publishNow(id: string, expected_version: number) {
    const { data } = await axiosInstance.post<SocialPost>(
      `${root}/${id}/publish-now`,
      { expected_version },
      mutationConfig(expected_version)
    );
    return data;
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
  async accounts() {
    const { data } = await axiosInstance.get<SocialAccount[]>(
      `${root}/accounts`
    );
    return data;
  },
  async validationMetadata() {
    const { data } = await axiosInstance.get(`${root}/validation-metadata`);
    return data;
  },
  async media(page_size?: number) {
    const { data } = await axiosInstance.get<SocialMediaAsset[]>(
      `${root}/media`,
      { params: { page_size } }
    );
    return data;
  },
  async importMedia(source_asset_ref: string, source_kind: string) {
    const { data } = await axiosInstance.post<SocialMediaAsset[]>(
      `${root}/media/import`,
      { source_asset_ref, source_kind },
      mutationConfig()
    );
    return data;
  },
  async deleteMedia(assetID: string) {
    await axiosInstance.delete(`${root}/media/${assetID}`);
  },
};
