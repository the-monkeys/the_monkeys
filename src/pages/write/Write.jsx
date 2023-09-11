import React from "react";
import EditorComponent from "./editorComponent/EditorComponent";
import './custom_Scrollbar.css'

const Write = () => {
  return (
    <main className="bg-[#fffbfa] min-h-[87vh] flex content-center">
      <div className="bg-[#fff] rounded-lg md:rounded-3xl w-[85%] md:w-[87%] lg:w-[57%] mx-auto md:px-2 lg:px-4 py-8 my-7 md:my-14 lg:my-24 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
        <EditorComponent />
      </div>
    </main>
  );
};

export default Write;
