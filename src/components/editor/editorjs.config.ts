import { EditorConfig } from '@editorjs/editorjs';

const editorConfig: EditorConfig = {
  holder: 'editorjs-container',
  autofocus: true,
  tools: {
    delimiter: require('@editorjs/delimiter'),
    header: {
      class: require('@editorjs/header'),
      inlineToolbar: true,
      config: {
        placeholder: 'add a title...',
        levels: [1, 2, 3],
        defaultLevel: 3,
      },
    },
    paragraph: {
      class: require('@editorjs/paragraph'),
      inlineToolbar: true,
      config: {
        placeholder: 'add some text...',
      },
    },
    list: {
      class: require('@editorjs/list'),
      config: {},
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
