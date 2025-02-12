import axiosInstance from './axiosInstance';

// http://localhost:8080/api/admin/event/list?searchKeyword=이벤트

export const getList = async (pageParam) => {
  const { page, size, sort, searchKeyword } = pageParam;
  const response = await axiosInstance.get('/event/list', {
    params: { page, size, sort, searchKeyword },
  });

  return response.data;
};

// http://localhost:8080/api/admin/event
export const register = async (event) => {
  const response = await axiosInstance.post('/event', event);
  return response.data;
};
