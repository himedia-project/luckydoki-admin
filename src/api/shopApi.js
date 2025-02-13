import axiosInstance from './axiosInstance';
import { API_SERVER_HOST } from '../config/apiConfig';

const host = `${API_SERVER_HOST}/api/admin/shop`;

// 샵 목록 조회
// http://localhost:8080/api/admin/shop/list
export const getShopList = async (params) => {
  const { page, size, sort, searchKeyword } = params;
  const response = await axiosInstance.get(`${host}/list`, {
    params: { page, size, sort, searchKeyword },
  });
  return response.data;
};
