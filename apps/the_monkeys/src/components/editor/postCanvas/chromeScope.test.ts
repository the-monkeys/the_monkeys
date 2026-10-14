import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const dir = dirname(fileURLToPath(import.meta.url));
const appRoot = join(dir, '../../../');

describe('chrome shortcut scope', () => {
  it('marks SearchInput and PublishBlogDrawer', () => {
    const search = readFileSync(
      join(appRoot, 'components/search/SearchInput.tsx'),
      'utf8'
    );
    const publish = readFileSync(
      join(appRoot, 'components/blog/actions/PublishBlogDrawer.tsx'),
      'utf8'
    );
    expect(search).toMatch(/data-shortcut-scope=["']chrome["']/);
    expect(publish).toMatch(/data-shortcut-scope=["']chrome["']/);
  });

  it('keeps preview and published titles in the page header, not the article body', () => {
    const preview = readFileSync(
      join(appRoot, 'components/editor/BlogPreview.tsx'),
      'utf8'
    );
    const published = readFileSync(
      join(appRoot, 'app/blog/[slug]/BlogPageClient.tsx'),
      'utf8'
    );
    expect(preview).toContain('BlogHeading');
    expect(published).toContain('BlogHeading');
    expect(preview).toContain('PostArticleCanvas');
    expect(published).toContain('PostArticleCanvas');
    expect(preview.indexOf('BlogHeading')).toBeLessThan(
      preview.indexOf('PostArticleCanvas')
    );
    expect(published.indexOf('BlogHeading')).toBeLessThan(
      published.indexOf('PostArticleCanvas')
    );
  });

  it('marks the edit Online/Edit/Preview row as chrome', () => {
    const edit = readFileSync(
      join(appRoot, 'app/edit/[blogId]/page.tsx'),
      'utf8'
    );
    expect(edit).toMatch(/data-shortcut-scope=["']chrome["']/);
  });

  it('does not rewrite first-block type on draft load', () => {
    const edit = readFileSync(
      join(appRoot, 'app/edit/[blogId]/page.tsx'),
      'utf8'
    );
    const editor = readFileSync(
      join(appRoot, 'components/editor/index.tsx'),
      'utf8'
    );
    expect(edit).not.toMatch(/ensureFirstBlock/);
    expect(editor).not.toMatch(/ensureFirstBlock/);
    expect(edit).toContain('setData(blog.blog || INITIAL_DATA)');
    expect(edit).toMatch(
      /id:\s*'title',\s*type:\s*'header',\s*data:\s*\{\s*text:\s*'Untitled Post',\s*level:\s*1/
    );
  });

  it('does not mount Undo/Redo icons on the edit Online bar', () => {
    const edit = readFileSync(
      join(appRoot, 'app/edit/[blogId]/page.tsx'),
      'utf8'
    );
    expect(edit).not.toContain('EditUndoRedoButtons');
  });
});
