import axiosInstance from './axiosInstance';

// /api/seller/request
export const request = async (seller) => {
  const response = await axiosInstance.post('/seller/request', seller);
  return response.data;
};

// approve
export const approve = async (sellerId) => {
  const response = await axiosInstance.post(`/seller/approve/${sellerId}`);
  return response.data;
};
