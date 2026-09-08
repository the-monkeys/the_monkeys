export const EVENT_CATEGORIES: { label: string; tag: string }[] = [
  { label: 'Networking', tag: 'networking' },
  { label: 'Tech & AI', tag: 'tech' },
  { label: 'Writing & Storytelling', tag: 'writing' },
  { label: 'Outdoor', tag: 'outdoor' },
  { label: 'Sports & Hobbies', tag: 'sports' },
];

export function mergeCategoryTags(
  selected: string[],
  extra: string[]
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of [...selected, ...extra]) {
    const tag = raw.trim().toLowerCase();
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);
    out.push(tag);
  }
  return out;
}

const knownTags = new Set(EVENT_CATEGORIES.map((c) => c.tag));

export function partitionTags(tags: string[] | undefined): {
  selected: string[];
  extra: string;
} {
  const selected: string[] = [];
  const extra: string[] = [];
  for (const raw of tags || []) {
    const tag = raw.trim().toLowerCase();
    if (!tag) continue;
    if (knownTags.has(tag)) selected.push(tag);
    else extra.push(tag);
  }
  return { selected, extra: extra.join(', ') };
}
