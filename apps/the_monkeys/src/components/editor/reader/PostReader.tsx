import { type ReactNode, createElement } from 'react';

import DOMPurify from 'isomorphic-dompurify';
import katex from 'katex';
import { marked } from 'marked';

import ChartComponent from '../customBlocks/ChartBlock/ChartComponent';
import CitationComponent from '../customBlocks/CitationBlock/CitationComponent';
import '../customBlocks/CustomListBlock/style.css';
import DatasetComponent from '../customBlocks/DatasetBlock/DatasetComponent';
import { MARKDOWN_PREVIEW_CLASS } from '../customBlocks/MarkdownBlock/markdownRender';
import MethodologyComponent from '../customBlocks/MethodologyBlock/MethodologyComponent';
import '../customBlocks/TagUserBlock/style.css';
import TrendComponent from '../customBlocks/TrendBlock/TrendComponent';
import { computeTrend } from '../customBlocks/TrendBlock/trendMath';
import { BlockWrapper } from '../customBlocks/shared/BlockWrapper';
import type { ChartBlockData } from '../customBlocks/shared/types';
import { ReaderCode } from './ReaderCode';
import { ReaderEmbed } from './ReaderEmbed';
import './reader.css';
import { array, readerHtml, readerUrl, record, text } from './readerHtml';

const noop = () => {};
const html = (value: unknown) => ({ __html: readerHtml(value) });
const strings = <K extends string>(
  data: Record<string, unknown>,
  keys: K[]
): Record<K, string> =>
  Object.fromEntries(keys.map((key) => [key, text(data[key])])) as Record<
    K,
    string
  >;
const numbers = (value: unknown) =>
  array(value).map(Number).filter(Number.isFinite);

function HistoricalContent({ value }: { value: unknown }): ReactNode {
  if (typeof value === 'string') {
    const url = /^https?:\/\//i.test(value) && readerUrl(value);
    return url ? (
      <p>
        <a href={url} target='_blank' rel='noopener noreferrer'>
          {value}
        </a>
      </p>
    ) : (
      <div className='ce-paragraph' dangerouslySetInnerHTML={html(value)} />
    );
  }
  if (typeof value === 'number') return <p>{value}</p>;
  const children = Array.isArray(value) ? value : Object.values(record(value));
  return (
    <>
      {children.map((child, index) => (
        <HistoricalContent key={index} value={child} />
      ))}
    </>
  );
}

function List({
  items,
  ordered,
  nested = false,
}: {
  items: unknown[];
  ordered: boolean;
  nested?: boolean;
}) {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag className={nested ? 'cdx-list__sublist' : 'cdx-list'}>
      {items.map((item, index) => {
        const node = record(item);
        return (
          <li className='cdx-list__item' key={index}>
            <div
              className='cdx-list__item-content'
              dangerouslySetInnerHTML={html(
                typeof item === 'string' ? item : node.content
              )}
            />
            {array(node.items).length > 0 && (
              <List items={array(node.items)} ordered={ordered} nested />
            )}
          </li>
        );
      })}
    </Tag>
  );
}

function Markdown({ source }: { source: string }) {
  // Use the same Markdown dialect and allowlist as the editor's async helper,
  // synchronously so the actual content is present on the first render.
  const renderer = new marked.Renderer();
  renderer.heading = (token) =>
    `<h${Math.min(token.depth, 3)}>${token.text}</h${Math.min(token.depth, 3)}>\n`;
  renderer.image = () => '';
  const rendered = marked.parse(source, {
    async: false,
    gfm: true,
    breaks: true,
    renderer,
  });
  const clean = DOMPurify.sanitize(rendered, {
    ALLOWED_TAGS: [
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
    ],
    ALLOWED_ATTR: ['href'],
  }).replace(
    /<a href="(https?:[^"]+)"/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer"'
  );
  return (
    <BlockWrapper readOnly>
      <div
        data-markdown-preview
        className={MARKDOWN_PREVIEW_CLASS}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    </BlockWrapper>
  );
}

