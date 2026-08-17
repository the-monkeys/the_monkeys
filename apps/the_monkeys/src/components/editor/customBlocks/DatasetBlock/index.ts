import { createBlock } from '../shared/createBlock';
import { DATASET_TOOLBOX } from '../shared/types';
import type { DatasetBlockData } from '../shared/types';
import DatasetComponent from './DatasetComponent';

/* ------------------------------------------------------------------ */
/*  DatasetBlock — EditorJS block for dataset metadata                 */
/* ------------------------------------------------------------------ */

const DEFAULT_DATA: DatasetBlockData = {
  title: '',
  source: '',
  sampleSize: '',
  collectionDate: '',
  license: '',
  variables: '',
  notes: '',
};

function normalizeData(data?: Partial<DatasetBlockData>): DatasetBlockData {
  return {
    title: data?.title ?? DEFAULT_DATA.title,
    source: data?.source ?? DEFAULT_DATA.source,
    sampleSize: data?.sampleSize ?? DEFAULT_DATA.sampleSize,
    collectionDate: data?.collectionDate ?? DEFAULT_DATA.collectionDate,
    license: data?.license ?? DEFAULT_DATA.license,
    variables: data?.variables ?? DEFAULT_DATA.variables,
    notes: data?.notes ?? DEFAULT_DATA.notes,
  };
}

export default createBlock<DatasetBlockData>({
  toolbox: DATASET_TOOLBOX,
  defaultData: DEFAULT_DATA,
  sanitize: {
    title: true,
    source: true,
    sampleSize: true,
    collectionDate: true,
    license: true,
    variables: true,
    notes: true,
  },
  Component: DatasetComponent,
  normalizeData,
});
