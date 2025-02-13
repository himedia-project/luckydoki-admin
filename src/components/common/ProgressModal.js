import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';

const ProgressModal = ({ open, progress }) => {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: '#666',
        }}
      >
        파일 업로드 중... 🚀
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3,
          }}
        >
          <CircularProgress
            variant="determinate"
            value={progress}
            size={100}
            thickness={4}
            sx={{
              color: '#6c5ce7',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              color: '#6c5ce7',
              fontWeight: 'bold',
              fontSize: '1.1rem',
            }}
          >
            {progress}%
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressModal;
