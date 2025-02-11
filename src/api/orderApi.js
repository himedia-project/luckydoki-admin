import axiosInstance from './axiosInstance';

export const getList = async (pageParam) => {
  const { page, size, sort, searchKeyword, year } = pageParam;
  const response = await axiosInstance.get(`/order/list`, {
    params: {
      page: page,
      size: size,
      sort: sort,
      searchKeyword: searchKeyword,
      year: year,
    },
  });
  return response.data;
};
