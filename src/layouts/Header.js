import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import StoreIcon from '@mui/icons-material/Store';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ImageIcon from '@mui/icons-material/Image';

import AlertModal from '../components/common/AlertModal';
import useCustomLogin from '../hooks/useCustomLogin';

const Header = () => {
  const {
    email,
    openAlert,
    alertMessage,
    isSuccess,
    handleLogout,
    checkLoginAndNavigate,
    handleCloseAlert,
  } = useCustomLogin();

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#00DE90', boxShadow: 'none' }}>
        <Toolbar sx={{ minHeight: '80px !important' }}>
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
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <DashboardIcon /> 대시보드
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
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Inventory2Icon /> 상품
            </Typography>
            <Typography
              component={Link}
              to="/shop"
              onClick={(e) => {
                e.preventDefault();
                checkLoginAndNavigate('/shop');
              }}
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <StoreIcon /> 샵
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
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <PeopleIcon /> 회원
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
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <ShoppingCartIcon /> 주문
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
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <LocalActivityIcon /> 쿠폰
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
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <CelebrationIcon /> 이벤트
            </Typography>
            <Typography
              component={Link}
              to="/image-test"
              onClick={(e) => {
                e.preventDefault();
                checkLoginAndNavigate('/image-test');
              }}
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <ImageIcon /> 이미지 테스트
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
