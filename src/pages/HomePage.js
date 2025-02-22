import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import ImageLoader from '../components/image/ImageLoader';
import { getDashboardData } from '../api/ashBoardApi';

const DashboardCard = ({ title, value }) => (
  <Paper
    sx={{
      p: 3,
      borderRadius: 2,
      bgcolor: 'white',
      boxShadow: '0 4px 20px rgba(0, 222, 144, 0.1)',
    }}
  >
    <Typography color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>
      {title}
    </Typography>
    <Typography
      variant="h4"
      sx={{
        color: '#00DE90',
        fontWeight: 'bold',
      }}
    >
      {value}
    </Typography>
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
        width: 48,
        height: 48,
        borderRadius: 2,
      }}
    >
      <ImageLoader
        imagePath={product.uploadFileNames[0]}
        alt={product.name}
        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </Avatar>
    <ListItemText
      primary={
        <Typography sx={{ fontWeight: 500, color: '#2c3e50' }}>
          {product.name}
        </Typography>
      }
      secondary={
        <Typography sx={{ color: '#666', fontSize: '0.875rem' }}>
          ₩{product.discountPrice.toLocaleString()} • 좋아요{' '}
          {product.reviewCount}개
        </Typography>
      }
    />
  </ListItem>
);

const UserCard = ({ user, rank }) => (
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

const HomePage = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData();
        console.log('getDashboardData response', response);
        setDashboardData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  if (!dashboardData) return null;

  return (
    <Box sx={{ p: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography
        variant="h5"
        sx={{ mb: 4, color: '#333', fontWeight: 'bold' }}
      >
        관리자 대시보드
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="총 주문"
            value={dashboardData.totalOrderCount.toLocaleString()}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="오늘의 매출"
            value={`₩${dashboardData.todayRevenue.toLocaleString()}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="신규 회원"
            value={dashboardData.newMemberCount.toLocaleString()}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="총 상품"
            value={dashboardData.totalProductCount.toLocaleString()}
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
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}
            >
              인기 상품 Top 10
            </Typography>
            <List sx={{ maxHeight: 400, overflow: 'auto', px: 1 }}>
              {dashboardData.top10Products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  rank={index + 1}
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
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}
            >
              Top 5 Sellers
            </Typography>
            <List sx={{ px: 1 }}>
              {[...Array(5)].map((_, index) => (
                <UserCard
                  key={dashboardData.top5Sellers[index]?.email || index}
                  user={dashboardData.top5Sellers[index]}
                  rank={index + 1}
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
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}
            >
              Top 5 Consumers
            </Typography>
            <List sx={{ px: 1 }}>
              {[...Array(5)].map((_, index) => (
                <UserCard
                  key={dashboardData.top5GoodConsumers[index]?.email || index}
                  user={dashboardData.top5GoodConsumers[index]}
                  rank={index + 1}
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
