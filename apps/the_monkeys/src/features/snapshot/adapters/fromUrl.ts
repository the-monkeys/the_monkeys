import { SnapshotInput } from '../types';

/**
 * Stub: extracting a SnapshotInput from an arbitrary URL is handled by the
 * `the_monkeys_cast` ingest worker (server-side via OpenGraph + Readability).
 * Surface kept here so the frontend API is stable.
 */
export const fromUrl = async (_url: string): Promise<SnapshotInput> => {
  throw new Error(
    'snapshot.fromUrl is not implemented in the frontend; route via /api/v2/cast/ingest/url.'
  );
};
