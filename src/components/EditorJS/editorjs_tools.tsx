// @ts-ignore
import Paragraph from "@editorjs/paragraph" ;
import Header from "@editorjs/header";
// @ts-ignore
import List from "@editorjs/list";
// @ts-ignore
import Link from "@editorjs/link";
// @ts-ignore
import Delimiter from "@editorjs/delimiter";
// @ts-ignore
import CheckList from "@editorjs/checklist";

export const EDITOR_JS_TOOLS = {
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  checkList: CheckList,
  list: List,
  header: Header,
  delimiter: Delimiter,
  link: Link,
};
