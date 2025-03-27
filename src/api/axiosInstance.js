import axios from 'axios';
import store from '../app/redux/store';
import { login, logout } from '../app/redux/loginSlice';
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

// 로그인 에러 처리를 위한 전역 이벤트 핸들러 함수
const handleLoginError = (message) => {
  // 로그아웃 처리
  store.dispatch(logout());

  // 에러 알림 이벤트 발생
  const event = new CustomEvent('loginError', {
    detail: {
      message: message || '세션이 만료되었습니다. 다시 로그인해 주세요.',
    },
  });
  window.dispatchEvent(event);
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log('interceptor error: ', error);

    // 액세스 토큰 만료 처리
    if (
      error.response?.data &&
      error.response.data.error === 'ERROR_ACCESS_TOKEN'
    ) {
      try {
        const result = await refreshJWT();
        console.log('refreshJWT RESULT', result);

        // 로그인 성공 시 Redux store 업데이트
        store.dispatch(
          login({
            email: result.email,
            roles: result.roles,
            accessToken: result.accessToken,
          }),
        );

        return axiosInstance(error.config); // 재요청
      } catch (refreshError) {
        // 리프레시 토큰도 만료된 경우
        handleLoginError('인증이 만료되었습니다. 다시 로그인해 주세요.');
        return Promise.reject(refreshError);
      }
    }

    // 권한 없음(403) 또는 로그인 필요(401) 처리
    if (
      error.response?.status === 403 ||
      (error.response?.data &&
        error.response.data.error === 'ERROR_ACCESSDENIED')
    ) {
      handleLoginError('접근 권한이 없습니다. 다시 로그인해 주세요.');
    }

    // 로그인 오류 처리
    if (error.response?.data && error.response.data.error === 'ERROR_LOGIN') {
      handleLoginError('로그인 정보가 올바르지 않습니다.');
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
