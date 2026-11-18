// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { toEventSnapshot, toPostSnapshot } from './adapters';
import { analyseReadiness, scoreSeoChecks } from './analyse';
import documentFixtures from './fixtures/homepage-documents.json';
import fixtures from './fixtures/homepage-word-count.json';
import {
  countHomepageWords,
  extractHomepageContent,
} from './homepagePlacement';

const context = {
  resourceKey: 'draft',
  accountKey: 'author',
  revision: 1,
  audience: 'public',
  topics: ['TBD', 'Science'],
};
const header = (text: string, level = 1) => ({
  type: 'header',
  data: { text, level },
});
const paragraph = (text: string) => ({ type: 'paragraph', data: { text } });
const doc = (body: string, title = 'An authored article') => ({
  blocks: [header(title), paragraph(body)],
});
const report = (document: unknown, overrides = {}) =>
  analyseReadiness(toPostSnapshot(document, { ...context, ...overrides }));
const homepage = (document: unknown, overrides = {}) =>
  report(document, overrides).checks.filter((c) => c.section === 'homepage');
const status = (document: unknown, id: string, overrides = {}) =>
  homepage(document, overrides).find((c) => c.id === `homepage.${id}`);

describe('unscored Homepage placement guidance', () => {
  it.each([249, 250])(
    'counts only %i readable body words, excluding the authored title',
    (count) => {
      const document = doc('body '.repeat(count));
      const check = status(document, 'body');
      expect(check?.status).toBe(count === 250 ? 'pass' : 'improve');
      expect(check?.finding).toContain(String(count));
      expect(homepage(document).every((c) => c.scored === false)).toBe(true);
      const all = report(document);
      expect(
        scoreSeoChecks(all.checks.filter((c) => c.section !== 'homepage'))
      ).toEqual({
        seoScore: all.seoScore,
        passedCount: all.passedCount,
        applicableKnownCount: all.applicableKnownCount,
      });
    }
  );
  it('uses current raw body rather than the truncated metadata description or title fallback', () => {
    const document = { blocks: [paragraph('body '.repeat(250))] };
    expect(status(document, 'title')?.status).toBe('improve');
    expect(status(document, 'body')?.status).toBe('pass');
  });
  it.each(['Test', '  ＴＥＳＴ  ', 'Untitled&nbsp;Post', 'TBD'])(
    'rejects exact normalized placeholder title %s',
    (title) => {
      expect(status(doc('word '.repeat(250), title), 'title')?.status).toBe(
        'improve'
      );
    }
  );
  it('accepts a longer title about testing and one useful topic among placeholders', () => {
    expect(
      status(doc('word '.repeat(250), 'Testing ideas in practice'), 'title')
        ?.status
    ).toBe('pass');
    expect(status(doc('word '.repeat(250)), 'topics')?.status).toBe('pass');
  });
  it('excludes HTML attributes, URLs, scripts, editor placeholders and the full title', () => {
    const document = {
      blocks: [
        header('title '.repeat(300)),
        paragraph(
          '<p title="' +
            'attribute '.repeat(300) +
            '">' +
            'word&nbsp;'.repeat(249) +
            '</p><script>hidden words</script> https://example.org/path <a href="https://example.org">https://example.org</a>'
        ),
        paragraph('Start writing here...'),
      ],
    };
    expect(status(document, 'body')?.finding).toContain('249');
    expect(status(document, 'body')?.status).toBe('improve');
  });
  it.each([
    ['Hindi', 'हिन्दी '.repeat(250)],
    ['Han', '界'.repeat(250)],
    ['Hiragana', 'あ'.repeat(250)],
    ['Katakana', 'カ'.repeat(250)],
  ])('supports %s body units', (_name, body) => {
    expect(status(doc(body), 'body')?.finding).toContain('250');
    expect(status(doc(body), 'body')?.status).toBe('pass');
  });
  it('explains public publication is still needed for an otherwise qualifying draft', () => {
    const check = status(doc('word '.repeat(250)), 'publication');
    expect(check?.status).toBe('improve');
    expect(check?.finding).toMatch(/public.*publish|publish.*public/i);
    expect(
      status(doc('word '.repeat(250)), 'publication', {
        publicationState: 'published',
      })?.status
    ).toBe('pass');
    expect(
      status(doc('word '.repeat(250)), 'publication', {
        publicationState: 'published',
        audience: 'group_only',
      })?.status
    ).toBe('improve');
  });
  it('makes a persisted cover optional for text cards and required only for the lead', () => {
    const document = doc('word '.repeat(250));
    expect(status(document, 'cover')?.finding).toMatch(/text.*card/i);
    document.blocks.push({
      type: 'image',
      data: { file: { url: '/authored.jpg' } },
    } as any);
    expect(status(document, 'cover')?.status).toBe('pass');
    expect(status(document, 'cover', { imagePending: true })?.status).toBe(
      'unknown'
    );
  });
  it('fails closed for incomplete extraction and leaves Event readiness untouched', () => {
    const document = doc('word '.repeat(250));
    document.blocks.push({ type: 'unsupported', data: {} } as any);
    expect(status(document, 'body')?.status).toBe('unknown');
    const event = analyseReadiness(
      toEventSnapshot(
        {
          title: 'Short event',
          description: 'Brief details',
          visibility: 'public',
        },
        { ...context, isExistingEvent: false, eventEnded: false }
      )
    );
    expect(event.checks.some((c) => c.section === 'homepage')).toBe(false);
  });
});

