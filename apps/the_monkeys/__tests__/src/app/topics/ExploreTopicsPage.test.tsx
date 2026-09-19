import { TopicsList } from '@/app/topics/explore/components/TopicsList';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

describe('topic exploration markup', () => {
  it('renders six crawlable links per collapsed category', () => {
    const topics = [
      'AI',
      'Stock Market',
      'Business',
      'Culture',
      'Science',
      'Health',
      'Economy',
      'Art',
    ];
    const html = renderToStaticMarkup(<TopicsList topics={topics} />);

    expect(html).toContain('href="/topics/ai"');
    expect(html).toContain('href="/topics/stock-market"');
    expect(html).not.toContain('href="/topics/economy"');
    expect(html).not.toContain('href="/topics/art"');
    expect(html.match(/href="\/topics\//g) || []).toHaveLength(6);
  });
});
