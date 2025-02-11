import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header = () => {
  return (
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
          LuckiDoki 쇼핑몰 관리페이지
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography
            component={Link}
            to="/"
            sx={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
          >
            대시보드
          </Typography>
          <Typography
            component={Link}
            to="/product"
            sx={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
          >
            상품
          </Typography>
          <Typography
            component={Link}
            to="/seller"
            sx={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
          >
            셀러요청
          </Typography>
          <Typography
            component={Link}
            to="/member"
            sx={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
          >
            회원
          </Typography>
          <Typography
            component={Link}
            to="/order"
            sx={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
          >
            주문
          </Typography>
          <Typography
            component={Link}
            to="/coupon"
            sx={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
          >
            쿠폰
          </Typography>
          <Typography
            component={Link}
            to="/event"
            sx={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}
          >
            기획전
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
