import { API } from '@editorjs/editorjs';

export interface ConstructorArgs {
  api: API;
  data?: ListData | LegacyListData;
  config?: ListConfig;
  readOnly?: boolean;
}

export interface ListNode {
  content: string;
  items: ListNode[];
}

export interface ListConfig {
  defaultStyle?: 'ordered' | 'unordered';
  maxLevel?: number;
}

export interface LegacyListData {
  style: ListStyle;
  items: string[];
}
export type ListToolData = ListData | LegacyListData;

export type ListStyle = 'unordered' | 'ordered';

export interface ListItemData {
  content: string;
  items?: ListItemData[];
}

export interface ListData {
  style: ListStyle;
  items: ListItemData[];
}
