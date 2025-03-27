import { API_URL } from '@/constants/api';
import axiosInstance from '@/services/api/axiosInstance';
import Code from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import { EditorConfig } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';

export const getEditorConfig = (blogId: string): EditorConfig => ({
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
        placeholder: 'Type something',
      },
    },
    list: {
      class: List,
      inlineToolbar: true,
      config: {
        defaultStyle: 'unordered',
      },
    },
    delimiter: Delimiter,
    code: {
      class: Code,
      config: {
        placeholder: 'Type code',
      },
    },
    quote: {
      class: Quote,
      inlineToolbar: true,
      config: {
        quotePlaceholder: 'Type something',
        captionPlaceholder: 'Type something',
      },
    },
    image: {
      class: Image,
      config: {
        captionPlaceholder: 'Type something',
        uploader: {
          async uploadByFile(file: File) {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axiosInstance.post(
              `${API_URL}/files/post/${blogId}`,
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
  },
  defaultBlock: 'paragraph',
});
