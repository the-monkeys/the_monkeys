import { EditorConfig } from '@editorjs/editorjs';

const editorConfig: EditorConfig = {
  holder: 'editorjs-container',
  autofocus: true,
  tools: {
    header: {
      class: require('@editorjs/header'),
      inlineToolbar: true,
      config: {
        placeholder: 'add title ...',
        levels: [1, 2, 3],
        defaultLevel: 3,
      },
    },
    paragraph: {
      class: require('@editorjs/paragraph'),
      inlineToolbar: true,
      config: {
        placeholder: 'write something ...',
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
