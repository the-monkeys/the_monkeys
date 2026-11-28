export type ActiveMention = { start: number; query: string };

const TYPED_MENTION = /(^|[^\w@./])@([A-Za-z0-9_.]{1,30})$/;

export function activeMention(
  value: string,
  caret: number
): ActiveMention | null {
  const match = TYPED_MENTION.exec(value.slice(0, caret));
  if (!match) return null;
  return { start: match.index + match[1].length, query: match[2] };
}

export function insertMention(
  value: string,
  mention: ActiveMention,
  username: string
): { value: string; caret: number } {
  const end = mention.start + mention.query.length + 1;
  const rest = value.slice(end);
  const spacer = /^\s/.test(rest) ? '' : ' ';
  const inserted = `@${username}${spacer}`;
  return {
    value: `${value.slice(0, mention.start)}${inserted}${rest}`,
    caret: mention.start + inserted.length + (spacer ? 0 : 1),
  };
}
