import axiosInstance from './axiosInstance';

// 채팅방 목록 조회
export const getChatRooms = async (params) => {
  const response = await axiosInstance.get('/chatbot/room/list', {
    params,
  });
  return response.data;
};

// 채팅방 상세 조회
export const getChatRoom = async (roomId) => {
  const response = await axiosInstance.get(`/chatbot/room/${roomId}/chat/list`);
  return response.data;
};
