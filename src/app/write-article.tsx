


import React, { useState } from "react";
import "./App.css";
import Editor from "../components/EditorJS/EditorJs";

// Initial Data
const INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      type: "header",
      data: {
        text: "This is my awesome editor!",
        level: 1,
      },
    },
  ],
};

function App() {
  const [data, setData] = useState(INITIAL_DATA);
  return (
    <div className="editor">
      <Editor data={data} onChange={setData} editorblock="editorjs-container" />
      <button
        className="savebtn"
        onClick={() => {
          alert(JSON.stringify(data));
        }}
      >
        Save
      </button>
    </div>
  );
}

export default App;