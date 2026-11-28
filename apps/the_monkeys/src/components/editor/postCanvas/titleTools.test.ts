import { describe, expect, it } from 'vitest';

import TitleAwareHeader from '../customBlocks/TitleAwareHeader';
import TitleBlock from '../customBlocks/TitleBlock';

describe('backward compatible title tools', () => {
  const api = {
    styles: { block: 'cdx-block' },
    i18n: { t: (text: string) => text },
  };
  it('saves an empty title instead of silently removing it', () => {
    const tool = new TitleAwareHeader({
      data: { text: '', level: 1 },
      block: { id: 'title' },
      config: {},
      api,
      readOnly: false,
    } as any);
    expect(tool.validate({ text: '', level: 1 })).toBe(true);
    expect(tool.render().tagName).toBe('H1');
  });
  it('does not change ordinary body heading behavior', () => {
    const tool = new TitleAwareHeader({
      data: { text: 'Body heading', level: 2 },
      block: { id: 'body' },
      config: {},
      api,
      readOnly: false,
    } as any);
    expect(tool.render().tagName).toBe('H2');
    expect(tool.validate({ text: '', level: 2 })).toBe(false);
  });
  it('renders legacy title data as H1 without changing its saved text', () => {
    const tool = new TitleBlock({
      data: { text: 'Legacy title' },
      api: api as any,
    });
    const element = tool.render();
    expect(element.tagName).toBe('H1');
    expect(tool.save(element)).toEqual({ text: 'Legacy title' });
  });
});
