import ChartBlock from '@/components/editor/customBlocks/ChartBlock';
import CitationBlock from '@/components/editor/customBlocks/CitationBlock';
import CustomCodeTool from '@/components/editor/customBlocks/CodeBlock';
import CustomList from '@/components/editor/customBlocks/CustomListBlock';
import DatasetBlock from '@/components/editor/customBlocks/DatasetBlock';
import CustomEmbed from '@/components/editor/customBlocks/EmbedBlock';
import FormulaBlock from '@/components/editor/customBlocks/FormulaBlock';
import MethodologyBlock from '@/components/editor/customBlocks/MethodologyBlock';
import TitleBlockTool from '@/components/editor/customBlocks/TitleBlock';
import TrendBlock from '@/components/editor/customBlocks/TrendBlock';
import Delimiter from '@editorjs/delimiter';
import { EditorConfig } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';

export const editorConfig: EditorConfig = {
  holder: 'editorjs_editor-container',
  readOnly: true,
  tools: {
    header: {
      class: Header,
      config: {
        levels: [1, 2, 3],
      },
    },
    paragraph: {
      class: Paragraph,
      config: {
        placeholder: '',
      },
    },
    list: {
      class: CustomList,
      config: {
        defaultStyle: 'unordered',
      },
    },
    image: {
      class: Image,
    },
    table: {
      class: Table,
    },
    delimiter: Delimiter,
    code: {
      class: CustomCodeTool,
      // config: {
      //   placholder: '',
      // },
    },
    chart: {
      class: ChartBlock,
    },
    trend: {
      class: TrendBlock,
    },
    formula: {
      class: FormulaBlock,
    },
    citation: {
      class: CitationBlock,
    },
    methodology: {
      class: MethodologyBlock,
    },
    dataset: {
      class: DatasetBlock,
    },
    embed: {
      class: CustomEmbed,
    },
    quote: {
      class: Quote,
      config: {
        quotePlaceholder: '',
        captionPlaceholder: '',
      },
    },
  },
};
