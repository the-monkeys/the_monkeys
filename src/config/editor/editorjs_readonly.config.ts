import Checklist from '@editorjs/checklist';
import Code from '@editorjs/code';
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
        levels: [1, 2],
      },
    },
    paragraph: {
      class: Paragraph,
    },
    list: {
      class: List,
      config: {
        defaultStyle: 'unordered',
      },
    },
    image: {
      class: Image,
    },
    checklist: {
      class: Checklist,
      inlineToolbar: true,
    },
    delimiter: Delimiter,
    quote: {
      class: Quote,
      inlineToolbar: true,
      config: {
        quotePlaceholder: 'Enter a quote',
        captionPlaceholder: "Quote's author",
      },
    },
    table: {
      class: Table,
      inlineToolbar: true,
      config: {
        rows: 2,
        cols: 3,
      },
    },

    code: {
      class: Code,
      inlineToolbar: true,
    },
  },
};
