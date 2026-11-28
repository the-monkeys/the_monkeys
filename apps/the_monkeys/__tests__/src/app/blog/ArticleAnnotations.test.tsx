import { ArticleBodyFallback } from '@/app/blog/components/BlogArticleBody';
import { applyArticleAnnotations } from '@/lib/articleAnnotations';
import type { OutputData } from '@themonkeys/monkeys-editor';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

describe('article annotations', () => {
  const data = {
    blocks: [
      {
        id: 'setup',
        type: 'header',
        data: { text: 'Setup', level: 2, anchor: 'setup' },
      },
      {
        id: 'shot',
        type: 'image',
        data: {
          file: { url: '/grafana-linux-dashboard.png' },
          alt: 'CPU and memory metrics in Grafana',
        },
      },
    ],
  } as OutputData;
  it('provides matching jump targets and image descriptions before and after hydration', () => {
    const html = renderToStaticMarkup(<ArticleBodyFallback data={data} />);
    expect(html).toContain('id="setup"');
    expect(html).toContain('alt="CPU and memory metrics in Grafana"');
    const holder = document.createElement('div');
    holder.innerHTML =
      '<div class="ce-block" data-id="setup"><h2>Setup</h2></div><div class="ce-block" data-id="shot"><img src="/grafana-linux-dashboard.png"></div>';
    applyArticleAnnotations(holder, data.blocks);
    expect(holder.querySelector('h2')?.id).toBe('setup');
    expect(holder.querySelector('h2')?.style.scrollMarginTop).toBe('8rem');
    expect(holder.querySelector('img')?.alt).toBe(
      'CPU and memory metrics in Grafana'
    );
  });
  it('rejects unsafe anchors without changing unrelated documents', () => {
    const bad = {
      blocks: [
        {
          type: 'header',
          data: { text: 'Legacy', level: 2, anchor: 'bad id" onclick="evil' },
        },
      ],
    } as OutputData;
    expect(
      renderToStaticMarkup(<ArticleBodyFallback data={bad} />)
    ).not.toContain('id=');
  });
});
