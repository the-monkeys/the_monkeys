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
import { useParams } from 'react-router-dom'
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

    const [imagesUploaded, setImagesUploaded] = useState([])

  const [page, setPage] = useState("Editor");


  const dispatch = useDispatch();

    console.log({
        imagesUploaded
    })

    const token = useSelector((store) => store?.auth?.data?.token);

    
    const handleChange = () => {
        let currentImages = []
        document.querySelectorAll(".image-tool__image-picture").forEach((x) => {
			currentImages.push(...currentImages, x?.src);
		});

        console.log(currentImages)
        console.log("----", imagesUploaded , currentImages.length)
        if (imagesUploaded.length > currentImages.length) {
            console.log("Yeah, lets delete")
            imagesUploaded.forEach(async (img) => {
                console.log("img", img)

            //   if (!currentImages.includes(img)) {
            //     try {
            //       const res = await fetch('/api/upload', {
            //         method: 'DELETE',
            //         headers: {
            //           'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify({ path: img.match(/image.*$/g)[0] }),
            //       })
            //       const data = await res.text()
            //       console.log(data)
            //       setImagesUploaded((images) => images.filter((x) => x !== img))
            //     } catch (err) {
            //       console.log(err.message)
            //     }
            //   }
            })
          }
    }

  console.log({id})

    const token = useSelector((store) => store?.auth?.data?.token);
  let imagesUploadedData = useSelector(state => state.articleEditor.imagesUploaded)


    useEffect(() => {

    // let currentImages = [];

    // document.querySelectorAll(".image-tool__image-picture").forEach((x) => {
    //   currentImages.push(...currentImages, x?.src);
    // });




    // if (imagesUploadedData.length > currentImages.length) {
    //   imagesUploadedData.forEach(async (img) => {
    //     if (!currentImages.includes(img.src) ) {
     async function deleteImg(){
          try {
            console.log({imagesUploadedData})
            imagesUploadedData.forEach(async (img) => {
            if(img?.isDeleted){
            let response = await dispatch(
              deleteImageData({
                config: {
                  headers: {
                    Authorization: "Bearer " + token,
                  },
                },
                url: "/" + id + "/" + img?.fileName,
              })

            );

            if(response){
                dispatch(deleteUnusedImage({fileName: img?.fileName}))
            }

}
          }    )
          } catch (err) {
          }
        }
        
        // }      

      // });
    // }
    
    deleteImg()

  }, [imagesUploadedData, dispatch, token, id]);


  const handleChange = (api, event) => {

    let currentImages = [];
    document.querySelectorAll(".image-tool__image-picture").forEach((x) => {
      currentImages.push(...currentImages, x?.src);
    });

currentImages = [...new Set(currentImages)];





    if (imagesUploadedData.length > currentImages.length) {
      imagesUploadedData.forEach(async (img) => {
        if (!currentImages.includes(img.src) ) {
          try {

            console.log({ imagesUploadedData})
                dispatch(deleteUnusedImage({fileName: img?.fileName}))

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
                addImageData({ formData, config, url: "/" + id })
              ).then((response) => {
                if (response?.payload?.status === 200) {

                  return dispatch(
                    getImageData({
                      config: {
                        headers: {
                          Authorization: "Bearer " + token,
                        },
                        responseType: "blob",
                      },
                      url: "/" + id + "/" + file?.name,
                    })
                  ).then((res) => {
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

    let html = "";

    data?.blocks?.forEach((item) => {

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

    setHtmlCode(html);
  };

  const handleSubmit = () => {
    editor
      .save()
      .then((outputData) => {
        convertToHTML(outputData);
      })
      .catch((error) => {
      });
  };

  const handlePreviewClick = (page) => {
    if (page === "Editor") {
      setPage("Preview");
    } else {
      setPage("Editor");
    }
  };



  return (
    <div>
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

            <div className="flex items-center justify-center">
        <button
          className="mx-6 my-12 text-2xl py-2 px-6 text-white  bg-lightBlack baseline
            cursor-pointer rounded-sm hover:bg-transparent hover:text-lightBlack
            border-2 hover: border-lightBlack"
          onClick={() => handlePreviewClick(page)}
        >
          {page === "Editor" ? "Save & Preview" : "Exit Preview"}
        </button>
        <button
          className="  text-2xl  py-2 px-6 text-white  bg-lightBlack baseline
            cursor-pointer rounded-sm hover:bg-transparent hover:text-lightBlack
            border-2 hover: border-lightBlack"
          onClick={handleSubmit}
        >
          Save & Publish
        </button>
      </div> 

    </div>
  );
};
