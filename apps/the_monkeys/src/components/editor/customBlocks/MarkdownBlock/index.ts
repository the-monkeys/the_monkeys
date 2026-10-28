import { createBlock } from '../shared/createBlock';
import { MARKDOWN_TOOLBOX } from '../shared/types';
import type { MarkdownBlockData } from '../shared/types';
import MarkdownComponent from './MarkdownComponent';

const DEFAULT_DATA: MarkdownBlockData = { markdown: '' };

function normalizeData(data?: Partial<MarkdownBlockData>): MarkdownBlockData {
  const markdown = typeof data?.markdown === 'string' ? data.markdown : '';
  const sourceFileName =
    typeof data?.sourceFileName === 'string' && data.sourceFileName
      ? data.sourceFileName
      : undefined;
  return sourceFileName ? { markdown, sourceFileName } : { markdown };
}

export default createBlock<MarkdownBlockData>({
  toolbox: MARKDOWN_TOOLBOX,
  defaultData: DEFAULT_DATA,
  sanitize: {
    markdown: true,
    sourceFileName: true,
  },
  Component: MarkdownComponent,
  normalizeData,
});
