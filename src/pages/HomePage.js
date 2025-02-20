import { Box, Grid, Paper, Typography } from '@mui/material';
import React from 'react';

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

const HomePage = () => {
  return (
    <Box sx={{ p: 4, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          color: '#333',
          fontWeight: 'bold',
        }}
      >
        관리자 대시보드
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="총 주문" value="124" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="오늘의 매출" value="₩1,234,000" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="신규 회원" value="12" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="문의사항" value="5" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage;
