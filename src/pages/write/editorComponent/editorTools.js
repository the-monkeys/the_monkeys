import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import SimpleImage from "@editorjs/simple-image";
import ImageTool from "@editorjs/image";
import Checklist from "@editorjs/checklist";
import NestedList from "@editorjs/nested-list";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import Code from "@editorjs/code";
import AttachesTool from "@editorjs/attaches";

export const EDITOR_JS_TOOLS = {
  //   header: Header,
  heading: {
    class: Header,
    config: {
      placeholder: "Enter a heading....",
      levels: [1, 2, 3, 4],
      defaultLevel: 1,
      inlineToolbar: true, // Enable inline formatting toolbar
      shortcut: "CMD+H", // Custom keyboard shortcut
      allowHash: false, // Disable the automatic generation of an anchor hash
      inputStyle: "border", // Change input field style
      tunes: ["superscript", "subscript"], // Additional formatting options
    },
    inlineToolbar: ["bold", "italic", "link"], // Inline formatting options
  },
  list: { class: List },
  lists: {
    class: NestedList,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  checklist: { class: Checklist, inlineToolbar: true },
  quote: {
    class: Quote,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+O",
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: "Quote's author",
    },
  },
  image: { class: SimpleImage, inlineToolbar: ["Link"] },
  images: {
    class: ImageTool,
    inlineToolbar: false,
    config: {
      endpoints: {
        byFile: "http://localhost:3000/uploadFile",
        byUrl: "http://localhost:3000/fetchUrl",
      },
    },
  },
  embed: {
    class: Embed,
    config: {
      services: {
        youtube: true,
        coub: true,
      },
      placeholder: "Enter an embed code",
    },
  },
  table: {
    class: Table,
    inlineToolbar: true,
    config: { rows: 2, cols: 3 },
  },
  code: { class: Code, placeholder: "Enter code" },
  attaches: {
    class: AttachesTool,
    config: {
      endpoint: "http://localhost:3000/uploadFile",
    },
  },
};
