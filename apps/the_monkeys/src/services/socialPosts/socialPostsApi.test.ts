import axiosInstance from '@/services/api/axiosInstance';
import { describe, expect, it, vi } from 'vitest';

import { socialPostsApi } from './socialPostsApi';

vi.mock('@/services/api/axiosInstance');

describe('socialPostsApi normalization', () => {
  it('unwraps post from { post: {...} } response on get', async () => {
    (axiosInstance.get as any).mockResolvedValueOnce({
      data: {
        post: {
          id: 'p1',
          base_text: 'hello',
          state: 'draft',
          status: 'draft',
          version: 1,
          renditions: [],
        },
        violations: [],
      },
    });
    const result = await socialPostsApi.get('p1');
    expect(result.id).toBe('p1');
    expect(result.status).toBe('draft');
    expect(result.state).toBe('draft');
  });

  it('unwraps post on create, update, upsertRendition, schedule, and publishNow', async () => {
    const postPayload = {
      id: 'p1',
      base_text: 'created',
      state: 'draft',
      status: 'draft',
      version: 1,
      renditions: [],
    };

    (axiosInstance.post as any).mockResolvedValueOnce({
      data: { post: postPayload, violations: [] },
    });
    const created = await socialPostsApi.create({ base_text: 'created' });
    expect(created.id).toBe('p1');

    (axiosInstance.patch as any).mockResolvedValueOnce({
      data: { post: { ...postPayload, base_text: 'updated' }, violations: [] },
    });
    const updated = await socialPostsApi.update(
      'p1',
      { base_text: 'updated' },
      1
    );
    expect(updated.base_text).toBe('updated');

    (axiosInstance.put as any).mockResolvedValueOnce({
      data: { post: postPayload, violations: [] },
    });
    const upserted = await socialPostsApi.upsertRendition(
      'p1',
      { social_account_id: 'acc1', text_override: 'override' },
      1
    );
    expect(upserted.id).toBe('p1');

    (axiosInstance.request as any).mockResolvedValueOnce({
      data: {
        post: { ...postPayload, status: 'scheduled', state: 'scheduled' },
        violations: [],
      },
    });
    const scheduled = await socialPostsApi.schedule('p1', {
      scheduled_at: '2026-09-20T10:00:00Z',
      schedule_timezone: 'UTC',
      expected_version: 1,
    });
    expect(scheduled.status).toBe('scheduled');

    (axiosInstance.post as any).mockResolvedValueOnce({
      data: {
        post: { ...postPayload, status: 'published', state: 'published' },
        violations: [],
      },
    });
    const published = await socialPostsApi.publishNow('p1', 1);
    expect(published.status).toBe('published');
  });

  it('unwraps accounts array from { accounts: [...] } and guarantees an array', async () => {
    (axiosInstance.get as any).mockResolvedValueOnce({
      data: {
        accounts: [
          {
            id: 'a1',
            platform: 'x',
            handle: 'monkey',
            display_name: 'Monkey',
            status: 'active',
            validation: {
              platform: 'x',
              max_text_characters: 280,
              allowed_media_kinds: ['image', 'video'],
              max_media_count: 4,
              max_media_bytes: 5242880,
              max_video_duration_ms: 140000,
              media_required: false,
            },
          },
        ],
      },
    });
    const result = await socialPostsApi.accounts();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].platform).toBe('x');
    expect(result[0].validation?.max_text_characters).toBe(280);

    // Guarantees array when response is empty or null
    (axiosInstance.get as any).mockResolvedValueOnce({
      data: {},
    });
    const emptyResult = await socialPostsApi.accounts();
    expect(Array.isArray(emptyResult)).toBe(true);
    expect(emptyResult.length).toBe(0);
  });

  it('unwraps media array from { assets: [...] } and { items: [...] } and guarantees an array', async () => {
    (axiosInstance.get as any).mockResolvedValueOnce({
      data: {
        assets: [
          {
            id: 'm1',
            object_key: 'key1',
            content_type: 'image/png',
            byte_size: 100,
          },
        ],
      },
    });
    const result = await socialPostsApi.media();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].id).toBe('m1');

    (axiosInstance.get as any).mockResolvedValueOnce({
      data: {
        items: [
          {
            id: 'm2',
            object_key: 'key2',
            content_type: 'image/jpeg',
            byte_size: 200,
          },
        ],
      },
    });
    const resultItems = await socialPostsApi.media();
    expect(Array.isArray(resultItems)).toBe(true);
    expect(resultItems[0].id).toBe('m2');

    (axiosInstance.get as any).mockResolvedValueOnce({
      data: null,
    });
    const emptyMedia = await socialPostsApi.media();
    expect(Array.isArray(emptyMedia)).toBe(true);
    expect(emptyMedia.length).toBe(0);
  });

  it('sends expected_version on delete', async () => {
    (axiosInstance.delete as any).mockResolvedValueOnce({ data: {} });
    await socialPostsApi.delete('p1', 2);
    expect(axiosInstance.delete).toHaveBeenCalledWith(
      '/social-posts/p1',
      expect.objectContaining({
        data: { expected_version: 2 },
        params: expect.objectContaining({ expected_version: 2 }),
      })
    );
  });

  it('unwraps validationMetadata from { platforms: [...] }', async () => {
    (axiosInstance.get as any).mockResolvedValueOnce({
      data: {
        platforms: [
          {
            platform: 'x',
            max_text_characters: 280,
            allowed_media_kinds: ['image', 'video'],
            max_media_count: 4,
            max_media_bytes: 5242880,
            max_video_duration_ms: 140000,
            media_required: false,
          },
        ],
      },
    });
    const result = await socialPostsApi.validationMetadata();
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].platform).toBe('x');

    (axiosInstance.get as any).mockResolvedValueOnce({
      data: null,
    });
    const emptyPlatforms = await socialPostsApi.validationMetadata();
    expect(Array.isArray(emptyPlatforms)).toBe(true);
    expect(emptyPlatforms.length).toBe(0);
  });
});
