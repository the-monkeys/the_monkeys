import { EditorConfig } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';

export const editorConfig: EditorConfig = {
  holder: 'editorjs_editor-container',
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
        placeholder: 'pen your thoughts ...',
      },
    },
    list: {
      class: List,
      inlineToolbar: true,
      config: {
        defaultStyle: 'unordered',
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
  defaultBlock: 'paragraph',
};
