import axios from 'axios';
import store from '../app/redux/store';
import { setAccessToken, login } from '../app/redux/loginSlice';
import { API_SERVER_HOST } from '../config/apiConfig';
import { useDispatch } from 'react-redux';
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
    // const navigate = useNavigate();
    console.log('interceptor error: ', error);
    if (
      error.response.data &&
      error.response.data.error === 'ERROR_ACCESS_TOKEN'
    ) {
      const result = await refreshJWT();
      console.log('refreshJWT RESULT', result);

      // const accessToken = result.newAccessToken;

      // 로그인 성공 시 Redux store 업데이트
      // interceptor에서는 직접 store.dispatch를 사용해야
      // useDispatch(
      store.dispatch(
        login({
          email: result.email,
          roles: result.roles,
          accessToken: result.accessToken,
        }),
      );

      return axiosInstance(error.config); // 재요청
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
