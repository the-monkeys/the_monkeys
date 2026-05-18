import { SnapshotInput } from '../types';

/**
 * Stub: tweet ingestion requires X API credentials and is owned by the Cast
 * service. Frontend just enqueues the request once available.
 */
export const fromTweet = async (_tweetUrl: string): Promise<SnapshotInput> => {
  throw new Error(
    'snapshot.fromTweet is not implemented in the frontend; route via /api/v2/cast/ingest/tweet.'
  );
};
