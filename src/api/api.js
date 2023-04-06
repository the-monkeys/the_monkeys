import axios from "axios";

const Method = {
  Post: "POST",
  Get: "GET",
  Put: "PUT",
  Patch: "PATCH",
  Delete: "DELETE",
};

export const API = () => {
  const ENDPOINTS = {
    REGISTER: {
      method: Method.Post,
      uri: "/api/auth/register",
    },
    LOGIN: {
      method: Method.Post,
      uri: "/api/auth/login",
    },
    PASSWORD: {
      FORGOT_PASS: {
        method: Method.Post,
        uri: "/api/auth/forgot-pass",
      },
      VERIFY_EMAIL: {
        method: Method.Get,
        uri: "/api/auth/reset-password?verificationparams",
      },
      UPDATE_PASS: {
        method: Method.Post,
        uri: "/api/auth/update-password",
      },
    },
  };

  const callApi = (api, data = null, config = undefined) => {
    const { method, uri } = api;

    switch (method) {
      case Method.Get:
        return axios.get(BASE_URI + uri, config).then((res) => res.data);
      case Method.Delete:
        return axios.delete(BASE_URI + uri, config).then((res) => res.data);
      case Method.Post:
        return axios.post(BASE_URI + uri, data, config).then((res) => res.data);
      case Method.Patch:
        return axios
          .patch(BASE_URI + uri, data, config)
          .then((res) => res.data);
      case Method.Put:
        return axios.put(BASE_URI + uri, data, config).then((res) => res.data);
      default:
        throw ReferenceError("Method is null or undefined");
    }
  };

  return {
    register: (data) => callApi(ENDPOINTS.REGISTER, data),
    login: () => callApi(ENDPOINTS.LOGIN),
  };
};
