import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../app/redux/loginSlice';
import { logoutPost } from '../api/loginApi';

/**
 * 로그인 상태 및 오류 처리를 위한 커스텀 훅
 * @returns {Object} 로그인 관련 상태 및 함수들
 */
const useCustomLogin = () => {
  const { email } = useSelector((state) => state.loginSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);

  /**
   * 로그아웃 처리 함수
   */
  const handleLogout = async () => {
    try {
      await logoutPost();
      dispatch(logout());
      setAlertMessage('로그아웃이 되었습니다');
      setIsSuccess(true);
      setOpenAlert(true);
    } catch (error) {
      setAlertMessage('로그아웃 처리 중 오류가 발생했습니다');
      setIsSuccess(false);
      setOpenAlert(true);
    }
  };

  /**
   * 로그인 상태 확인 후 페이지 이동 함수
   * @param {string} path - 이동할 경로
   * @returns {boolean} 로그인 상태 여부
   */
  const checkLoginAndNavigate = (path) => {
    if (!email) {
      setAlertMessage('로그인을 해주세요!');
      setIsSuccess(false);
      setOpenAlert(true);
      return false;
    }
    navigate(path);
    return true;
  };

  /**
   * API 오류 처리 함수
   * @param {Error} error - 발생한 오류
   */
  const handleApiError = (error) => {
    if (
      error?.response?.data?.error === 'ERROR_ACCESSDENIED' ||
      error?.response?.data?.error === 'ERROR_LOGIN'
    ) {
      setAlertMessage('로그인이 필요하거나 세션이 만료되었습니다.');
      setIsSuccess(false);
      setOpenAlert(true);
      // 로그아웃 처리
      dispatch(logout());
    } else {
      setAlertMessage(error?.response?.data?.message || '오류가 발생했습니다');
      setIsSuccess(false);
      setOpenAlert(true);
    }
  };

  /**
   * 알림 모달 닫기 함수
   */
  const handleCloseAlert = () => {
    setOpenAlert(false);
    // 로그인 관련 오류였고 로그인되지 않은 상태라면 로그인 페이지로 이동
    if (!email && !isSuccess) {
      navigate('/login');
    }
  };

  return {
    email,
    openAlert,
    alertMessage,
    isSuccess,
    setOpenAlert,
    setAlertMessage,
    setIsSuccess,
    handleLogout,
    checkLoginAndNavigate,
    handleApiError,
    handleCloseAlert,
  };
};

export default useCustomLogin;
