import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

import { logoutPost } from '../api/loginApi';
import { logout } from '../app/redux/loginSlice';
import AlertModal from '../components/common/AlertModal';

const Header = () => {
  const { email } = useSelector((state) => state.loginSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);

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

  const handleCloseAlert = () => {
    setOpenAlert(false);
    if (!email) {
      navigate('/login');
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#00DE90', boxShadow: 'none' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              color: 'white',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            LuckyDoki 관리페이지
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography
              component={Link}
              to="/"
              onClick={(e) => {
                e.preventDefault();
                checkLoginAndNavigate('/');
              }}
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              대시보드
            </Typography>
            <Typography
              component={Link}
              to="/product"
              onClick={(e) => {
                e.preventDefault();
                checkLoginAndNavigate('/product');
              }}
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              상품
            </Typography>
            <Typography
              component={Link}
              to="/seller"
              onClick={(e) => {
                e.preventDefault();
                checkLoginAndNavigate('/seller');
              }}
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              셀러요청
            </Typography>
            <Typography
              component={Link}
              to="/member"
              onClick={(e) => {
                e.preventDefault();
                checkLoginAndNavigate('/member');
              }}
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              회원
            </Typography>
            <Typography
              component={Link}
              to="/order"
              onClick={(e) => {
                e.preventDefault();
                checkLoginAndNavigate('/order');
              }}
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              주문
            </Typography>
            <Typography
              component={Link}
              to="/coupon"
              onClick={(e) => {
                e.preventDefault();
                checkLoginAndNavigate('/coupon');
              }}
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              쿠폰
            </Typography>
            <Typography
              component={Link}
              to="/event"
              onClick={(e) => {
                e.preventDefault();
                checkLoginAndNavigate('/event');
              }}
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              기획전
            </Typography>
            {email ? (
              <Button
                onClick={handleLogout}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                variant="outlined"
              >
                로그아웃
              </Button>
            ) : (
              <Button
                component={Link}
                to="/login"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
                variant="outlined"
              >
                로그인
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <AlertModal
        open={openAlert}
        onClose={handleCloseAlert}
        title={isSuccess ? '성공' : '알림'}
        message={alertMessage}
        isSuccess={isSuccess}
      />
    </>
  );
};

export default Header;