describe('backend counter parity', () => {
  it.each(fixtures)('$name', ({ text, count }) => {
    expect(countHomepageWords(text)).toBe(count);
  });
  it.each(['Test post', 'Test article'])(
    'rejects additional placeholder %s',
    (title) => {
      expect(status(doc('body '.repeat(250), title), 'title')?.status).toBe(
        'improve'
      );
    }
  );
  it.each(['1994', '\u4e2d\u6587\u6807\u9898'])(
    'accepts the authored title %s',
    (title) => {
      expect(status(doc('body '.repeat(250), title), 'title')?.status).toBe(
        'pass'
      );
    }
  );
  it('keeps a blank H1 even when an H2 and body are useful', () => {
    expect(
      status(
        {
          blocks: [
            header(''),
            header('A useful subheading', 2),
            paragraph('word '.repeat(250)),
          ],
        },
        'title'
      )?.status
    ).toBe('improve');
  });
  it('uses a legacy first header only if there is no H1 and excludes that full title', () => {
    const document = {
      blocks: [header('title '.repeat(300), 2), paragraph('word '.repeat(249))],
    };
    expect(status(document, 'body')?.finding).toContain('249');
  });
  it('counts scientific prose and captions while excluding a repeated title and editor placeholders', () => {
    const document = {
      blocks: [
        header('An authored article'),
        paragraph('An authored article'),
        paragraph('word '.repeat(249)),
        paragraph('Your content here'),
        {
          type: 'image',
          data: {
            file: { url: '/cover.jpg' },
            caption: 'caption '.repeat(300),
          },
        },
        { type: 'methodology', data: { studyDesign: 'research '.repeat(300) } },
      ],
    };
    expect(status(document, 'body')?.finding).toContain('549');
    expect(status(document, 'body')?.status).toBe('pass');
  });
});

it('decodes named HTML entities once without counting the entity name or reinterpreting escaped markup', () => {
  expect(countHomepageWords('caf&eacute; &eacute;cole one&mdash;two')).toBe(4);
  expect(countHomepageWords('one&amp;mdash;two')).toBe(3);
});

it('uses the same body counter for tables and decodes body entities only once', () => {
  expect(
    extractHomepageContent({
      blocks: [
        header('Article'),
        {
          type: 'table',
          data: {
            content: [
              ['one', 'two'],
              ['three', 'four'],
            ],
          },
        },
      ],
    }).wordCount
  ).toBe(4);
  expect(extractHomepageContent(doc('one&amp;mdash;two')).wordCount).toBe(3);
});

it('keeps words joined across HTML comments and rejects punctuation-wrapped placeholders', () => {
  expect(countHomepageWords('Hel<!-- note -->lo')).toBe(1);
  expect(status(doc('word '.repeat(250), '.TBD.'), 'title')?.status).toBe(
    'improve'
  );
});

describe('expanded homepage document extraction parity', () => {
  it('uses explicit document and custom title-block titles ahead of legacy H2 fallback', () => {
    expect(
      extractHomepageContent({
        title: 'Authored root title',
        blocks: [header('Legacy H2', 2), paragraph('Body prose')],
      }).title
    ).toBe('Authored root title');
    expect(
      extractHomepageContent({
        blocks: [
          { type: 'title', data: { text: 'Authored custom title' } },
          header('Legacy H2', 2),
          paragraph('Body prose'),
        ],
      }).title
    ).toBe('Authored custom title');
    expect(
      extractHomepageContent({
        title: 'Authored root title',
        blocks: [header(''), header('Legacy H2', 2)],
      }).title
    ).toBe('');
  });
  it('removes placeholders per list item and repeated titles per legacy body line', () => {
    const list = {
      type: 'list',
      data: {
        items: [
          'Start writing here...',
          'TODO',
          'Article',
          {
            content: 'useful prose',
            items: [{ content: 'Your content here' }],
          },
        ],
      },
    };
    expect(
      extractHomepageContent({ blocks: [header('Article'), list] }).wordCount
    ).toBe(3);
    expect(
      extractHomepageContent({
        title: 'Article',
        body: 'Article\nStart writing here...\nTODO\nuseful prose\nYour content here',
      }).wordCount
    ).toBe(2);
  });
  it('counts only Markdown text after removing numbering, reference definitions and link destinations', () => {
    const markdown = {
      type: 'markdown',
      data: {
        markdown:
          '1. useful prose\n2) [visible link][ref]\n[ref]: https://example.org/paper "Hidden reference title"\n[other](https://example.org "Hidden title")',
      },
    };
    expect(
      extractHomepageContent({ blocks: [header('Article'), markdown] })
        .wordCount
    ).toBe(5);
  });
});

describe('canonical backend full-document parity', () => {
  for (const shape of ['editor', 'stored'] as const) {
    it.each(documentFixtures)(`${shape}: $name`, (fixture) => {
      const document = fixture.document as Record<string, any>;
      const shaped =
        shape === 'stored'
          ? {
              ...document,
              blocks: undefined,
              blog: { blocks: document.blocks ?? [] },
            }
          : document;
      const content = extractHomepageContent(shaped);
      expect(content.title).toBe(fixture.title);
      expect(content.wordCount).toBe(fixture.count);
      const guidance = homepage(shaped, {
        topics: document.tags,
        audience: 'public',
        publicationState: document.is_draft ? 'draft' : 'published',
      });
      expect(
        guidance
          .filter((c) =>
            [
              'homepage.title',
              'homepage.body',
              'homepage.topics',
              'homepage.publication',
            ].includes(c.id)
          )
          .every((c) => c.status === 'pass')
      ).toBe(fixture.eligible);
    });
  }
});
