import { API_SERVER_HOST } from '../config/apiConfig';
import axios from 'axios';

const imageCache = new Map();

export const getImageUrl = async (fileUrl) => {
  if (imageCache.has(fileUrl)) {
    return imageCache.get(fileUrl);
  }

  try {
    const response = await axios.get(
      `${API_SERVER_HOST}/api/image/view/${fileUrl}`,
      {
        responseType: 'blob',
      },
    );
    const imageUrl = URL.createObjectURL(response.data);
    imageCache.set(fileUrl, imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('이미지 로딩 실패:', error);
  }
};

export const uploadImage = async (imageFile) => {
  if (!imageFile) {
    throw new Error('파일이 선택되지 않았습니다.');
  }

  const formData = new FormData();
  formData.append('file', imageFile);

  try {
    const response = await axios.post(
      `${API_SERVER_HOST}/api/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw new Error('이미지 업로드 중 오류가 발생했습니다.');
  }
};
