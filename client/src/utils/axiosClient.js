import axios from "axios";
import {
  KEY_ACCESS_TOKEN,
  getItem,
  removeItem,
  setItem,
} from "./localStorageManager";

export const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
  const accessToken = getItem(KEY_ACCESS_TOKEN);
  request.headers["Authorization"] = `Bearer ${accessToken}`;

  return request;
});

axiosClient.interceptors.response.use(async (response) => {
  const data = response.data;
  if (data.status === "ok") {
    console.log(data);
    return data;
  }

  const originalRequest = response.config;
  const statusCode = data.statusCode;
  const error = data.error;

  // when  refresh token expires, send users to login page
  if (
    statusCode === 401 &&
    originalRequest === `${process.env.REACT_APP_SERVER_BASE_URL}/auth/refresh`
  ) {
    removeItem(KEY_ACCESS_TOKEN);
    window.location.replace("/login", "_self");
    return Promise.reject(error);
  }

  // means exccess Token has been expired
  if (statusCode === 401) {
    const response = await axiosClient.get("/auth/refresh");

    console.log("response from backend", response);

    if (response.status === "ok") {
      setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
      originalRequest.headers[
        "Authorization"
      ] = `Bearer ${response.result.accessToken}`;

      return axios(originalRequest);
    }
  }
  return Promise.reject(error);
});
