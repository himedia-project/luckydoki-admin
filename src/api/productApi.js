import axiosInstance from './axiosInstance';

// /api/admin/product/list
export const getList = async (pageParam) => {
  const { page, size, sort, searchKeyword, categoryId } = pageParam;
  const response = await axiosInstance.get(`/product/list`, {
    params: {
      page: page,
      size: size,
      sort: sort,
      searchKeyword: searchKeyword,
      categoryId: categoryId,
    },
  });
  return response.data;
};

// /api/admin/product/{id}
export const getOne = async (productId) => {
  const response = await axiosInstance.get(`/product/${productId}`);
  return response.data;
};

// /api/admin/product
export const register = async (product) => {
  const header = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };

  const response = await axiosInstance.post(`/product`, product, header);
  return response.data;
};

// /api/admin/product/{id}
export const modify = async (productId, product) => {
  const header = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const response = await axiosInstance.put(
    `/product/${productId}`,
    product,
    header,
  );
  return response.data;
};

// /api/admin/product/{id}
export const remove = async (productId) => {
  const response = await axiosInstance.delete(`/product/${productId}`);
  return response.data;
};
