import CustomCodeTool from '@/components/editor/customBlocks/CodeBlock';
import CustomList from '@/components/editor/customBlocks/CustomListBlock';
import CustomEmbed from '@/components/editor/customBlocks/EmbedBlock';
import TitleBlockTool from '@/components/editor/customBlocks/TitleBlock';
import Delimiter from '@editorjs/delimiter';
import { EditorConfig } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
// @ts-ignore
import AttachesTool from '@editorjs/attaches';
import VideoTool from '@/components/editor/customBlocks/VideoBlock';
import PdfTool from '@/components/editor/customBlocks/PdfBlock';

export const editorConfig: EditorConfig = {
  holder: 'editorjs_editor-container',
  readOnly: true,
  tools: {
    header: {
      class: Header,
      config: {
        levels: [1, 2, 3],
      },
    },
    paragraph: {
      class: Paragraph,
      config: {
        placeholder: '',
      },
    },
    list: {
      class: CustomList,
      config: {
        defaultStyle: 'unordered',
      },
    },
    image: {
      class: Image,
    },
    table: {
      class: Table,
    },
    delimiter: Delimiter,
    code: {
      class: CustomCodeTool,
      // config: {
      //   placholder: '',
      // },
    },
    embed: {
      class: CustomEmbed,
    },
    quote: {
      class: Quote,
      config: {
        quotePlaceholder: '',
        captionPlaceholder: '',
      },
    },
    attaches: {
      class: class extends AttachesTool {
        render() {
          const wrapper = super.render();
          const data = (this as any).data;

          if (data && data.file && data.file.url && data.file.url.toLowerCase().endsWith('.pdf')) {
            // 1. Make the entire card clickable
            wrapper.style.cursor = 'pointer';
            wrapper.onclick = (e: MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              const readerUrl = `/read/pdf?url=${encodeURIComponent(data.file.url)}&title=${encodeURIComponent(data.file.title || data.file.name || 'PDF Document')}`;
              // 2. Open in same tab
              window.location.href = readerUrl;
            };

            // 3. Optional: Fix dark mode visibility by ensuring the icon/text color is consistent
            // The user mentioned the down arrow is not visible in dark mode. 
            // Since we are making it all clickable, we can just let the default UI be, 
            // but let's make sure the background on hover feels interactive.
            wrapper.classList.add('hover:bg-gray-50', 'dark:hover:bg-zinc-900', 'transition-colors');
          }
          return wrapper;
        }
      },
    },
    video: {
      class: VideoTool,
    },
    pdf: {
      class: PdfTool,
    },
  },
};
