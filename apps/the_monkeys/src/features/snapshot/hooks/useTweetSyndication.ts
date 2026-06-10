'use client';

import { useEffect, useState } from 'react';

import { TweetSyndication } from '../types/tweetSyndication';

export const useTweetSyndication = (tweetId: string | null) => {
  const [tweet, setTweet] = useState<TweetSyndication | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tweetId) {
      setTweet(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(`/api/snapshot/tweet/${tweetId}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(
            (body as { error?: string }).error ??
              `Failed to load tweet (${res.status})`
          );
        }
        return res.json() as Promise<TweetSyndication>;
      })
      .then((data) => {
        if (cancelled) return;
        setTweet(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setTweet(null);
        setError(
          err instanceof Error
            ? err.message
            : 'Could not load tweet. It may be private or deleted.'
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [tweetId]);

  return { tweet, isLoading, error };
};
