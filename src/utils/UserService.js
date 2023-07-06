import axios from "axios";
import Constant from "./Constant";

const REACT_APP_API = process.env.REACT_APP_API;

class UserService {
  getOne(id) {
    return axios.get(
      REACT_APP_API + `/profile/user/${id}`,
      Constant.getHeader()
    );
  }

  getProfImg(id) {
    return axios.get(
      REACT_APP_API + `/profile/user/pic/${id}`,
      Constant.getHeader()
    )
  }

}

export default new UserService();
