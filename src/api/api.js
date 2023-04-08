import axios from "axios";

const Method = {
  Post: "POST",
  Get: "GET",
  Put: "PUT",
  Patch: "PATCH",
  Delete: "DELETE",
};

const rewritePath = (path) =>
  process.env.NODE_ENV === "production"
    ? `${process.env.REACT_APP_API_URI}/api/v1/${path}`
    : `/api/${path}`;

export const API = () => {
  const ENDPOINTS = {
    REGISTER: {
      method: Method.Post,
      uri: rewritePath("auth/register"),
    },
    LOGIN: {
      method: Method.Post,
      uri: rewritePath("auth/login"),
    },
    PASSWORD: {
      FORGOT_PASS: {
        method: Method.Post,
        uri: rewritePath("auth/forgot-pass"),
      },
      VERIFY_EMAIL: {
        method: Method.Get,
        uri: rewritePath("auth/reset-password?verificationparams"),
      },
      UPDATE_PASS: {
        method: Method.Post,
        uri: rewritePath("auth/update-password"),
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
