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
          <Typography sx={{ color: 'white' }}>대시보드</Typography>
          <Typography sx={{ color: 'white' }}>상품</Typography>
          <Typography sx={{ color: 'white' }}>셀러요청</Typography>
          <Typography sx={{ color: 'white' }}>회원</Typography>
          <Typography sx={{ color: 'white' }}>주문</Typography>
          <Typography sx={{ color: 'white' }}>쿠폰</Typography>
          <Typography sx={{ color: 'white' }}>프로모션</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
