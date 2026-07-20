import { createBlock } from '../shared/createBlock';
import { CITATION_TOOLBOX } from '../shared/types';
import type { CitationBlockData } from '../shared/types';
import CitationComponent from './CitationComponent';

/* ------------------------------------------------------------------ */
/*  CitationBlock — EditorJS block for academic citations              */
/* ------------------------------------------------------------------ */

const DEFAULT_DATA: CitationBlockData = {
  title: '',
  authors: '',
  year: '',
  source: '',
  identifier: '',
  url: '',
  citationText: '',
};

function buildCitationText(
  data: Omit<CitationBlockData, 'citationText'>
): string {
  const parts: string[] = [];
  if (data.authors) parts.push(data.authors);
  if (data.year) parts.push(`(${data.year})`);
  if (data.title) parts.push(data.title);
  if (data.source) parts.push(data.source);
  if (data.identifier) parts.push(data.identifier);
  if (data.url) parts.push(data.url);
  return parts.join('. ').trim();
}

function normalizeData(data?: Partial<CitationBlockData>): CitationBlockData {
  const initial = {
    title: data?.title ?? DEFAULT_DATA.title,
    authors: data?.authors ?? DEFAULT_DATA.authors,
    year: data?.year ?? DEFAULT_DATA.year,
    source: data?.source ?? DEFAULT_DATA.source,
    identifier: data?.identifier ?? DEFAULT_DATA.identifier,
    url: data?.url ?? DEFAULT_DATA.url,
  };

  return {
    ...initial,
    citationText: data?.citationText || buildCitationText(initial),
  };
}

export default createBlock<CitationBlockData>({
  toolbox: CITATION_TOOLBOX,
  defaultData: DEFAULT_DATA,
  sanitize: {
    title: true,
    authors: true,
    year: true,
    source: true,
    identifier: true,
    url: true,
    citationText: true,
  },
  Component: CitationComponent,
  normalizeData,
});
