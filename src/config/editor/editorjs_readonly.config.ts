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
      inlineToolbar: true,
      config: {
        levels: [1, 2],
        defaultLevel: 1,
      },
    },
    paragraph: {
      class: Paragraph,
      inlineToolbar: true,
      config: {
        placeholder: 'Pen your thoughts ...',
      },
    },
    image: {
      class: Image,
      config: {
        endpoints: {
          byFile: '',
          byUrl: '',
        },
      },
    },
  },
};
