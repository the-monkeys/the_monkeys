import { EditorConfig } from '@editorjs/editorjs';

const editorConfig: EditorConfig = {
  holder: 'editorjs-container',
  tools: {
    header: {
      class: require('@editorjs/header'),
      inlineToolbar: true,
      config: {
        placeholder: 'Start with a title...',
        levels: [1, 2, 3],
        defaultLevel: 3,
      },
    },
    paragraph: {
      class: require('@editorjs/paragraph'),
      inlineToolbar: true,
      config: {},
    },
    list: {
      class: require('@editorjs/list'),
      config: {},
    },
    table: {
      class: require('@editorjs/table'),
      config: {
        rows: 3,
        cols: 3,
      },
    },
  },
  defaultBlock: 'paragraph',
};

export default editorConfig;
