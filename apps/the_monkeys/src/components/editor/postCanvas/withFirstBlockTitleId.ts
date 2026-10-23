type BlockWithId = { id?: string };

export function withFirstBlockTitleId<T extends BlockWithId>(
  blocks: T[] | undefined
): T[] {
  if (!blocks?.length) return blocks || [];
  if (blocks[0].id === 'title') return blocks;
  return [{ ...blocks[0], id: 'title' }, ...blocks.slice(1)];
}
