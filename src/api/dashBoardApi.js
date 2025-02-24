// http://localhost:8080/api/admin/dashboard

import axiosInstance from './axiosInstance';

export const getDashboardData = async () => {
  return await axiosInstance.get('/dashboard');
};
