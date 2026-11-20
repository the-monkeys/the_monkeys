import type { SnapshotInput, SnapshotTheme } from '../types';

/** Image-based badge keeps the existing Monkeys icon exportable and Satori-safe. */
export function DiscussionByline({
  input,
  badgeSrc = '/snapshot-verified.svg',
  badgeSize = 24,
  maxWidth,
}: {
  input: SnapshotInput;
  badgeSrc?: string;
  badgeSize?: number;
  maxWidth?: number;
}) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        minWidth: 0,
        overflowWrap: 'anywhere',
        ...(maxWidth !== undefined ? { maxWidth } : {}),
      }}
    >
      <span
        style={{
          display: 'flex',
          ...(maxWidth !== undefined
            ? {
                minWidth: 0,
                wordBreak: 'break-word',
                maxWidth:
                  maxWidth -
                  (input.author?.isVerified === true ? badgeSize + 8 : 0),
                flexShrink: 1,
              }
            : {}),
        }}
      >
        {input.author?.username
          ? `@${input.author.username}`
          : 'Deleted account'}
      </span>
      {input.author?.isVerified === true ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={badgeSrc}
          alt='Verified account'
          width={badgeSize}
          height={badgeSize}
          style={{
            display: 'flex',
            flexShrink: 0,
            width: badgeSize,
            height: badgeSize,
          }}
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
