import axios from "axios";
import Constant from "./Constant";

const REACT_APP_API = process.env.REACT_APP_API_URI;

class UserService {
  getOne(id) {
    return axios.get(
      `https://themonkeys.tech/api/v1/` + `profile/user/${id}`,
      Constant.getHeader()
    );
  }

  getProfImg(id) {
    return axios.get(
      `https://themonkeys.tech/api/v1/` + `files/profile/${id}/profile`
      // Constant.getHeader()
    );
  }
}

export default new UserService();
