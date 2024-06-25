import axios, { AxiosError, AxiosResponse } from "axios";

export const api = axios.create({});

const onError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response.data;
};

api.interceptors.request.use((config) => config, onError);
api.interceptors.response.use(onResponse, onError);
