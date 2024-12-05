import Delimiter from '@editorjs/delimiter';
import { EditorConfig } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';

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
      config: {
        placeholder: '',
      },
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
    delimiter: Delimiter,
    quote: {
      class: Quote,
      config: {
        quotePlaceholder: '',
        captionPlaceholder: '',
      },
    },
  },
};
