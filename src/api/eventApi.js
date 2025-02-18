import axiosInstance from './axiosInstance';

// http://localhost:8080/api/admin/event/list?searchKeyword=이벤트

export const getList = async (pageParam) => {
  const { page, size, sort, searchKeyword } = pageParam;
  const response = await axiosInstance.get('/event/list', {
    params: { page, size, sort, searchKeyword },
  });

  return response.data;
};

// 이벤트 상세 조회
// GET http://localhost:8080/api/admin/event/{{id}}/detail
export const getEvent = async (eventId) => {
  const response = await axiosInstance.get(`/event/${eventId}/detail`);
  return response.data;
};

// http://localhost:8080/api/admin/event
export const register = async (event) => {
  const response = await axiosInstance.post('/event', event);
  return response.data;
};

// 이벤트 삭제
// DELETE http://localhost:8080/api/admin/event/{{id}}
export const deleteEvent = async (eventId) => {
  const response = await axiosInstance.delete(`/event/${eventId}`);
  return response.data;
};
