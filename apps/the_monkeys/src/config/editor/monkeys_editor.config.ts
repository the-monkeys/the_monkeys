import ChartBlock from '@/components/editor/customBlocks/ChartBlock';
import CitationBlock from '@/components/editor/customBlocks/CitationBlock';
import CustomCodeTool from '@/components/editor/customBlocks/CodeBlock';
import CustomList from '@/components/editor/customBlocks/CustomListBlock';
import DatasetBlock from '@/components/editor/customBlocks/DatasetBlock';
import CustomEmbed from '@/components/editor/customBlocks/EmbedBlock';
import FormulaBlock from '@/components/editor/customBlocks/FormulaBlock';
import MethodologyBlock from '@/components/editor/customBlocks/MethodologyBlock';
import MentionUserTool from '@/components/editor/customBlocks/TagUserBlock';
import TrendBlock from '@/components/editor/customBlocks/TrendBlock';
import Delimiter from '@editorjs/delimiter';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import { EditorConfig } from '@themonkeys/monkeys-editor';

import { uploadImage } from '@/components/editor/utils/uploadFile';

export const getEditorConfig = (blogId: string): EditorConfig => ({
  holder: 'monkeys_editor_editor-container',
  tools: {
    header: {
      class: Header,
      inlineToolbar: true,
      config: {
        levels: [1, 2, 3],
        defaultLevel: 2,
      },
    },
    paragraph: {
      class: Paragraph,
      inlineToolbar: true,
      config: {
        placeholder: '',
      },
    },
    list: {
      class: CustomList,
      inlineToolbar: true,
      config: {
        defaultStyle: 'unordered',
      },
    },
    code: {
      class: CustomCodeTool,
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
    mention: {
      class: MentionUserTool,
    },
    delimiter: Delimiter,
    quote: {
      class: Quote,
      inlineToolbar: true,
      config: {
        quotePlaceholder: '',
      },
    },
    image: {
      class: Image,
      config: {
        captionPlaceholder: '',
        uploader: {
          uploadByFile: (file: File) => uploadImage(blogId, file),
        },
      },
    },
    table: {
      class: Table,
      inlineToolbar: true,
      config: {
        rows: 3,
        cols: 2,
      },
    },
  },
  defaultBlock: 'paragraph',
});
