import axiosInstance from './axiosInstance';

// 전체 일별 매출 데이터를 이용해 날짜 별 그래프, 시간별 그래프 출력
export const forecastPost = async () => {
  const response = await axiosInstance.post(`/sales/forecast`);
  return response.data;
};

export const forecastPostByDate = async (selectedDate) => {
  const response = await axiosInstance.post(`sales/forecast/date`, {
    selectedDate: selectedDate,
  });
  return response.data;
};
