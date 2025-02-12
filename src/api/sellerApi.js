import axiosInstance from './axiosInstance';
import { API_SERVER_HOST } from '../config/apiConfig';

// /api/seller/request/list
// http://localhost:8080/api/admin/shop/seller-application/list

const host = `${API_SERVER_HOST}/api/admin/shop/seller-application`;

export const getList = async (pageParam) => {
  const { page, size, sort, searchKeyword } = pageParam;
  const response = await axiosInstance.get(`${host}/list`, {
    params: { page, size, sort, searchKeyword },
  });
  return response.data;
};
// approve
export const approve = async (sellerId) => {
  const response = await axiosInstance.post(`/seller/approve/${sellerId}`);
  return response.data;
};
