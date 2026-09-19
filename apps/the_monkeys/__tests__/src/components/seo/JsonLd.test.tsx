import { JsonLd } from '@/components/seo/JsonLd';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

describe('JsonLd', () => {
  it('escapes user-controlled tag openings inside structured data', () => {
    const html = renderToStaticMarkup(
      <JsonLd data={{ name: '</script><script>alert(1)</script>' }} />
    );

    expect(html).not.toContain('</script><script>alert(1)</script>');
    expect(html).toContain(
      '\\u003c/script>\\u003cscript>alert(1)\\u003c/script>'
    );
  });
});
