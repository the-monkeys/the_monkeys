import axios from "axios";
import { useParams } from "react-router-dom";

const REACT_APP_API = process.env.REACT_APP_API;

class BlogServices {
    postBlog(id, data) {
        return axios.post(
            REACT_APP_API + `/v1/files/post/${id}`,
            data,
        )
    }
}

export default new BlogServices();