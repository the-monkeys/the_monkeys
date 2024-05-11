import { BlockChanges } from '@/app/create/page';
import { OutputData } from '@editorjs/editorjs';

export const prepareFinalData = (
  data: OutputData,
  blockChanges: BlockChanges
) => {
  const finalData = {
    ...data,
    blocks: data.blocks.map((block) => {
      let time = data.time;

      if (block.id && blockChanges.get(block.id)) {
        time = blockChanges.get(block.id)?.time;
      }

      return {
        ...block,
        time,
      };
    }),
  };

  return finalData;
};
