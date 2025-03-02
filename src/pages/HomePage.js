import {
  Avatar,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
  Dialog,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ImageLoader from '../components/image/ImageLoader';
import ReportGenerator from '../components/report/ReportGenerator';
import { useNavigate } from 'react-router-dom';
import { getDashboardData } from '../api/dashBoardApi';
import { FRONT_USER_HOST } from '../config/apiConfig';
import useCustomLogin from '../hooks/useCustomLogin';

const DashboardCard = ({ title, value, secondValue, onClick, description }) => (
  <Paper
    sx={{
      p: 3,
      borderRadius: 2,
      bgcolor: 'white',
      boxShadow: '0 4px 20px rgba(0, 222, 144, 0.1)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': onClick && {
        transform: 'translateY(-4px)',
        boxShadow: '0 6px 25px rgba(0, 222, 144, 0.2)',
      },
    }}
    onClick={onClick}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>
        {title}
      </Typography>
      {description && (
        <Typography
          component="span"
          sx={{
            ml: 1,
            px: 1,
            py: 0.3,
            fontSize: '0.7rem',
            bgcolor: 'rgba(0, 222, 144, 0.08)',
            color: '#00BA78',
            borderRadius: 1,
            border: '1px solid rgba(0, 222, 144, 0.2)',
          }}
        >
          {description}
        </Typography>
      )}
    </Box>
    {secondValue ? (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 1,
          flexWrap: 'wrap',
          wordBreak: 'break-word',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: '#00DE90',
            fontWeight: 'bold',
            wordBreak: 'break-word',
            fontSize: { xs: '1.5rem', sm: '2rem' },
            position: 'relative',
            display: 'inline-block',
            '&::after': onClick && {
              content: '""',
              position: 'absolute',
              width: '100%',
              height: '2px',
              bottom: 0,
              left: 0,
              backgroundColor: '#00DE90',
              transform: 'scaleX(0)',
              transformOrigin: 'bottom right',
              transition: 'transform 0.3s ease',
            },
            '&:hover::after': onClick && {
              transform: 'scaleX(1)',
              transformOrigin: 'bottom left',
            },
          }}
        >
          {value}
        </Typography>
        <Typography
          sx={{
            color: '#666',
            fontSize: '1.5rem',
            fontWeight: 500,
          }}
        >
          /
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: '#00DE90',
            fontWeight: 'bold',
            wordBreak: 'break-word',
            fontSize: { xs: '1.5rem', sm: '2rem' },
            position: 'relative',
            display: 'inline-block',
            '&::after': onClick && {
              content: '""',
              position: 'absolute',
              width: '100%',
              height: '2px',
              bottom: 0,
              left: 0,
              backgroundColor: '#00DE90',
              transform: 'scaleX(0)',
              transformOrigin: 'bottom right',
              transition: 'transform 0.3s ease',
            },
            '&:hover::after': onClick && {
              transform: 'scaleX(1)',
              transformOrigin: 'bottom left',
            },
          }}
        >
          {secondValue}
        </Typography>
      </Box>
    ) : (
      <Typography
        variant="h4"
        sx={{
          color: '#00DE90',
          fontWeight: 'bold',
          position: 'relative',
          display: 'inline-block',
          '&::after': onClick && {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '2px',
            bottom: 0,
            left: 0,
            backgroundColor: '#00DE90',
            transform: 'scaleX(0)',
            transformOrigin: 'bottom right',
            transition: 'transform 0.3s ease',
          },
          '&:hover::after': onClick && {
            transform: 'scaleX(1)',
            transformOrigin: 'bottom left',
          },
        }}
      >
        {value}
      </Typography>
    )}
  </Paper>
);

