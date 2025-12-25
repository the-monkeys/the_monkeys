import { API } from '@editorjs/editorjs';

export interface ConstructorData {
  api: API;
  data?: ListData | LegacyListData;
  config?: ListConfig;
  readOnly?: boolean;
}

export interface ListNode {
  content: string;
  items: ListNode[]; // Recursive structure
}

export interface ListData {
  style: 'ordered' | 'unordered';
  items: ListNode[];
}

export interface ListConfig {
  defaultStyle?: 'ordered' | 'unordered';
  maxLevel?: number;
}

export interface LegacyListData {
  style: 'ordered' | 'unordered';
  items: string[];
}

/**
 * Editor.js API types (Simplified for this context)
 
interface API {
    styles: {
        block: string;
        inlineToolButton: string;
    };
    selection: {
        findParentTag: (tagName: string, className?: string) => HTMLElement | null;
    };
}*/
