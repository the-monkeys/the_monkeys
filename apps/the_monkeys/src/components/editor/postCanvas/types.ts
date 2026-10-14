export type PostUndoController = {
  undo: () => void;
  redo: () => void;
};

export type PostUndoHandle = PostUndoController & {
  canUndo: boolean;
  canRedo: boolean;
};
