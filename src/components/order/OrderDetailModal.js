import React from 'react';
import { Modal, Box, Typography, Grid, Paper, IconButton } from '@mui/material';
import { API_SERVER_HOST } from '../../config/apiConfig';
import CloseIcon from '@mui/icons-material/Close';

const OrderDetailModal = ({ open, onClose, order }) => {
  if (!order) return null;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="order-detail-modal">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            주문 상세 정보
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'grey.500',
              '&:hover': {
                color: 'grey.700',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              주문 코드
            </Typography>
            <Typography variant="body1">{order.orderCode}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              주문자 이메일
            </Typography>
            <Typography variant="body1">{order.email}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              주문 일시
            </Typography>
            <Typography variant="body1">{order.orderDate}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              주문 상태
            </Typography>
            <Box
              component="span"
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: 1,
                display: 'inline-block',
                mt: 0.5,
                ...(order.orderStatus === 'ORDER'
                  ? {
                      color: '#00875A',
                      bgcolor: '#E6F4ED',
                    }
                  : {
                      color: '#B42318',
                      bgcolor: '#FEE4E2',
                    }),
              }}
            >
              {order.orderStatus === 'ORDER' ? '주문완료' : '주문취소'}
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          주문 상품 목록
        </Typography>

        {order.orderItems.map((item) => (
          <Paper
            key={item.productId}
            sx={{ p: 2, mb: 2, border: '1px solid #E5E5E5' }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={2}>
                <img
                  src={`${API_SERVER_HOST}/api/image/view/${item.image}`}
                  alt={item.productName}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 8,
                  }}
                />
              </Grid>
              <Grid item xs={10}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {item.productName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.orderPrice.toLocaleString()}원 × {item.count}개
                </Typography>
                <Typography variant="body1" sx={{ color: '#00875A', mt: 1 }}>
                  합계: {(item.orderPrice * item.count).toLocaleString()}원
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            총 주문금액
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: '#00875A', fontWeight: 'bold' }}
          >
            {order.totalPrice.toLocaleString()}원
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default OrderDetailModal;
