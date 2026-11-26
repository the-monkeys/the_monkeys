import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** File-only preview: no API requests, credentials or publishing operations. */
export function prepareArticleRefresh(article, refresh) {
  if (
    article.blog_id !== refresh.blogId ||
    article.is_draft ||
    (article.audience && article.audience !== 'public')
  )
    throw new Error('Expected the selected published public article');
  const blocks = article.blog?.blocks;
  const title = blocks?.find((block) => block.type === 'header');
  const intro = blocks?.find((block) => block.type === 'paragraph');
  if (!title || title.data?.text !== refresh.expectedTitle)
    throw new Error('The article title changed; review the refresh again');
  const complete =
    intro?.data?.text === refresh.introduction &&
    refresh.additions.every((addition) =>
      blocks.some((block) => JSON.stringify(block) === JSON.stringify(addition))
    );
  if (complete) return structuredClone(article);
  if (
    !intro ||
    intro.data?.text !== refresh.expectedIntroduction ||
    refresh.additions.some((addition) =>
      blocks.some((block) => block.id === addition.id)
    )
  )
    throw new Error('The article body changed; review the refresh again');
  const result = structuredClone(article);
  result.blog.blocks[blocks.indexOf(intro)].data.text = refresh.introduction;
  result.blog.blocks.push(...structuredClone(refresh.additions));
  return result;
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const [sourcePath, refreshPath, outputPath] = process.argv.slice(2);
  if (
    !sourcePath ||
    !refreshPath ||
    !outputPath ||
    [sourcePath, refreshPath].some(
      (path) => resolve(path) === resolve(outputPath)
    )
  )
    throw new Error(
      'Usage: node preview-article-refresh.mjs source.json refresh.json NEW-output.json'
    );
  const article = JSON.parse(
    readFileSync(sourcePath, 'utf8').replace(/^\uFEFF/, '')
  );
  const refresh = JSON.parse(
    readFileSync(refreshPath, 'utf8').replace(/^\uFEFF/, '')
  );
  const result = prepareArticleRefresh(article, refresh);
  writeFileSync(outputPath, JSON.stringify(result, null, 2), { flag: 'wx' });
  console.log(
    'Created local preview file. No article was published or updated.'
  );
}
