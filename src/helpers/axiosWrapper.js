import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";

const useAxiosWrapper = () => {
  const refresh = useRefreshToken();
  const { user } = useAuth();
  const navigate = useNavigate();

  const setAuthorizationHeader = (config) => {
    if (!config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${user?.accessToken}`;
    }
    return config;
  };

  // This flag indicates if a refresh request is currently in progress.
  let isRefreshing = false;
  // This queue stores all the failed requests due to a 401 error.
  let failedQueue = [];

  // This function iterates over all the failed requests stored in the queue and resolves or rejects them based on the provided token.
  // If a token is provided, it means the refresh request was successful and thus the failed requests can be retried.
  // If no token is provided, it means the refresh request failed and thus the failed requests should also fail.
  // After processing the queue, it's reset to an empty array.
  const processQueue = async (error, token = null) => {
    let queuePromises = failedQueue.map((prom) => {
      if (error) {
        return prom.reject(error);
      } else {
        return prom.resolve(token);
      }
    });

    failedQueue = [];

    return Promise.all(queuePromises);
  };

  // This function handles 401 errors. It checks if a request failed due to a 401 error and attempts to refresh the access token.
  // If the refresh request is successful, it retries the failed request and processes the queue of failed requests.
  // If the refresh request fails, it clears the local storage and redirects to the login page.
  const handleAccessTokenExpiry = async (error) => {
    const prevRequest = error?.config;
    // Only process 401 errors and ensure this request hasn't been retried already.
    if (error?.response?.status === 403 && !prevRequest?._retry) {
      prevRequest._retry = true;

      // If no refresh request is in progress, start one.
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newAccessToken = await refresh();

          prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          await processQueue(null, newAccessToken);
          isRefreshing = false;
          return await axiosPrivate(prevRequest);
        } catch (refreshError) {
          await processQueue(refreshError, null);
          isRefreshing = false;
          navigate("/");
          return Promise.reject(refreshError);
        }
      } else {
        // If a refresh request is in progress, add this request to the queue of failed requests.
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(async (token) => {
            prevRequest.headers["Authorization"] = `Bearer ${token}`;
            return await axiosPrivate(prevRequest);
          })
          .catch(Promise.reject);
      }
    }

    return Promise.reject(error);
  };

  const axiosWrapper = async (url, method = "get", payload = {}) => {
    if (!url) {
      return null;
    }
    const response = {
      status: null,
      data: {},
      error: null,
    };

    const requestIntercepter = axiosPrivate.interceptors.request.use(
      (config) => setAuthorizationHeader(config),
      (error) => Promise.reject(error)
    );

    const responseIntercepter = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => handleAccessTokenExpiry(error)
    );

    try {
      let res = {};
      if (method === "get") {
        res = await axiosPrivate.get(url);
      }
      if (["post", "put", "patch"].includes(method)) {
        res = await axiosPrivate[method](url, payload);
      }
      if (method === "delete") {
        res = await axiosPrivate.delete(url, {
          data: payload,
        });
      }
      response.status = res.status;
      response.data = res.data;
      response.loading = false;
    } catch (err) {
      if (!err?.response) {
        response.error = "No server response.";
      } else if (err.response?.status < 500) {
        response.error = err.response?.data?.message || "Client error.";
      } else {
        response.error = "Request failed. Please try again later.";
      }
      response.status = err?.response?.status;
    }
    axiosPrivate.interceptors.request.eject(requestIntercepter);
    axiosPrivate.interceptors.response.eject(responseIntercepter);
    return response;
  };

  return { axiosWrapper };
};

export default useAxiosWrapper;
