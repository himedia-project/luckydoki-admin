import axiosInstance from './axiosInstance';

export const generateReport = async (reportData) => {
  const response = await axiosInstance.post('/report/generate', reportData, {
    responseType: 'blob',
  });
  return response;
};
