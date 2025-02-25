import axiosInstance from './axiosInstance';

// /api/admin/product/list
export const getList = async (pageParam) => {
  const {
    page,
    size,
    sort,
    searchKeyword,
    categoryId,
    isNew,
    best,
    event,
    shopId,
    approvalStatus,
  } = pageParam;
  const response = await axiosInstance.get(`/product/list`, {
    params: {
      page: page,
      size: size,
      sort: sort,
      searchKeyword: searchKeyword,
      categoryId: categoryId,
      isNew: isNew,
      best: best,
      event: event,
      shopId: shopId,
      approvalStatus: approvalStatus,
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

// is-new 변경
// localhost:8080/api/admin/product/best
// {
//   "productIds": [1,2,3]
// }
export const changeIsNew = async (productIds) => {
  const response = await axiosInstance.patch(`/product/is-new`, {
    productIds: productIds,
  });
  return response.data;
};

// best 변경
// localhost:8080/api/admin/product/best
// {
//   "productIds": [1,2,3]
// }
export const changeBest = async (productIds) => {
  const response = await axiosInstance.patch(`/product/best`, {
    productIds: productIds,
  });
  return response.data;
};

// 상품 승인 신청
// http://localhost:8080/api/admin/product/approve
export const approveProduct = async (productIds) => {
  const response = await axiosInstance.put(`/product/approve`, {
    productIds: productIds,
  });
  return response.data;
};

// 승인 안된 상품 목록 조회
// http://localhost:8080/api/admin/product/list/not-approved
export const getNotApprovedList = async () => {
  const response = await axiosInstance.get('/product/approve/list');
  return response.data;
};
