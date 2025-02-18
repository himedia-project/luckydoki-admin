import React from 'react';
import { Modal, Box, Typography, Grid, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageLoader from '../image/ImageLoader';

const EventDetailModal = ({ open, onClose, event }) => {
  if (!event) return null;

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="event-detail-modal">
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
            이벤트 상세 정보
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
          <Grid item xs={12}>
            {event.image && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <ImageLoader
                  imagePath={event.image}
                  alt={event.title}
                  sx={{
                    width: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    borderRadius: 2,
                  }}
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              이벤트 ID
            </Typography>
            <Typography variant="body1">{event.id}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              이벤트명
            </Typography>
            <Typography variant="body1">{event.title}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              시작일
            </Typography>
            <Typography variant="body1">{event.startAt}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              종료일
            </Typography>
            <Typography variant="body1">{event.endAt}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              이벤트 내용
            </Typography>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: 'pre-line',
                bgcolor: '#F8FFF8',
                p: 2,
                borderRadius: 1,
                mt: 1,
              }}
            >
              {event.content}
            </Typography>
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          이벤트 상품 목록
        </Typography>

        {event.productList.map((product) => (
          <Paper
            key={product.id}
            sx={{ p: 2, mb: 2, border: '1px solid #E5E5E5' }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={2}>
                {product.uploadFileNames && product.uploadFileNames[0] && (
                  <ImageLoader
                    imagePath={product.uploadFileNames[0]}
                    alt={product.name}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 1,
                      objectFit: 'cover',
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={10}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.categoryName}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  {product.discountRate > 0 && (
                    <Typography
                      variant="body1"
                      sx={{ color: '#FF6B6B', fontWeight: 'bold' }}
                    >
                      {product.discountRate}%
                    </Typography>
                  )}
                  <Typography
                    variant="body1"
                    sx={{ color: '#00875A', fontWeight: 'bold' }}
                  >
                    {product.discountPrice.toLocaleString()}원
                  </Typography>
                  {product.discountRate > 0 && (
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        textDecoration: 'line-through',
                      }}
                    >
                      {product.price.toLocaleString()}원
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
    </Modal>
  );
};

export default EventDetailModal;
