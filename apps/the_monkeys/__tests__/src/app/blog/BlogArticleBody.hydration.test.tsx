import { BlogArticleBody } from '@/app/blog/components/BlogArticleBody';
import { cleanup, render, screen } from '@testing-library/react';
import type { OutputData } from '@themonkeys/monkeys-editor';
import { renderToString } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';

vi.mock('@/components/editor/preview', () => ({
  default: ({ data }: { data?: OutputData }) => (
    <div data-testid='existing-preview'>{data?.blocks[0]?.data.text}</div>
  ),
}));

afterEach(cleanup);

it('hydrates the readable fallback into the existing editor with the same authorized data', async () => {
  const data = {
    blocks: [{ type: 'paragraph', data: { text: 'Authorized article 世界' } }],
  } as OutputData;
  const serverHtml = renderToString(<BlogArticleBody data={data} />);
  expect(serverHtml).toContain('data-article-body');
  expect(serverHtml).toContain('Authorized article 世界');

  const container = document.createElement('div');
  document.body.appendChild(container);
  container.innerHTML = serverHtml;
  const { unmount } = render(<BlogArticleBody data={data} />, {
    container,
    hydrate: true,
  });

  expect((await screen.findByTestId('existing-preview')).textContent).toBe(
    'Authorized article 世界'
  );
  expect(container.querySelector('[data-article-body]')).toBeNull();
  unmount();
  container.remove();
});