function renderBlock(block: Record<string, unknown>): ReactNode {
  const data = record(block.data);
  switch (block.type) {
    case 'paragraph':
      return (
        <div
          className='ce-paragraph'
          dangerouslySetInnerHTML={html(data.text)}
        />
      );
    case 'title':
    case 'header': {
      const level = Number(data.level);
      return createElement(
        `h${[1, 2, 3, 4, 5, 6].includes(level) ? level : 2}`,
        { className: 'ce-header', dangerouslySetInnerHTML: html(data.text) }
      );
    }
    case 'list':
      return (
        <List items={array(data.items)} ordered={data.style === 'ordered'} />
      );
    case 'quote':
      return (
        <blockquote
          className={`cdx-quote${data.alignment === 'center' ? ' cdx-quote--center' : ''}`}
        >
          <div
            className='cdx-quote__text'
            dangerouslySetInnerHTML={html(data.text)}
          />
          <div
            className='cdx-quote__caption'
            dangerouslySetInnerHTML={html(data.caption)}
          />
        </blockquote>
      );
    case 'image': {
      const url = readerUrl(record(data.file).url || data.url);
      if (!url) return null;
      const classes = ['stretched', 'withBorder', 'withBackground']
        .filter((key) => data[key] === true)
        .map((key) => `image-tool--${key}`);
      const caption = DOMPurify.sanitize(text(data.caption), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      });
      return (
        <figure className={`image-tool ${classes.join(' ')}`}>
          <div className='image-tool__image'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className='image-tool__image-picture'
              src={url}
              alt={caption}
              loading='lazy'
            />
          </div>
          <figcaption
            className='image-tool__caption'
            dangerouslySetInnerHTML={html(data.caption)}
          />
        </figure>
      );
    }
    case 'table': {
      const rows = array(data.content).map(array);
      const row = (cells: unknown[], index: number, heading = false) => (
        <tr key={index}>
          {cells.map((cell, cellIndex) =>
            createElement(heading ? 'th' : 'td', {
              key: cellIndex,
              className: 'tc-cell',
              scope: heading ? 'col' : undefined,
              dangerouslySetInnerHTML: html(cell),
            })
          )}
        </tr>
      );
      return (
        <div className='tc-wrap overflow-x-auto'>
          <table className='tc-table'>
            {data.withHeadings && rows.length > 0 ? (
              <thead>{row(rows[0], 0, true)}</thead>
            ) : null}
            <tbody>
              {rows
                .slice(data.withHeadings ? 1 : 0)
                .map((cells, index) => row(cells, index))}
            </tbody>
          </table>
        </div>
      );
    }
    case 'delimiter':
      return <div className='ce-delimiter' role='separator' />;
    case 'code':
      return (
        <ReaderCode
          code={text(data.code)}
          language={text(data.language) || 'plain text'}
        />
      );
    case 'embed':
      return <ReaderEmbed data={data} />;
    case 'markdown':
      return text(data.markdown).trim() ? (
        <Markdown source={text(data.markdown)} />
      ) : null;
    case 'chart': {
      const chart: ChartBlockData = {
        ...strings(data, ['title', 'xLabel', 'yLabel']),
        type: (['line', 'bar', 'area', 'pie'].includes(text(data.type))
          ? data.type
          : 'line') as ChartBlockData['type'],
        palette: text(data.palette) || 'ocean',
        showLegend: data.showLegend !== false,
        // ChartPreview interpolates labels into SVG/HTML, unlike React text nodes.
        labels: array(data.labels).map((value) =>
          text(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
        ),
        series: array(data.series)
          .map(record)
          .map((s) => ({ name: text(s.name), values: numbers(s.values) })),
        source:
          data.source === 'csv' || data.source === 'table'
            ? data.source
            : 'manual',
      };
      return <ChartComponent readOnly data={chart} onChange={noop} />;
    }
    case 'trend':
      return (
        <TrendComponent
          readOnly
          data={computeTrend(
            array(data.periodLabels).map(text),
            numbers(data.values)
          )}
          onChange={noop}
        />
      );
    case 'formula': {
      const expression = text(data.expression);
      let formula: string;
      try {
        formula = katex.renderToString(expression, {
          displayMode: data.mode !== 'inline',
          throwOnError: false,
          trust: false,
        });
      } catch {
        formula = '';
      }
      return (
        <BlockWrapper readOnly>
          <h3 className='mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200'>
            Formula
          </h3>
          <div className='rounded-lg border border-slate-200/60 bg-white/50 p-4 dark:border-slate-700/40 dark:bg-slate-900/40'>
            {formula ? (
              <div
                className='overflow-x-auto'
                dangerouslySetInnerHTML={{ __html: formula }}
              />
            ) : (
              <pre>{expression}</pre>
            )}
            {data.description ? (
              <p className='mt-2 text-xs text-slate-400 dark:text-slate-500'>
                {text(data.description)}
              </p>
            ) : null}
          </div>
        </BlockWrapper>
      );
    }
    case 'citation': {
      const citation = strings(data, [
        'title',
        'authors',
        'year',
        'source',
        'identifier',
        'url',
        'citationText',
      ]);
      // This component accepts formatted HTML; sanitize both saved and derived text.
      citation.citationText = readerHtml(
        citation.citationText ||
          [
            citation.authors,
            citation.year && `(${citation.year})`,
            citation.title,
            citation.source,
            citation.identifier,
            citation.url,
          ]
            .filter(Boolean)
            .join('. ')
      );
      return <CitationComponent readOnly data={citation} onChange={noop} />;
    }
    case 'methodology':
      return (
        <MethodologyComponent
          readOnly
          data={strings(data, [
            'studyDesign',
            'dataCollection',
            'analysisMethod',
            'assumptions',
            'limitations',
          ])}
          onChange={noop}
        />
      );
    case 'dataset':
      return (
        <DatasetComponent
          readOnly
          data={strings(data, [
            'title',
            'source',
            'sampleSize',
            'collectionDate',
            'license',
            'variables',
            'notes',
          ])}
          onChange={noop}
        />
      );
    default:
      // Retain readable content for unknown historical tools without executing HTML.
      return <HistoricalContent value={data} />;
  }
}

/** The sole visible article body, shared by SSR and hydration. No editor runtime. */
export function PostReader({ blocks }: { blocks: Record<string, unknown>[] }) {
  return (
    <div className='post-reader mx-auto break-words'>
      {blocks.map((block, index) => (
        <div className='ce-block' key={`${text(block.id)}-${index}`}>
          <div className='ce-block__content'>{renderBlock(block)}</div>
        </div>
      ))}
    </div>
  );
}
