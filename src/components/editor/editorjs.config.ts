import { EditorConfig } from '@editorjs/editorjs';

const editorConfig: EditorConfig = {
  holder: 'editorjs-container',
  tools: {
    header: {
      class: require('@editorjs/header'),
      config: {
        placeholder: 'Title',
        levels: [1, 2, 3],
        defaultLevel: 3,
      },
    },
    paragraph: {
      class: require('@editorjs/paragraph'),
      config: {
        placeholder: 'Start writing...',
      },
    },
    list: {
      class: require('@editorjs/list'),
      config: {},
    },
    table: {
      class: require('@editorjs/table'),
      config: {
        rows: 2,
        cols: 3,
      },
    },
  },
  defaultBlock: 'paragraph',
};

export default editorConfig;
