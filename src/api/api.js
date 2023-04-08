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
      uri: "/api/register",
    },
    LOGIN: {
      method: Method.Post,
      uri: "/api/login",
    },
    PASSWORD: {
      FORGOT_PASS: {
        method: Method.Post,
        uri: "/api/forgot-pass",
      },
      VERIFY_EMAIL: {
        method: Method.Get,
        uri: "/api/reset-password?verificationparams",
      },
      UPDATE_PASS: {
        method: Method.Post,
        uri: "/api/update-password",
      },
    },
  };

  const callApi = (api, data = null, config = undefined) => {
    const { method, uri } = api;

    switch (method) {
      case Method.Get:
        return axios.get(uri, config).then((res) => res.data);
      case Method.Delete:
        return axios.delete(uri, config).then((res) => res.data);
      case Method.Post:
        return axios.post(uri, data, config).then((res) => res.data);
      case Method.Patch:
        return axios.patch(uri, data, config).then((res) => res.data);
      case Method.Put:
        return axios.put(uri, data, config).then((res) => res.data);
      default:
        throw ReferenceError("Method is null or undefined");
    }
  };

  return {
    register: (data) => callApi(ENDPOINTS.REGISTER, data),
    login: (data) => callApi(ENDPOINTS.LOGIN, data),
  };
};
