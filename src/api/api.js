import axios from "axios";

export const API = () => {
  const BASE_URI = process.env.REACT_APP_API_HTTP;

  const ENDPOINTS = {
    REGISTER: {
      method: "POST",
      uri: "/api/v1/auth/register",
    },
    LOGIN: {
      method: "POST",
      uri: "/api/v1/auth/login",
    },
    PASSWORD: {
      FORGOT_PASS: {
        method: "POST",
        uri: "/api/v1/auth/forgot-pass",
      },
      VERIFY_EMAIL: {
        method: "GET",
        uri: "/api/v1/auth/reset-password?verificationparams",
      },
      UPDATE_PASS: {
        method: "POST",
        uri: "/api/v1/auth/update-password",
      },
    },
  };

  const callApi = (api, data = null) => {
    const { method, uri } = api;

    if (method === "GET")
      return axios.get(BASE_URI + uri).then((res) => res.data);
    if (method === "POST" && data)
      return axios.post(BASE_URI + uri, data).then((res) => res.data);
  };

  return {
    register: (data) => callApi(ENDPOINTS.REGISTER, data),
    login: () => callApi(ENDPOINTS.LOGIN),
  };
};
