import ChartBlock from '@/components/editor/customBlocks/ChartBlock';
import CitationBlock from '@/components/editor/customBlocks/CitationBlock';
import CustomCodeTool from '@/components/editor/customBlocks/CodeBlock';
import CustomList from '@/components/editor/customBlocks/CustomListBlock';
import DatasetBlock from '@/components/editor/customBlocks/DatasetBlock';
import CustomEmbed from '@/components/editor/customBlocks/EmbedBlock';
import FormulaBlock from '@/components/editor/customBlocks/FormulaBlock';
import MethodologyBlock from '@/components/editor/customBlocks/MethodologyBlock';
import TrendBlock from '@/components/editor/customBlocks/TrendBlock';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
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
    chart: {
      class: ChartBlock,
    },
    trend: {
      class: TrendBlock,
    },
    formula: {
      class: FormulaBlock,
    },
    citation: {
      class: CitationBlock,
    },
    methodology: {
      class: MethodologyBlock,
    },
    dataset: {
      class: DatasetBlock,
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
            const formData = new FormData();
            formData.append('file', file);

            // Upload via v2 storage API (MinIO-backed).
            // The v2 response includes a CDN URL in `response.data.url`
            // generated server-side from MINIO_CDN_URL config.
            // Storing the CDN URL directly means:
            //   - No runtime URL resolution on read
            //   - CDN/domain change = one-time ES migration, not code change
            //   - v1 routes are untouched, no frontend dependency on them
            const response = await axiosInstanceV2.post(
              `/storage/posts/${blogId}`,
              formData
            );

            return {
              success: 1,
              file: {
                url: response.data.url,
              },
            };
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
  },
  defaultBlock: 'paragraph',
});
