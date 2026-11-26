import TopicPage, { generateMetadata } from '@/app/topics/[topic]/page';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { notFound } = vi.hoisted(() => ({
  notFound: vi.fn(() => {
    throw new Error('NOT_FOUND');
  }),
}));
vi.mock('@/constants/api', () => ({
  API_URL: 'http://127.0.0.1:9/api/v1',
  LIVE_URL: 'https://monkeys.com.co',
}));
vi.mock('next/navigation', () => ({ notFound }));
vi.mock('@/app/topics/[topic]/topicData', () => ({
  fetchTopicPosts: async () => ({ blogs: [] }),
}));
vi.mock('@/app/topics/[topic]/components/BlogsByTopic', () => ({
  BlogsByTopic: () => null,
}));
vi.mock('@/app/topics/[topic]/components/TopicFollowButton', () => ({
  default: () => null,
}));

describe('topic availability', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => vi.unstubAllGlobals());
  it('preserves an upstream outage as an error rather than a false not-found result', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('', { status: 503 }));
    await expect(
      TopicPage({ params: { topic: 'technology' } })
    ).rejects.toThrow('503');
    expect(notFound).not.toHaveBeenCalled();
    await expect(
      generateMetadata({ params: { topic: 'technology' } })
    ).rejects.toThrow('503');
  });
  it('still returns not-found when a successful catalog does not contain the topic', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          category: { Technology: { Topics: ['Technology'] } },
        }),
        { status: 200 }
      )
    );
    await expect(
      TopicPage({ params: { topic: 'does-not-exist' } })
    ).rejects.toThrow('NOT_FOUND');
  });
});
