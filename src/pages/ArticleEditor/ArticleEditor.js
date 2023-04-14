
import React, { useState } from "react"
import ReactDOMServer from 'react-dom/server';

import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header'
import List from '@editorjs/list'
import LinkTool from '@editorjs/link';
import RawTool from '@editorjs/raw';
import Checklist from '@editorjs/checklist';
import Quote from '@editorjs/quote';
import ImageTool from '@editorjs/image';
import FontSize from 'editorjs-inline-font-size-tool'
import CodeTool from '@editorjs/code';
import "./ArticleEditor.css"
import Highlight, { defaultProps } from "prism-react-renderer";
import axios from "axios"
import { useSelector } from "react-redux";


// s3://themonkeys/blogsimages/

const Content = (code) => {


    console.log("Contentn,", code)
    return <Highlight {...defaultProps} code={`${code.code}`} language="jsx">
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
            console.log(className, "className---")
            return <pre className={className + " pre-code"} style={style}>
                {tokens.map((line, i) => (
                    <div    {...getLineProps({ line, key: i })}>
                        {line.map((token, key) => (
                            <span {...getTokenProps({ token, key })} />
                        ))}
                    </div>
                ))}
            </pre>
        }}
    </Highlight>
}


const DisplayList = ({ list }) => {
    return (
        <div className="list">
            {
                list?.data?.items.map((el, i) => {
                    return <p className="list-data">{list?.data?.style === "ordered" ? i + 1 :
                        "*"}. {el}</p>
                })
            }
        </div>
    )
}



export const ArticleEditor = () => {

    const [htmlCode, setHtmlCode] = useState()

    const [imagesUploaded, setImagesUploaded] = useState([])

    const [page, setPage] = useState("Editor")

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


    const editor = new EditorJS({
        holder: 'editor',
        autofocus: true,

        tools: {
            header: {
                class: Header,

            },
            list: List,
            linkTool: {
                class: LinkTool,
                config: {
                    endpoint: 'http://localhost:8008/fetchUrl', // Your backend endpoint for url data fetching,
                }
            },
            image: {
                class: ImageTool,
                config: {
                    uploader: {
                        uploadByFile(file) {
                            let formData = new FormData()

                            formData.append("file", file)
                            return axios.post("http://localhost:3000/api/files/post/334343", formData, {
                                headers: {
                                    'Access-Control-Allow-Origin': '*',
                                    "Content-Type": "multipart/form-data",
                                    "Authorization": "Bearer " + token
                                },
                            }).then(data => {
                                return axios.get("http://localhost:3000/api/files/post/334343/" + file?.name, {
                                    headers: {
                                        "Authorization": "Bearer " + token,
                                    },
                                    responseType: 'blob'

                                }).then(data => {
                                    setImagesUploaded((x) => [...x, {
                                        src: URL.createObjectURL(data?.data),
                                        fileName: file?.name,
                                    } ])

                                    return {
                                        success: 1,
                                        file: {
                                            url: URL.createObjectURL(data?.data),
                                            alt: file?.name,
                                            id: file?.name,
                                            width: 100
                                            // any other image data you want to store, such as width, height, color, extension, etc
                                        }
                                    };
                                })
                                // console.log("Image upload data, ", data)
                            })

                        }
                    }


                    // endpoints: {
                    //     byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
                    //     byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
                    // }
                }


            },
            raw: RawTool,
            checklist: {
                class: Checklist,
                inlineToolbar: true,
            },
            quote: {
                class: Quote,
                inlineToolbar: true,
                shortcut: 'CMD+SHIFT+O',
                config: {
                    quotePlaceholder: 'Enter a quote',
                    captionPlaceholder: 'Quote\'s author',
                },
            },
            code: CodeTool,
            fontSize: FontSize
        },

        onChange: handleChange,

        minHeight: 0

    })



    const convertToHTML = (data) => {

        console.log(data, "---data ")

        let html = ""

        data?.blocks?.forEach(item => {

            // console.log(item, "---")

            if (item?.type === "paragraph") {
                html += `<p>${item?.data?.text}</p>`
            }

            if (item?.type === "header") {
                html += `<h${item?.data?.level}>${item?.data?.text}<h${item?.data?.level}>`
            }

            if (item?.type === "code") {
                html += ReactDOMServer.renderToString(<Content code={item?.data?.code} />)
            }

            if (item?.type === "list") {
                html += ReactDOMServer.renderToString(<DisplayList list={item} />)
            }

        })

        console.log(html, "---html")

        setHtmlCode(html)

    }

    const handleSubmit = () => {
        editor.save().then((outputData) => {
            convertToHTML(outputData)
        }).catch((error) => {
            console.log('Saving failed: ', error)
        });
    }


    const handlePreviewClick = (page) => {
        console.log(page, "click---")
        if (page === "Editor") {
            setPage("Preview")
        } else {
            setPage("Editor")
        }
    }

    // const handleExitPreview = () => {
    //     setPage("Editor")

    // }

    console.log(htmlCode, "-----html code")


    return (
        <div>
            <div className="flex items-center justify-center">
                <button className="mx-6 my-12 text-2xl py-2 px-6 text-white  bg-lightBlack baseline
            cursor-pointer rounded-sm hover:bg-transparent hover:text-lightBlack
            border-2 hover: border-lightBlack" onClick={() => handlePreviewClick(page)}>{page === "Editor" ? "Show Preview" : "Exit Preview"}</button>
                <button className="  text-2xl  py-2 px-6 text-white  bg-lightBlack baseline
            cursor-pointer rounded-sm hover:bg-transparent hover:text-lightBlack
            border-2 hover: border-lightBlack" onClick={handleSubmit}>Submit Your Article</button>

            </div>
            {
                page === "Editor" && (
                    <div>

                        <div className="editor-container">
                            <div id="editor"></div>

                        </div>

                    </div>
                )
            }

            {
                page === "Preview" && (
                    <div>

                        {/* <button className="text-2xl py-2 px-6 text-white  bg-lightBlack baseline
            cursor-pointer rounded-sm hover:bg-transparent hover:text-lightBlack
            border-2 hover: border-lightBlack" onClick={handleExitPreview}>Exit Preview</button> */}

                        <div className="article" dangerouslySetInnerHTML={{ __html: htmlCode }}></div>
                    </div>
                )
            }

        </div>
    )
}






// Introduction to Array Data Structure



// Hello all, In this article we are going to learn about arrays data structure.

// So, Let's get into the article.



// Basically, Arrays is one of the important data structure, It's used to store same type of data in programming languages.

