import axiosInstance from './axiosInstance';

// product excel register
export const registerProductExcel = (formData, config) => {
  return axiosInstance.post('/product/excel/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });
};

// product excel download
export const downloadProductExcel = async (idList) => {
  const response = await axiosInstance.post(
    `/product/excel/download`,
    { idList: idList },
    {
      responseType: 'blob',
      headers: {
        Accept:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Type': 'application/json',
      },
      transformResponse: [(data) => data],
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    },
  );
  return response;
};
