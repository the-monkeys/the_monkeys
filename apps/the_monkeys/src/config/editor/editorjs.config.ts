import CustomCodeTool from '@/components/editor/customBlocks/CodeBlock';
import CustomEmbed from '@/components/editor/customBlocks/EmbedBlock';
import HyperLinkTool from '@/components/editor/customBlocks/HyperlinkBlock';
import { API_URL } from '@/constants/api';
import axiosInstance from '@/services/api/axiosInstance';
import Delimiter from '@editorjs/delimiter';
import { EditorConfig } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';

export const getEditorConfig = (blogId: string): EditorConfig => ({
  holder: 'editorjs_editor-container',
  tools: {
    header: {
      class: Header,
      inlineToolbar: ['bold', 'italic', 'hyperlink'],
      config: {
        levels: [1, 2, 3],
        defaultLevel: 2,
      },
    },
    paragraph: {
      class: Paragraph,
      inlineToolbar: ['bold', 'italic', 'hyperlink'],
      config: {
        placeholder: '',
      },
    },
    list: {
      class: List,
      inlineToolbar: ['bold', 'italic', 'hyperlink'],
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
    hyperlink: {
      class: HyperLinkTool,
      inlineToolbar: true,
      shortcut: 'ctrl + L',
    },
    delimiter: Delimiter,
    quote: {
      class: Quote,
      inlineToolbar: false,
      config: {
        quotePlaceholder: '',
      },
    },
    image: {
      class: Image,
      config: {
        captionPlaceholder: '',
        uploader: {
          async uploadByFile(file: File) {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axiosInstance.post(
              `/files/post/${blogId}`,
              formData
            );

            return {
              success: 1,
              file: {
                url: `${API_URL}/files/post/${blogId}/${response.data.new_file_name}`,
              },
            };
          },
        },
      },
    },
    table: {
      class: Table,
      inlineToolbar: ['bold', 'italic', 'hyperlink'],
      config: {
        rows: 3,
        cols: 2,
      },
    },
  },
  defaultBlock: 'paragraph',
});
