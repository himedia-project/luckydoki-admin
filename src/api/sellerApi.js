import axiosInstance from './axiosInstance';
import { API_SERVER_HOST } from '../config/apiConfig';

// /api/seller/request/list
// http://localhost:8080/api/admin/shop/seller-application/list

const host = `${API_SERVER_HOST}/api/admin/shop`;

export const getList = async (pageParam) => {
  const { page, size, sort, searchKeyword } = pageParam;
  const response = await axiosInstance.get(`${host}/seller-application/list`, {
    params: { page, size, sort, searchKeyword },
  });
  return response.data;
};
// approve
// http://localhost:8080/api/admin/shop/approve-seller/{{applicationId}}
export const approve = async (applicationId) => {
  const response = await axiosInstance.post(
    `${host}/approve-seller/${applicationId}`,
  );
  return response.data;
};
