import React from 'react';
import { Modal, Box, Typography, Grid, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageLoader from '../image/ImageLoader';

// 상수 추가
const ORDER_STATUS = {
  ORDER: '주문중',
  CONFIRM: '결제완료',
  CANCEL: '주문취소',
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'ORDER':
      return {
        color: '#00875A',
        bgcolor: '#E6F4ED',
      };
    case 'CONFIRM':
      return {
        color: '#1E40AF',
        bgcolor: '#DBEAFE',
      };
    case 'CANCEL':
      return {
        color: '#B42318',
        bgcolor: '#FEE4E2',
      };
    default:
      return {
        color: '#666666',
        bgcolor: '#F5F5F5',
      };
  }
};

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
                ...getStatusStyle(order.orderStatus),
              }}
            >
              {ORDER_STATUS[order.orderStatus] || '-'}
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
                {item.image && (
                  <ImageLoader
                    imagePath={item.image}
                    alt={item.productName}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 8,
                      objectFit: 'cover',
                    }}
                  />
                )}
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