const ProductCard = ({ product, rank }) => (
  <ListItem
    sx={{
      bgcolor: 'white',
      mb: 1.5,
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        bgcolor: 'rgba(0, 222, 144, 0.02)',
      },
    }}
    onClick={() =>
      window.open(`${FRONT_USER_HOST}/product/${product.id}`, '_blank')
    }
  >
    <Box
      sx={{
        minWidth: 32,
        height: 32,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: rank <= 3 ? '#00DE90' : '#f5f5f5',
        color: rank <= 3 ? 'white' : '#666',
        fontWeight: 'bold',
        mr: 2,
      }}
    >
      {rank}
    </Box>
    <Avatar
      sx={{
        mr: 2,
        width: 48,
        height: 48,
        borderRadius: 2,
      }}
    >
      <ImageLoader
        imagePath={product.uploadFileNames[0]}
        alt={product.name}
        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        type="product"
      />
    </Avatar>
    <ListItemText
      primary={
        <Typography sx={{ fontWeight: 500, color: '#2c3e50' }}>
          {product.name}
        </Typography>
      }
      secondary={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <Typography
            component="span"
            sx={{ color: '#00BA78', fontWeight: 500, fontSize: '0.875rem' }}
          >
            ₩{product.discountPrice.toLocaleString()}
          </Typography>
          <Typography
            component="span"
            sx={{
              color: '#666',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            •
          </Typography>
          <Typography
            component="span"
            sx={{
              color: '#666',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            ⭐ {product.reviewAverage.toFixed(1)}
            <Typography
              component="span"
              sx={{ color: '#999', fontSize: '0.75rem' }}
            >
              ({product.reviewCount})
            </Typography>
          </Typography>
          <Typography
            component="span"
            sx={{
              color: '#666',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            🩷 {product.likesCount}
          </Typography>
          <Typography
            component="span"
            sx={{
              color: '#666',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            📦 {product.salesCount}
          </Typography>
        </Box>
      }
    />
  </ListItem>
);

const UserCard = ({ user, rank, isSeller }) => (
  <ListItem
    sx={{
      bgcolor: 'white',
      mb: 1.5,
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
    }}
  >
    <Box
      sx={{
        minWidth: 32,
        height: 32,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: rank <= 3 ? '#00DE90' : '#f5f5f5',
        color: rank <= 3 ? 'white' : '#666',
        fontWeight: 'bold',
        mr: 2,
      }}
    >
      {rank}
    </Box>
    <Avatar
      sx={{
        mr: 2,
        width: 40,
        height: 40,
        borderRadius: isSeller ? 2 : '50%',
        bgcolor: '#f5f5f5',
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <ImageLoader
        imagePath={isSeller ? user?.shopImage : user?.profileImage}
        alt={user?.nickName || 'User'}
        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        type={isSeller ? 'shop' : 'user'}
      />
    </Avatar>
    <ListItemText
      primary={
        <Typography sx={{ fontWeight: 500, color: '#2c3e50' }}>
          {user?.nickName || '-'}
        </Typography>
      }
      secondary={
        <Typography sx={{ color: '#666', fontSize: '0.875rem' }}>
          {user?.email || '-'}
        </Typography>
      }
    />
  </ListItem>
);

const NotificationCard = ({ count, onClick }) => (
  <Paper
    sx={{
      p: 2.5,
      mb: 4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 2,
      bgcolor: 'rgba(0, 222, 144, 0.08)',
      border: '1px solid rgba(0, 222, 144, 0.2)',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        bgcolor: 'rgba(0, 222, 144, 0.12)',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0, 222, 144, 0.15)',
      },
    }}
    onClick={onClick}
  >
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          bgcolor: '#00DE90',
          mr: 2,
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
              opacity: 1,
            },
            '50%': {
              transform: 'scale(1.5)',
              opacity: 0.5,
            },
            '100%': {
              transform: 'scale(1)',
              opacity: 1,
            },
          },
        }}
      />
      <Typography
        sx={{ color: '#2c3e50', fontWeight: 500, fontSize: '0.95rem' }}
      >
        새로운 판매자 승인 요청이 있습니다
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography
        sx={{
          color: '#00DE90',
          fontWeight: 'bold',
          bgcolor: 'white',
          px: 2,
          py: 0.75,
          borderRadius: 5,
          fontSize: '0.9rem',
          boxShadow: '0 2px 8px rgba(0, 222, 144, 0.15)',
        }}
      >
        {count}건
      </Typography>
      <Typography
        sx={{
          color: '#00DE90',
          fontSize: '0.85rem',
          fontWeight: 500,
        }}
      >
        바로가기 →
      </Typography>
    </Box>
  </Paper>
);

const CommunityCard = ({ community, rank }) => (
  <ListItem
    sx={{
      bgcolor: 'white',
      mb: 1.5,
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        bgcolor: 'rgba(0, 222, 144, 0.02)',
      },
    }}
    onClick={() =>
      window.open(`${FRONT_USER_HOST}/community/${community.id}`, '_blank')
    }
  >
    <Box
      sx={{
        minWidth: 32,
        height: 32,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: rank <= 3 ? '#00DE90' : '#f5f5f5',
        color: rank <= 3 ? 'white' : '#666',
        fontWeight: 'bold',
        mr: 2,
      }}
    >
      {rank}
    </Box>
    <Avatar
      sx={{
        mr: 2,
        width: 48,
        height: 48,
        borderRadius: 2,
      }}
    >
      <ImageLoader
        imagePath={community.uploadFileNames[0]}
        alt={community.title}
        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        type="community"
      />
    </Avatar>
    <ListItemText
      primary={
        <Typography sx={{ fontWeight: 500, color: '#2c3e50' }}>
          {community.title}
        </Typography>
      }
      secondary={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <Avatar src={community.shopImage} sx={{ width: 20, height: 20 }} />
          <Typography
            component="span"
            sx={{ color: '#666', fontSize: '0.875rem' }}
          >
            {community.nickName}
          </Typography>
          <Typography
            component="span"
            sx={{ color: '#666', fontSize: '0.875rem' }}
          >
            •
          </Typography>
          <Typography
            component="span"
            sx={{ color: '#666', fontSize: '0.875rem' }}
          >
            {new Date(community.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
      }
    />
  </ListItem>
);

const HomePage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);

  const { email, checkLoginAndNavigate, handleApiError } = useCustomLogin();

  useEffect(() => {
    // 로그인 상태 확인 함수
    const checkLoginAndFetchData = async () => {
      // 로그인 체크
      if (!checkLoginAndNavigate('/')) {
        return;
      }

      try {
        const response = await getDashboardData();
        console.log('getDashboardData response', response);
        setDashboardData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        handleApiError(error);
      }
    };

    checkLoginAndFetchData();

    // 의존성 배열에서 함수 제거
  }, []); // 빈 의존성 배열 - 컴포넌트 마운트 시에만 실행

  if (!dashboardData) return null;

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: '#f5f5f5',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant="h5" sx={{ color: '#333', fontWeight: 'bold' }}>
          관리자 대시보드
        </Typography>
        <Box
          component="button"
          onClick={() => setOpen(true)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: '#00DE90',
            color: 'white',
            border: 'none',
            borderRadius: 2,
            px: 2.5,
            py: 1.2,
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(0, 222, 144, 0.2)',
            '&:hover': {
              bgcolor: '#00BA78',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(0, 222, 144, 0.3)',
            },
          }}
        >
          <Typography sx={{ fontSize: '0.95rem' }}>AI 생성 리포트</Typography>
        </Box>
      </Box>

      <ReportGenerator dashboardData={dashboardData} />

      {dashboardData.sellerNotApprovedRequestCount > 0 && (
        <NotificationCard
          count={dashboardData.sellerNotApprovedRequestCount}
          onClick={() => navigate('/seller')}
        />
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="매출"
            value={`₩${Number(dashboardData.todayRevenue).toLocaleString()}`}
            secondValue={`₩${Number(
              dashboardData.monthlyRevenue,
            ).toLocaleString()}`}
            description="오늘 / 최근30일"
            onClick={() => navigate('/order')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="총 주문"
            value={Number(dashboardData.totalOrderCount).toLocaleString()}
            onClick={() => navigate('/order')}
            description="최근 30일"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="신규 가입"
            value={Number(dashboardData.newMemberCount).toLocaleString()}
            secondValue={Number(dashboardData.newSellerCount).toLocaleString()}
            description="회원 / 셀러"
            onClick={() => navigate('/member')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="총 상품 / 커뮤니티글"
            value={Number(dashboardData.totalProductCount).toLocaleString()}
            secondValue={Number(
              dashboardData.totalCommunityCount,
            ).toLocaleString()}
            onClick={() => navigate('/product')}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%',
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    minHeight: '48px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                  },
                  '& .Mui-selected': {
                    color: '#00DE90 !important',
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#00DE90',
                  },
                }}
              >
                <Tab label="인기 상품 Top 10" />
                <Tab label="인기 커뮤니티 Top 10" />
              </Tabs>
            </Box>

            <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
              <Typography
                component="span"
                sx={{
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.75rem',
                  bgcolor: 'rgba(0, 222, 144, 0.08)',
                  color: '#00BA78',
                  borderRadius: 1,
                  border: '1px solid rgba(0, 222, 144, 0.2)',
                  mb: 2,
                  display: 'inline-block',
                }}
              >
                리뷰 평점 + 리뷰수 + 좋아요 + 구매율 기준
              </Typography>
              <List sx={{ height: 420, overflow: 'auto', px: 1, mt: 2 }}>
                {dashboardData.top10Products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    rank={index + 1}
                  />
                ))}
              </List>
            </Box>

            <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
              <Typography
                component="span"
                sx={{
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.75rem',
                  bgcolor: 'rgba(0, 222, 144, 0.08)',
                  color: '#00BA78',
                  borderRadius: 1,
                  border: '1px solid rgba(0, 222, 144, 0.2)',
                  mb: 2,
                  display: 'inline-block',
                }}
              >
                댓글 + 조회수 기준
              </Typography>
              <List sx={{ height: 420, overflow: 'auto', px: 1, mt: 2 }}>
                {dashboardData.top10Communities.map((community, index) => (
                  <CommunityCard
                    key={community.id}
                    community={community}
                    rank={index + 1}
                  />
                ))}
              </List>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: '#2c3e50' }}
              >
                Top 5 Sellers
              </Typography>
              <Typography
                component="span"
                sx={{
                  ml: 2,
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.75rem',
                  bgcolor: 'rgba(0, 222, 144, 0.08)',
                  color: '#00BA78',
                  borderRadius: 1,
                  border: '1px solid rgba(0, 222, 144, 0.2)',
                }}
              >
                판매량 + 판매액 기준
              </Typography>
            </Box>
            <List sx={{ height: 420, px: 1 }}>
              {[...Array(5)].map((_, index) => (
                <UserCard
                  key={dashboardData.top5Sellers[index]?.email || index}
                  user={dashboardData.top5Sellers[index]}
                  rank={index + 1}
                  isSeller={true}
                />
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: '#2c3e50' }}
              >
                Top 5 Consumers
              </Typography>
              <Typography
                component="span"
                sx={{
                  ml: 2,
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.75rem',
                  bgcolor: 'rgba(0, 222, 144, 0.08)',
                  color: '#00BA78',
                  borderRadius: 1,
                  border: '1px solid rgba(0, 222, 144, 0.2)',
                }}
              >
                구매 + 리뷰 수 기준
              </Typography>
            </Box>
            <List sx={{ height: 420, px: 1 }}>
              {[...Array(5)].map((_, index) => (
                <UserCard
                  key={dashboardData.top5GoodConsumers[index]?.email || index}
                  user={dashboardData.top5GoodConsumers[index]}
                  rank={index + 1}
                  isSeller={false}
                />
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
