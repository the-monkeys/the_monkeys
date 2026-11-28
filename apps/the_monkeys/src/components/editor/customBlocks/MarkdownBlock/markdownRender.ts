import DOMPurify from 'isomorphic-dompurify';

/** Tailwind Typography is not installed; these child selectors restore heading/list styles. */
export const MARKDOWN_PREVIEW_CLASS =
  'max-w-none [&_h1]:mb-2 [&_h1]:mt-1 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-1.5 [&_h3]:mt-2 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:mb-2 [&_p]:leading-relaxed [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-slate-400 [&_blockquote]:pl-3 [&_blockquote]:italic [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-slate-900/50 [&_pre]:p-3 [&_code]:text-sm [&_a]:underline';

const ALLOWED_TAGS = [
  'h1',
  'h2',
  'h3',
  'p',
  'br',
  'ul',
  'ol',
  'li',
  'a',
  'code',
  'pre',
  'strong',
  'em',
  'blockquote',
  'span',
];

export async function renderMarkdownHtml(markdown: string): Promise<string> {
  const { marked } = await import('marked');
  const renderer = new marked.Renderer();
  renderer.heading = ((token: { text: string; depth: number }) => {
    const level = Math.min(Math.max(token.depth ?? 1, 1), 3);
    return `<h${level}>${token.text}</h${level}>\n`;
  }) as typeof renderer.heading;
  renderer.image = (() => '') as typeof renderer.image;

  const raw = await marked.parse(markdown, {
    async: true,
    gfm: true,
    breaks: true,
    renderer,
  });

  try {
    const clean = DOMPurify.sanitize(raw, {
      ALLOWED_TAGS,
      ALLOWED_ATTR: ['href'],
    });

    return clean.replace(
      /<a href="(https?:[^"]+)"/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer"'
    );
  } catch {
    return '';
  }
}
