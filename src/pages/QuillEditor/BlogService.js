import axios from "axios";
import { useParams } from "react-router-dom";

const REACT_APP_API = process.env.REACT_APP_API;

class BlogServices {
    postBlog(blogid, data) {
        return axios.post(
            REACT_APP_API + `/v1/files/post/${blogid}`,
            data,
        )
    }
}

export default new BlogServices();