import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const AlertModal = ({
  open,
  onClose,
  title,
  message,
  isSuccess,
  onConfirm,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 222, 144, 0.25)',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: isSuccess ? '#00DE90' : '#B3F4DC',
          color: '#004D31',
          fontWeight: 'bold',
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Typography color="#004D31">{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onConfirm || onClose}
          sx={{
            bgcolor: '#00DE90',
            color: '#004D31',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: '#00C580',
            },
          }}
        >
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertModal;
