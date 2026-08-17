import { createBlock } from '../shared/createBlock';
import { FORMULA_TOOLBOX } from '../shared/types';
import type { FormulaBlockData } from '../shared/types';
import FormulaComponent from './FormulaComponent';

/* ------------------------------------------------------------------ */
/*  FormulaBlock — EditorJS block for LaTeX formula rendering          */
/* ------------------------------------------------------------------ */

const DEFAULT_DATA: FormulaBlockData = {
  expression: 'E = mc^2',
  mode: 'display',
  description: '',
};

function normalizeData(data?: Partial<FormulaBlockData>): FormulaBlockData {
  return {
    expression: data?.expression ?? DEFAULT_DATA.expression,
    mode: data?.mode === 'inline' ? 'inline' : 'display',
    description: data?.description ?? DEFAULT_DATA.description,
  };
}

export default createBlock<FormulaBlockData>({
  toolbox: FORMULA_TOOLBOX,
  defaultData: DEFAULT_DATA,
  sanitize: {
    expression: true,
    mode: true,
    description: true,
  },
  Component: FormulaComponent,
  normalizeData,
});
