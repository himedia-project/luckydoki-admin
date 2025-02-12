import axiosInstance from './axiosInstance';
import { API_SERVER_HOST } from '../config/apiConfig';
const host = `${API_SERVER_HOST}/api/admin/member`;

export const getList = async (pageParam) => {
  const { page, size, sort, searchKeyword } = pageParam;
  const response = await axiosInstance.get(`${host}/list`, {
    params: {
      page: page,
      size: size,
      sort: sort,
      searchKeyword: searchKeyword,
    },
  });
  return response.data;
};

export const getMember = async (id) => {
  const response = await axiosInstance.get(`${host}/${id}`);
  return response.data;
};
