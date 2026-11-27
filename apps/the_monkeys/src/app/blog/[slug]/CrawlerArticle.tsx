import type { Blog } from '@/services/blog/blogTypes';

// Extract readable inline HTML without the SEO metadata normalizer, which also
// rewrites punctuation. React escapes the resulting text before it reaches HTML.
function plainText(value: unknown): string {
  if (typeof value !== 'string') return '';
  const entities: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: '\u00a0',
    mdash: '—',
    ndash: '–',
    hellip: '…',
    lsquo: '‘',
    rsquo: '’',
    ldquo: '“',
    rdquo: '”',
  };
  return value
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/\s*(p|div|li|h[1-6])\s*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (source, entity: string) => {
      if (!entity.startsWith('#')) return entities[entity] ?? source;
      const point =
        entity.startsWith('#x') || entity.startsWith('#X')
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
      return point > 0 &&
        point <= 0x10ffff &&
        !(point >= 0xd800 && point <= 0xdfff)
        ? String.fromCodePoint(point)
        : source;
    });
}
function listText(value: unknown, depth = 0): string {
  if (depth > 12) return '';
  if (typeof value === 'string') return plainText(value);
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value))
    return value
      .map((item) => listText(item, depth + 1))
      .filter(Boolean)
      .join(' ');
  if (value && typeof value === 'object') {
    const item = value as Record<string, unknown>;
    return ['content', 'text', 'items', 'name', 'values']
      .map((key) => listText(item[key], depth + 1))
      .filter(Boolean)
      .join(' ');
  }
  return '';
}
const readableFields = [
  'title',
  'text',
  'summary',
  'expression',
  'formula',
  'description',
  'caption',
  'citationText',
  'authors',
  'year',
  'source',
  'identifier',
  'url',
  'studyDesign',
  'dataCollection',
  'analysisMethod',
  'assumptions',
  'limitations',
  'sampleSize',
  'collectionDate',
  'license',
  'variables',
  'notes',
  'message',
  'xLabel',
  'yLabel',
];

// Server-only projection; no raw DTO is passed to client components or media loaders.
export default function CrawlerArticle({ blog }: { blog: Blog }) {
  const firstHeading = blog.blog.blocks.findIndex((block) =>
    ['title', 'header'].includes(block.type)
  );
  return (
    <article>
      <p>
        This article requires an account and an age of 18 or older to view on
        Monkeys.
      </p>
      <section className='registration-content'>
        {blog.blog.blocks.map((block, index) => {
          const data = block.data || {};
          if (block.type === 'code')
            return (
              <pre key={index}>
                <code>{typeof data.code === 'string' ? data.code : ''}</code>
              </pre>
            );
          if (block.type === 'markdown')
            return (
              <div key={index}>
                {typeof data.markdown === 'string' ? data.markdown : ''}
              </div>
            );
          if (block.type === 'delimiter') return <hr key={index} />;
          if (block.type === 'quote')
            return (
              <blockquote key={index}>
                <p>{plainText(data.text)}</p>
                <cite>{plainText(data.caption)}</cite>
              </blockquote>
            );
          if (block.type === 'table')
            return <p key={index}>{listText(data.content)}</p>;
          if (block.type === 'list' || block.type === 'checklist')
            return <p key={index}>{listText(data.items)}</p>;
          if (block.type === 'title' || block.type === 'header') {
            const text = plainText(data.text);
            return index === firstHeading ? (
              <h1 key={index}>{text}</h1>
            ) : (
              <h2 key={index}>{text}</h2>
            );
          }
          const fields = readableFields
            .map((key) => plainText(data[key]))
            .filter(Boolean);
          if (block.type === 'chart')
            fields.push(listText(data.labels), listText(data.series));
          return (
            <div key={index}>
              {fields.filter(Boolean).map((text, field) => (
                <p key={field}>{text}</p>
              ))}
            </div>
          );
        })}
      </section>
    </article>
  );
}
