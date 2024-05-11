import Delimiter from '@editorjs/delimiter';
import { EditorConfig } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import List from '@editorjs/list';
import Marker from '@editorjs/marker';
import Paragraph from '@editorjs/paragraph';

export const editorConfig: EditorConfig = {
  holder: 'editorjs_editor-container',
  autofocus: true,
  tools: {
    delimiter: Delimiter,
    header: {
      class: Header,
      inlineToolbar: true,
      config: {
        placeholder: 'Pen your thoughts ...',
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
    list: {
      class: List,
      inlineToolbar: true,
    },
    image: {
      class: Image,
      config: {
        endpoints: {
          byFile: 'http://localhost:3000/api/uploadFile',
          byUrl: 'http://localhost:3000/api/fetchUrl',
        },
      },
    },
    Marker: {
      class: Marker,
      shortcut: 'CMD+SHIFT+M',
    },
  },
  defaultBlock: 'paragraph',
};

export const editorViewConfig: EditorConfig = {
  holder: 'editorjs_veiw-container',
  tools: {
    delimiter: Delimiter,
    header: {
      class: Header,
    },
    paragraph: {
      class: Paragraph,
    },
    list: {
      class: List,
    },
    image: {
      class: Image,
    },
  },
};
