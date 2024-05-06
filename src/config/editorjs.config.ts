import { EditorConfig } from '@editorjs/editorjs';

export const editorConfig: EditorConfig = {
  holder: 'editorjs_editor-container',
  autofocus: true,
  tools: {
    delimiter: require('@editorjs/delimiter'),
    header: {
      class: require('@editorjs/header'),
      inlineToolbar: true,
      config: {
        placeholder: 'Add a title...',
        levels: [1, 2, 3],
        defaultLevel: 2,
      },
    },
    paragraph: {
      class: require('@editorjs/paragraph'),
      inlineToolbar: true,
      config: {
        placeholder: 'Add some text...',
      },
    },
    list: {
      class: require('@editorjs/list'),
      inlineToolbar: true,
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

export const editorViewConfig: EditorConfig = {
  holder: 'editorjs_veiw-container',
  tools: {
    delimiter: require('@editorjs/delimiter'),
    header: {
      class: require('@editorjs/header'),
    },
    paragraph: {
      class: require('@editorjs/paragraph'),
    },
    list: {
      class: require('@editorjs/list'),
    },
    image: {
      class: require('@editorjs/image'),
    },
  },
};
