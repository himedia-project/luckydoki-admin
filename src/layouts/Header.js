import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
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
  Container,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import StoreIcon from '@mui/icons-material/Store';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ImageIcon from '@mui/icons-material/Image';
import ChatIcon from '@mui/icons-material/Chat';

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
    handleApiError,
    setOpenAlert,
    setAlertMessage,
    setIsSuccess,
  } = useCustomLogin();

  const navigate = useNavigate();
  const location = useLocation();
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
    { text: '챗봇', icon: <ChatIcon />, path: '/chatbot' },
    { text: '이미지 테스트', icon: <ImageIcon />, path: '/image-test' },
  ];

  const handleMenuClick = (path) => {
    setActivePath(path);
    checkLoginAndNavigate(path);
  };

  // 현재 경로를 감지하여 활성 메뉴 업데이트
  useEffect(() => {
    // URL이 변경되면 현재 경로를 기준으로 활성 메뉴 업데이트
    setActivePath(
      location.pathname === '/' ? '/' : '/' + location.pathname.split('/')[1],
    );
  }, [location.pathname]);

  // 로그인 에러 이벤트 리스너 추가
  useEffect(() => {
    const handleLoginErrorEvent = (event) => {
      setAlertMessage(event.detail.message);
      setIsSuccess(false);
      setOpenAlert(true);

      // 알림이 닫히면 로그인 페이지로 리디렉션하도록 세팅
      // handleCloseAlert 함수에서 이미 처리하고 있습니다
    };

    // 이벤트 리스너 등록
    window.addEventListener('loginError', handleLoginErrorEvent);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('loginError', handleLoginErrorEvent);
    };
  }, [setAlertMessage, setIsSuccess, setOpenAlert]);

  return (
    <Box sx={{ display: 'flex' }}>
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

      {/* 페이지 콘텐츠를 위한 메인 영역 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          width: {
            sm: `calc(100% - ${expanded ? expandedWidth : collapsedWidth}px)`,
            xs: '100%',
          },
          minHeight: 'calc(100vh - 64px)',
          marginTop: '64px',
          transition: 'width 0.3s ease, margin-left 0.3s ease',
          overflowX: 'hidden',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Outlet /> {/* React Router v6의 중첩 라우트를 위한 Outlet */}
        </Container>
      </Box>

      <AlertModal
        open={openAlert}
        onClose={handleCloseAlert}
        title={isSuccess ? '성공' : '알림'}
        message={alertMessage}
        isSuccess={isSuccess}
      />
    </Box>
  );
};

export default Header;
