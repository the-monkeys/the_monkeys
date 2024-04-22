import { EditorConfig } from '@editorjs/editorjs';

const editorConfig: EditorConfig = {
  holder: 'editorjs-container',
  tools: {
    header: {
      class: require('@editorjs/header'),
      inlineToolbar: true,
      config: {
        placeholder: 'Title',
        levels: [1, 2, 3],
        defaultLevel: 3,
      },
    },
    paragraph: {
      class: require('@editorjs/paragraph'),
      inlineToolbar: true,
      config: {
        placeholder: 'Unleash your creativity ...',
      },
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
    image: {
      class: require('@editorjs/image'),
      config: {
        endpoints: {
          byFile: 'http://localhost:3000/api/uploadFile',
          byUrl: 'http://localhost:3000/api/fetchUrl',
        },
      },
    },
  },
  defaultBlock: 'paragraph',
};

export default editorConfig;
