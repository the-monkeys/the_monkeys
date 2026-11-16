/** Conservative text checks, not estimates of meaning, relevance or ranking. */
export function comparableText(value: string): string {
  return value
    .normalize('NFKC')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[.!?:;]+$/, '')
    .trim();
}

const commonPlaceholders = new Set([
  'tbd',
  'tba',
  'todo',
  'placeholder',
  'coming soon',
  'to be announced',
  'to be confirmed',
  'lorem ipsum',
  'lorem ipsum dolor sit amet',
]);
// Keep the existing TypeScript target; supported Next.js browsers provide
// Unicode character properties, including scripts without letter casing.
const readableCharacter = new RegExp('[\\p{L}\\p{N}]', 'u');
const placeholders = {
  title: new Set([
    'untitled',
    'untitled post',
    'untitled article',
    'untitled event',
    'new post',
    'new article',
    'new event',
    'title',
    'post title',
    'article title',
    'event title',
    'your title',
    'add a title',
    'enter title',
    'write your title',
  ]),
  description: new Set([
    'description',
    'post description',
    'article description',
    'event description',
    'your description',
    'add a description',
    'write your description',
    'more details soon',
    'more information soon',
    'details coming soon',
    'more details coming soon',
    'more information coming soon',
    'summary',
    'summary here',
  ]),
  topic: new Set<string>(),
  venue: new Set([
    'venue',
    'location',
    'address',
    'event location',
    'venue address',
    'enter address',
    'online',
    'in person',
    'hybrid',
  ]),
};

export function usefulText(
  value: string,
  kind: keyof typeof placeholders
): boolean {
  const text = comparableText(value);
  return (
    readableCharacter.test(text) &&
    !commonPlaceholders.has(text) &&
    !placeholders[kind].has(text)
  );
}

export function addsDescription(title: string, description: string): boolean {
  return (
    usefulText(description, 'description') &&
    comparableText(description) !== comparableText(title)
  );
}

export function usefulTopics(topics: string[]): boolean {
  return (
    topics.length > 0 && topics.every((topic) => usefulText(topic, 'topic'))
  );
}

export function genericLinkText(value: string): boolean {
  return (
    !value.trim() ||
    /^(?:click here|here|read more|learn more|link|website|more)$/i.test(
      comparableText(value)
    )
  );
}
