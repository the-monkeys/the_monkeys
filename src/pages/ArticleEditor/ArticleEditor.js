
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
    console.log(list, "list")
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


    const [page, setPage] = useState("Editor")



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
                    endpoints: {
                        byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
                        byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
                    }
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

