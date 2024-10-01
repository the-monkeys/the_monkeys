import { EditorConfig } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
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
    image: {
      class: Image,
    },
  },
};
