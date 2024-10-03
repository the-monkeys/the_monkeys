import { EditorConfig } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';

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
  },
};
