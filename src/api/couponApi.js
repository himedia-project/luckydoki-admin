import axiosInstance from './axiosInstance';

// /api/admin/coupon/list
export const getList = async (pageParam) => {
  const { page, size, sort, searchKeyword } = pageParam;
  const response = await axiosInstance.get('/coupon/list', {
    params: { page, size, sort, searchKeyword },
  });
  return response.data;
};

// POST http://localhost:8080/api/admin/coupon
// {
//     "name": "",
//     "content": "",
//     "startDate": "",
//     "endDate": ""

//   }

export const create = async (coupon) => {
  const response = await axiosInstance.post('/coupon', coupon);
  return response.data;
};
