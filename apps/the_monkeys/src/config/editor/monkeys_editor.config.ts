import CustomCodeTool from '@/components/editor/customBlocks/CodeBlock';
import CustomList from '@/components/editor/customBlocks/CustomListBlock';
import CustomEmbed from '@/components/editor/customBlocks/EmbedBlock';
import MentionUserTool from '@/components/editor/customBlocks/TagUserBlock';
import { uploadImage } from '@/components/editor/utils/uploadFile';
import Delimiter from '@editorjs/delimiter';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import { EditorConfig } from '@themonkeys/monkeys-editor';

export const getEditorConfig = (blogId: string): EditorConfig => ({
  holder: 'monkeys_editor_editor-container',
  tools: {
    header: {
      class: Header,
      inlineToolbar: true,
      config: {
        levels: [1, 2, 3],
        defaultLevel: 2,
      },
    },
    paragraph: {
      class: Paragraph,
      inlineToolbar: true,
      config: {
        placeholder: '',
      },
    },
    list: {
      class: CustomList,
      inlineToolbar: true,
      config: {
        defaultStyle: 'unordered',
      },
    },
    code: {
      class: CustomCodeTool,
    },
    embed: {
      class: CustomEmbed,
    },
    mention: {
      class: MentionUserTool,
    },
    delimiter: Delimiter,
    quote: {
      class: Quote,
      inlineToolbar: true,
      config: {
        quotePlaceholder: '',
      },
    },
    image: {
      class: Image,
      config: {
        captionPlaceholder: '',
        uploader: {
          uploadByFile: (file: File) => uploadImage(blogId, file),
        },
      },
    },
    table: {
      class: Table,
      inlineToolbar: true,
      config: {
        rows: 3,
        cols: 2,
      },
    },
  },
  defaultBlock: 'paragraph',
});
