declare module '@editorjs/header' {
  import Header from '@editorjs/header';
  export = Header;
}
declare module '@editorjs/paragraph' {
  import Paragraph from '@editorjs/paragraph';
  export = Paragraph;
}

declare module '@editorjs/image' {
  import Image from '@editorjs/image';
  export = Image;
}

declare module '@editorjs/list' {
  import List from '@editorjs/list';
  export = List;
}

declare module '@editorjs/checklist' {
  import Checklist from '@editorjs/checklist';
  export = Checklist;
}

declare module '@editorjs/delimiter' {
  import Delimiter from '@editorjs/delimiter';
  export = Delimiter;
}

declare module '@editorjs/quote' {
  import Quote from '@editorjs/quote';
  export = Quote;
}

declare module '@editorjs/table' {
  import Table from '@editorjs/table';
  export = Table;
}

declare module 'editorjs-undo' {
  const Undo: new (opts: {
    editor: unknown;
    maxLength?: number;
    onUpdate?: () => void;
    config?: { shortcuts?: { undo?: string; redo?: string } };
  }) => {
    undo: () => void;
    redo: () => void;
    initialize: (data: unknown) => void;
    destroy?: () => void;
    canUndo?: boolean | (() => boolean);
    canRedo?: boolean | (() => boolean);
  };
  export default Undo;
}
