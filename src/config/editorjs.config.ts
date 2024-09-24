import CodeTool from '@editorjs/code';
import { EditorConfig } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import List from '@editorjs/list';
import NestedList from '@editorjs/nested-list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';

export const editorConfig: EditorConfig = {
  holder: 'editorjs_editor-container',
  tools: {
    header: {
      class: Header,
      inlineToolbar: true,
      config: {
        levels: [1, 2, 3],
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
    NestedList: {
      class: NestedList,
      inlineToolbar: true,
      config: {
        defaultStyle: 'ordered',
      },
    },
    code: {
      class: CodeTool,
      inlineToolbar: true,
      config: {
        placeholder: 'Enter your code ...',
      },
    },
    quote: {
      class: Quote,
      inlineToolbar: true,
      config: {
        quotePlaceholder: 'Enter a quote',
        captionPlaceholder: "Quote's author",
      },
    },
  },
  defaultBlock: 'paragraph',
};
