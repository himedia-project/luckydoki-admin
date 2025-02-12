import axiosInstance from './axiosInstance';

// /api/admin/coupon/list
export const getList = async (pageParam) => {
  const { page, size, sort, searchKeyword } = pageParam;
  const response = await axiosInstance.get('/coupon/list', {
    params: { page, size, sort, searchKeyword },
  });
  return response.data;
};
