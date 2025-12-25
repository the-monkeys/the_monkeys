import CustomCodeTool from '@/components/editor/customBlocks/CodeBlock';
import CustomEmbed from '@/components/editor/customBlocks/EmbedBlock';
import CustomList from '@/components/editor/customBlocks/NestedListBlock';
import TitleBlockTool from '@/components/editor/customBlocks/TitleBlock';
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
