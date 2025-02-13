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

// 쿠폰 발급
// http://localhost:8080/api/admin/coupon/1/issue
// {
//     "emails": [
//         "test@test.com",
//         "test2@test.com"
//     ]
// }
export const issueCoupon = async (couponId, emails) => {
  const response = await axiosInstance.post(`/coupon/${couponId}/issue`, {
    emails: emails,
  });
  return response.data;
};

// 쿠폰 발급 리스트
// http://localhost:8080/api/admin/coupon-record/list

export const getIssuedList = async (pageParam) => {
  const { page, size, sort, searchKeyword } = pageParam;
  const response = await axiosInstance.get('/coupon-record/list', {
    params: { page, size, sort, searchKeyword },
  });
  return response.data;
};
