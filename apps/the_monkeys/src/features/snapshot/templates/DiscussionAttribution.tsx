import type { SnapshotInput, SnapshotTheme } from '../types';

/** Image-based badge keeps the existing Monkeys icon exportable and Satori-safe. */
export function DiscussionByline({
  input,
  badgeSrc = '/snapshot-verified.svg',
}: {
  input: SnapshotInput;
  badgeSrc?: string;
}) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        minWidth: 0,
        overflowWrap: 'anywhere',
      }}
    >
      <span style={{ display: 'flex' }}>
        {input.author?.username
          ? `@${input.author.username}`
          : 'Deleted account'}
      </span>
      {input.author?.isVerified === true ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={badgeSrc}
          alt='Verified account'
          width={24}
          height={24}
          style={{ display: 'flex', flexShrink: 0, width: 24, height: 24 }}
        />
      ) : null}
    </span>
  );
}

export function DiscussionSource({
  input,
  theme,
}: {
  input: SnapshotInput;
  theme: SnapshotTheme;
}) {
  if (input.source !== 'discussion' || !input.sourceUrl) return null;
  return (
    <div
      style={{
        display: 'flex',
        fontSize: 18,
        lineHeight: 1.4,
        color: theme.muted,
        overflowWrap: 'anywhere',
        flexShrink: 0,
        paddingTop: 12,
      }}
    >
      {input.sourceUrl}
    </div>
  );
}
