import { createBlock } from '../shared/createBlock';
import { METHODOLOGY_TOOLBOX } from '../shared/types';
import type { MethodologyBlockData } from '../shared/types';
import MethodologyComponent from './MethodologyComponent';

/* ------------------------------------------------------------------ */
/*  MethodologyBlock — EditorJS block for structured methodology       */
/* ------------------------------------------------------------------ */

const DEFAULT_DATA: MethodologyBlockData = {
  studyDesign: '',
  dataCollection: '',
  analysisMethod: '',
  assumptions: '',
  limitations: '',
};

function normalizeData(
  data?: Partial<MethodologyBlockData>
): MethodologyBlockData {
  return {
    studyDesign: data?.studyDesign ?? DEFAULT_DATA.studyDesign,
    dataCollection: data?.dataCollection ?? DEFAULT_DATA.dataCollection,
    analysisMethod: data?.analysisMethod ?? DEFAULT_DATA.analysisMethod,
    assumptions: data?.assumptions ?? DEFAULT_DATA.assumptions,
    limitations: data?.limitations ?? DEFAULT_DATA.limitations,
  };
}

export default createBlock<MethodologyBlockData>({
  toolbox: METHODOLOGY_TOOLBOX,
  defaultData: DEFAULT_DATA,
  sanitize: {
    studyDesign: true,
    dataCollection: true,
    analysisMethod: true,
    assumptions: true,
    limitations: true,
  },
  Component: MethodologyComponent,
  normalizeData,
});
