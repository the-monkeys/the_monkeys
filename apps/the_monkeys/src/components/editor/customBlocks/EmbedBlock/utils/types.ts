import { API, BlockAPI } from '@themonkeys/monkeys-editor';

export type EmbedData = {
  url: string;
  service: string;
  ogTitle?: string;
  ogImage?: string;
  ogDescription?: string;
};

export type EmbedConstructorArgs = {
  api: API;
  readOnly?: boolean;
  data?: EmbedData;
  config?: EmbedToolConfig;
  block: BlockAPI;
};

export type EmbedToolConfig = {
  [key: string]: unknown;
};
