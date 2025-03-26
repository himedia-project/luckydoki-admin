import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  Tooltip,
} from '@mui/material';
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

// 스타일된 ListItem 컴포넌트 생성
const StyledListItem = styled(ListItem)(({ theme, expanded }) => ({
  padding: expanded ? '16px 20px' : '16px 14px',
  margin: expanded ? '4px 12px' : '4px 8px',
  borderRadius: '8px',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: expanded ? 'translateX(4px)' : 'none',
  },
  '&.active': {
    backgroundColor: 'white',
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: '#00DE90',
    },
  },
  '& .MuiListItemIcon-root': {
    color: 'white',
    minWidth: expanded ? '40px' : '24px',
  },
  '& .MuiListItemText-primary': {
    color: 'white',
    fontWeight: '500',
    fontSize: '0.95rem',
  },
}));

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

  const navigate = useNavigate();
  const [activePath, setActivePath] = useState(window.location.pathname);
  const [expanded, setExpanded] = useState(false);

  // 드로어 확장/축소 너비 설정
  const expandedWidth = 260;
  const collapsedWidth = 64;

  const menuItems = [
    { text: '대시보드', icon: <DashboardIcon />, path: '/' },
    { text: '상품', icon: <Inventory2Icon />, path: '/product' },
    { text: '샵', icon: <StoreIcon />, path: '/shop' },
    { text: '회원', icon: <PeopleIcon />, path: '/member' },
    { text: '주문', icon: <ShoppingCartIcon />, path: '/order' },
    { text: '쿠폰', icon: <LocalActivityIcon />, path: '/coupon' },
    { text: '이벤트', icon: <CelebrationIcon />, path: '/event' },
    { text: '이미지 테스트', icon: <ImageIcon />, path: '/image-test' },
  ];

  const handleMenuClick = (path) => {
    setActivePath(path);
    checkLoginAndNavigate(path);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'white',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: '64px !important' }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              color: '#00DE90',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            LuckyDoki 관리페이지
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {email ? (
            <Button
              onClick={handleLogout}
              sx={{
                color: '#00DE90',
                borderColor: '#00DE90',
                '&:hover': {
                  borderColor: '#00DE90',
                  backgroundColor: 'rgba(0, 222, 144, 0.08)',
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
                color: '#00DE90',
                borderColor: '#00DE90',
                '&:hover': {
                  borderColor: '#00DE90',
                  backgroundColor: 'rgba(0, 222, 144, 0.08)',
                },
              }}
              variant="outlined"
            >
              로그인
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        sx={{
          width: expanded ? expandedWidth : collapsedWidth,
          flexShrink: 0,
          transition: 'width 0.3s ease',
          '& .MuiDrawer-paper': {
            width: expanded ? expandedWidth : collapsedWidth,
            boxSizing: 'border-box',
            bgcolor: '#00DE90',
            backgroundImage: 'linear-gradient(to bottom, #00DE90, #00C080)',
            borderRight: 'none',
            mt: '64px',
            pt: 2,
            height: 'calc(100% - 64px)',
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            transition: 'width 0.3s ease',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          <List>
            {menuItems.map((item) => (
              <Tooltip
                title={expanded ? '' : item.text}
                placement="right"
                key={item.text}
              >
                <StyledListItem
                  button
                  className={activePath === item.path ? 'active' : ''}
                  onClick={() => handleMenuClick(item.path)}
                  expanded={expanded}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  {expanded && <ListItemText primary={item.text} />}
                </StyledListItem>
              </Tooltip>
            ))}
          </List>

          <Box sx={{ flexGrow: 1 }} />

          {expanded && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography
                variant="caption"
                sx={{ color: 'rgba(255,255,255,0.7)' }}
              >
                © 2023 LuckyDoki Admin
              </Typography>
            </Box>
          )}
        </Box>
      </Drawer>

      <Box
        sx={{
          marginLeft: expanded ? expandedWidth + 'px' : collapsedWidth + 'px',
          marginTop: '64px',
          p: 3,
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* 메인 콘텐츠가 들어갈 자리 */}
      </Box>

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
