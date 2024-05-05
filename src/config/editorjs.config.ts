import { EditorConfig } from '@editorjs/editorjs';

const editorConfig: EditorConfig = {
  holder: 'editorjs-container',
  autofocus: true,
  inlineToolbar: false,
  tools: {
    delimiter: require('@editorjs/delimiter'),
    header: {
      class: require('@editorjs/header'),
      config: {
        placeholder: 'add a title...',
        levels: [1, 2, 3],
        defaultLevel: 3,
      },
    },
    paragraph: {
      class: require('@editorjs/paragraph'),
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
    Marker: {
      class: require('@editorjs/marker'),
      shortcut: 'CMD+SHIFT+M',
    },
  },
  defaultBlock: 'paragraph',
};

export default editorConfig;
