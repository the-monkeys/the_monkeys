import React, { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";

import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import LinkTool from "@editorjs/link";
import RawTool from "@editorjs/raw";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";
import ImageTool from "@editorjs/image";
import FontSize from "editorjs-inline-font-size-tool";
import CodeTool from "@editorjs/code";
import "./ArticleEditor.css";
import Highlight, { defaultProps } from "prism-react-renderer";
import { useSelector, useDispatch } from "react-redux";
import {
  addImageData,
  getImageData,
  deleteImageData,
  updateUploadedImages,
  deleteUnusedImage
} from "../../redux/articleEditor/articleEditorSlice";


const Content = (code) => {
  return (
    <Highlight {...defaultProps} code={`${code.code}`} language="jsx">
      {({ className, style, tokens, getLineProps, getTokenProps }) => {
        console.log(className, "className---");
        return (
          <pre className={className + " pre-code"} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        );
      }}
    </Highlight>
  );
};

const DisplayList = ({ list }) => {
  return (
    <div className="list">
      {list?.data?.items.map((el, i) => {
        return (
          <p className="list-data">
            {list?.data?.style === "ordered" ? i + 1 : "*"}. {el}
          </p>
        );
      })}
    </div>
  );
};

export const ArticleEditor = () => {
  const [htmlCode, setHtmlCode] = useState();


  const [page, setPage] = useState("Editor");


  const dispatch = useDispatch();




  const token = useSelector((store) => store?.auth?.data?.token);
  let imagesUploadedData = useSelector(state => state.articleEditor.imagesUploaded)


    useEffect(() => {
    console.log("In useEffect", {
      imagesUploadedData,
    });
  }, [imagesUploadedData]);


  const handleChange = (api, event) => {

    let currentImages = [];
    document.querySelectorAll(".image-tool__image-picture").forEach((x) => {
      currentImages.push(...currentImages, x?.src);
    });




    if (imagesUploadedData.length > currentImages.length) {
      imagesUploadedData.forEach(async (img) => {
        if (!currentImages.includes(img.src) ) {
          try {
            if(!img?.isDeleted){
            let response = await dispatch(
              deleteImageData({
                config: {
                  headers: {
                    Authorization: "Bearer " + token,
                  },
                },
                url: "/334343/" + img?.fileName,
              })

            );

            if(response){
                dispatch(deleteUnusedImage({fileName: img?.fileName}))
            }

            } 
          } catch (err) {
            console.log(err.message);
          }
        }      
      });
    }
  };

  const editor = new EditorJS({
    holder: "editor",
    autofocus: true,

    tools: {
      header: {
        class: Header,
      },
      list: List,
      linkTool: {
        class: LinkTool,
        config: {
          endpoint: "http://localhost:8008/fetchUrl", // Your backend endpoint for url data fetching,
        },
      },
      image: {
        class: ImageTool,
        config: {
          uploader: {
            uploadByFile(file) {
              let formData = new FormData();

              formData.append("file", file);

              let config = {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: "Bearer " + token,
                },
              };

              return dispatch(
                addImageData({ formData, config, url: "/334343" })
              ).then((response) => {
                if (response?.payload?.status === 200) {
                  console.log("hey im ere");

                  return dispatch(
                    getImageData({
                      config: {
                        headers: {
                          Authorization: "Bearer " + token,
                        },
                        responseType: "blob",
                      },
                      url: "/334343/" + file?.name,
                    })
                  ).then((res) => {
                    console.log(res, "get api");
                    if (res?.type === "articleEditor/getImage/fulfilled") {
                      if (res?.payload) {
                        let url = URL.createObjectURL(res?.payload);

                        dispatch(updateUploadedImages(
                           {
                            src: url,
                            fileName: file?.name,
                            isDeleted: false,
                          }
                          ))

                        return {
                          success: 1,
                          file: {
                            url: url,
                          },
                        };
                      }
                    }
                  });
                }
              });

         
            },
          },

   
        },
      },
      raw: RawTool,
      checklist: {
        class: Checklist,
        inlineToolbar: true,
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
        shortcut: "CMD+SHIFT+O",
        config: {
          quotePlaceholder: "Enter a quote",
          captionPlaceholder: "Quote's author",
        },
      },
      code: CodeTool,
      fontSize: FontSize,
    },

    onChange: handleChange,

    minHeight: 0,
  });

  const convertToHTML = (data) => {
    console.log(data, "---data ");

    let html = "";

    data?.blocks?.forEach((item) => {
      // console.log(item, "---")

      if (item?.type === "paragraph") {
        html += `<p>${item?.data?.text}</p>`;
      }

      if (item?.type === "header") {
        html += `<h${item?.data?.level}>${item?.data?.text}<h${item?.data?.level}>`;
      }

      if (item?.type === "code") {
        html += ReactDOMServer.renderToString(
          <Content code={item?.data?.code} />
        );
      }

      if (item?.type === "list") {
        html += ReactDOMServer.renderToString(<DisplayList list={item} />);
      }
    });

    console.log(html, "---html");

    setHtmlCode(html);
  };

  const handleSubmit = () => {
    editor
      .save()
      .then((outputData) => {
        convertToHTML(outputData);
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  };

  const handlePreviewClick = (page) => {
    console.log(page, "click---");
    if (page === "Editor") {
      setPage("Preview");
    } else {
      setPage("Editor");
    }
  };



  return (
    <div>
      <div className="flex items-center justify-center">
        <button
          className="mx-6 my-12 text-2xl py-2 px-6 text-white  bg-lightBlack baseline
            cursor-pointer rounded-sm hover:bg-transparent hover:text-lightBlack
            border-2 hover: border-lightBlack"
          onClick={() => handlePreviewClick(page)}
        >
          {page === "Editor" ? "Show Preview" : "Exit Preview"}
        </button>
        <button
          className="  text-2xl  py-2 px-6 text-white  bg-lightBlack baseline
            cursor-pointer rounded-sm hover:bg-transparent hover:text-lightBlack
            border-2 hover: border-lightBlack"
          onClick={handleSubmit}
        >
          Submit Your Article
        </button>
      </div>
      {page === "Editor" && (
        <div>
          <div className="editor-container">
            <div id="editor"></div>
          </div>
        </div>
      )}

      {page === "Preview" && (
        <div>
          {/* <button className="text-2xl py-2 px-6 text-white  bg-lightBlack baseline
            cursor-pointer rounded-sm hover:bg-transparent hover:text-lightBlack
            border-2 hover: border-lightBlack" onClick={handleExitPreview}>Exit Preview</button> */}

          <div
            className="article"
            dangerouslySetInnerHTML={{ __html: htmlCode }}
          ></div>
        </div>
      )}
    </div>
  );
};
