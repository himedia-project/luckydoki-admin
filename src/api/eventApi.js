import axiosInstance from './axiosInstance';

// /api/admin/event/list
export const getList = async (pageParam) => {
  const { page, size, sort, searchKeyword } = pageParam;
  const response = await axiosInstance.get('/event/list', {
    params: { page, size, sort, searchKeyword },
  });

  return response.data;
};
