/** A shared vector mark avoids font-dependent differences between browser and server exports. */
export function DiscussionQuoteMark({
  accent,
  compact = false,
}: {
  accent: string;
  compact?: boolean;
}) {
  const fill = /^#[0-9a-f]{6}$/i.test(accent) ? accent : '#FF5542';
  const curve =
    'M42 0L47 8C30 17 22 29 20 43C23 41 26 40 30 40C44 40 54 50 54 64C54 78 43 88 29 88C12 88 0 75 0 56C0 31 16 11 42 0Z';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 116 88" fill="${fill}"><path d="${curve}"/><path d="${curve}" transform="translate(62 0)"/></svg>`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-snapshot-quote
      src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`}
      alt=''
      aria-hidden='true'
      width={compact ? 70 : 110}
      height={compact ? 54 : 84}
      style={{
        display: 'flex',
        width: compact ? 70 : 110,
        height: compact ? 54 : 84,
      }}
    />
  );
}
