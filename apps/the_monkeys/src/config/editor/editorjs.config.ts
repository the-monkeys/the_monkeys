import CustomCodeTool from '@/components/editor/customBlocks/CodeBlock';
import CustomList from '@/components/editor/customBlocks/CustomListBlock';
import CustomEmbed from '@/components/editor/customBlocks/EmbedBlock';
import PdfTool from '@/components/editor/customBlocks/PdfBlock';
import VideoTool from '@/components/editor/customBlocks/VideoBlock';
import { API_URL, API_URL_V2 } from '@/constants/api';
import { storageV2 } from '@/services/storage/storageV2';
// @ts-ignore
import AttachesTool from '@editorjs/attaches';
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
          async uploadByFile(file: File) {
            try {
              const response = await storageV2.uploadBlogImage(blogId, file);
              const urlData = await storageV2.getBlogImageUrl(
                blogId,
                response.fileName
              );

              return {
                success: 1,
                file: {
                  url: urlData.url,
                  name: response.fileName, // Store for potential deletion
                },
              };
            } catch (error) {
              console.error('Image upload failed:', error);
              return {
                success: 0,
                file: {
                  url: '',
                },
              };
            }
          },
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
    attaches: {
      class: AttachesTool,
      config: {
        uploader: {
          async uploadByFile(file: File) {
            try {
              const response = await storageV2.uploadBlogFile(blogId, file);
              const urlData = await storageV2.getBlogFileUrl(
                blogId,
                response.fileName
              );

              return {
                success: 1,
                file: {
                  url: urlData.url,
                  name: response.fileName,
                  size: response.size,
                  title: file.name,
                  extension: file.name.split('.').pop(),
                },
              };
            } catch (error) {
              console.error('File upload failed:', error);
              return {
                success: 0,
              };
            }
          },
        },
      },
    },
    video: {
      class: VideoTool,
      config: {
        onRemove: async (fileName: string) => {
          try {
            await storageV2.deleteBlogFile(blogId, fileName);
          } catch (error) {
            console.error('Failed to delete video from storage:', error);
          }
        },
        uploader: async (file: File) => {
          try {
            const response = await storageV2.uploadBlogFile(blogId, file);
            const urlData = await storageV2.getBlogFileUrl(
              blogId,
              response.fileName
            );
            return {
              success: 1,
              file: {
                url: urlData.url,
                name: response.fileName,
              },
            };
          } catch (error) {
            console.error('Video upload failed:', error);
            return { success: 0 };
          }
        },
      },
    },
    pdf: {
      class: PdfTool,
      config: {
        onRemove: async (fileName: string) => {
          try {
            await storageV2.deleteBlogFile(blogId, fileName);
          } catch (error) {
            console.error('Failed to delete PDF from storage:', error);
          }
        },
        uploader: async (file: File) => {
          try {
            const response = await storageV2.uploadBlogFile(blogId, file);
            const urlData = await storageV2.getBlogFileUrl(
              blogId,
              response.fileName
            );
            return {
              success: 1,
              file: {
                url: urlData.url,
                name: response.fileName,
              },
            };
          } catch (error) {
            console.error('PDF upload failed:', error);
            return { success: 0 };
          }
        },
      },
    },
  },
  defaultBlock: 'paragraph',
});
