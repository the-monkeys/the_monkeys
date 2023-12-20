import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import "./customScrollbar.css";
import { EDITOR_JS_TOOLS } from "./editorTools";

const EditorComponent = () => {
  const editorRef = useRef(null);
  const [editorContent, setEditorContent] = useState(null);

  useEffect(() => {
    // Initialize the EditorJS instance and store it in the editorRef
    editorRef.current = new EditorJS({
      holder: "editorjs", // an element with the id "editorjs"
      autofocus: true,
      placeholder: "Type text or paste a link",
      tools: EDITOR_JS_TOOLS,
      onReady: () => {
        console.log("Editor is ready!");
      },
    });

    return () => {
      // Cleanup editor instance on component unmount
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  // Function to handle saving the content
  const handleSave = async () => {
    if (editorRef.current) {
      try {
        // Ensure that the editor is ready before attempting to save
        await editorRef.current.isReady;
        const savedData = await editorRef.current.save();
        setEditorContent(savedData);
        console.log("Saved data:", savedData);
      } catch (error) {
        console.error("Error saving data:", error);
      }
    } else {
      console.error("Editor is not initialized.");
    }
  };

  return (
    <>
      <div
        id="editorjs"
        className="h-[88vh] overflow-y-auto px-7 md:px-[63px] md:mx-4 md:my-4 lg:mx-10 text-black md:text-xl"
      />
      <div className="flex justify-center my-5 pt-4">
        <button
          className="bg-[#ff462e] text-white font-semibold py-1 px-1 md:py-2 md:px-7 w-[25%] md:w-[20%] rounded hover:bg-red-700 transition-colors duration-300"
          onClick={handleSave}
        >
          Create
        </button>
      </div>
      {/* Display the saved content */}
      {editorContent && (
        <div className="my-5 p-4 border border-gray-300 rounded">
          <h2 className="text-xl font-semibold mb-2 inline">
            Saved Content :{" "}
          </h2>
          {/* Render the saved content */}
          {editorContent.blocks.map((block, index) => (
            <div key={block.id} className="mb-3 inline">
              <p className="inline">{block.data.text}</p>
            </div>
          ))}
          <br />
          <span>
            <h2 className="text-xl font-semibold mb-2 inline ">
              Published at :
            </h2>
            <p className="inline">{new Date().toLocaleString()}</p>
          </span>
        </div>
      )}
    </>
  );
};

export default EditorComponent;
