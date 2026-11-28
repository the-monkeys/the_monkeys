// @vitest-environment node
import { BlogArticleBody } from '@/app/blog/components/BlogArticleBody';
import { BlogImage } from '@/components/blog/getBlogContent';
import type { OutputData } from '@themonkeys/monkeys-editor';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

const image = 'https://monkeys.support/api/v1/storage/posts/123/photo.jpg';
const flags = {
  is_nsfw: true,
  content_rating: { is_nsfw: true, revealed: true },
};
describe('revealed article image privacy', () => {
  it('uses an unoptimized same-origin authenticated storage proxy for revealed card images', () => {
    const html = renderToStaticMarkup(
      <BlogImage title='Revealed image' image={image} content={flags} />
    );
    expect(html).toContain('src="/api/v2/storage/posts/123/photo.jpg"');
    expect(html).not.toContain('/_next/image');
    expect(html).not.toContain('srcSet');
  });
  it('keeps existing Next optimization for public-safe card images', () => {
    const html = renderToStaticMarkup(
      <BlogImage title='Public image' image={image} />
    );
    expect(html).toContain('/_next/image?');
  });
  it('renders native reader images through the proxy after reveal without mutating the stored document', () => {
    const data = {
      blocks: [
        { type: 'image', data: { file: { url: image }, caption: 'Caption' } },
      ],
    } as OutputData;
    const html = renderToStaticMarkup(
      <BlogArticleBody data={data} sensitive />
    );
    expect(html).toContain('src="/api/v2/storage/posts/123/photo.jpg"');
    expect(html).not.toContain('/_next/image');
    expect(data.blocks[0].data.file.url).toBe(image);
  });
  it('keeps public reader source URLs unchanged', () => {
    const data = {
      blocks: [{ type: 'image', data: { file: { url: image } } }],
    } as OutputData;
    expect(renderToStaticMarkup(<BlogArticleBody data={data} />)).toContain(
      `src="${image}"`
    );
  });
  it('leaves third-party image URLs external and unoptimized on revealed content', () => {
    const url =
      'https://third-party.example/api/v1/storage/posts/123/photo.jpg';
    const html = renderToStaticMarkup(
      <BlogImage title='External image' image={url} content={flags} />
    );
    expect(html).toContain(`src="${url}"`);
    expect(html).not.toContain('/_next/image');
  });
});
