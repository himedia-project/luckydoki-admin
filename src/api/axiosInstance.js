import axios from 'axios';
import store from '../app/redux/store';
import { setAccessToken, login } from '../app/redux/loginSlice';
import { API_SERVER_HOST } from '../config/apiConfig';
const axiosInstance = axios.create({
  baseURL: `${API_SERVER_HOST}/api/admin`,
  // 쿠키 허용
  withCredentials: true,
});

const refreshJWT = async () => {
  const res = await axiosInstance.get(`/member/refresh`);

  console.log('----------------------');
  console.log(res.data);

  return res.data;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().loginSlice.accessToken;
    console.log('axiosInstance.interceptors.request.use. token', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log('interceptor error: ', error);
    if (
      error.response.data &&
      error.response.data.error === 'ERROR_ACCESS_TOKEN'
    ) {
      const result = await refreshJWT();
      console.log('refreshJWT RESULT', result);

      // 로그인 성공 시 Redux store 업데이트
      // interceptor에서는 직접 store.dispatch를 사용해야
      store.dispatch(
        login({
          email: result.email,
          roles: result.roles,
          accessToken: result.accessToken,
        }),
      );

      return axiosInstance(error.config); // 재요청
    }

    if (
      error.response.data &&
      error.response.data.error === 'ERROR_ACCESSDENIED'
    ) {
      // Modal 표시를 위해 전역 이벤트 발생
      const event = new CustomEvent('showAlertModal', {
        detail: {
          title: '접근 오류',
          message: '세션이 만료되었습니다. 다시 로그인해 주세요.',
          onConfirm: () => {
            window.location.href = '/login'; // 또는 로그인 페이지 경로
          },
        },
      });
      window.dispatchEvent(event);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
