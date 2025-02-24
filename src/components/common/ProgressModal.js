import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ProgressModal = ({ open, progress, status }) => {
  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          padding: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* 업로드 아이콘 */}
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 222, 144, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <CloudUploadIcon
              sx={{
                fontSize: 30,
                color: '#00DE90',
              }}
            />
          </Box>

          {/* 상태 메시지 */}
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              fontWeight: 600,
              color: '#2D3748',
            }}
          >
            엑셀 파일 업로드 중
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: '#718096',
              maxWidth: '80%',
            }}
          >
            {status}
          </Typography>

          {/* 프로그레스 표시 */}
          <Box sx={{ width: '100%', position: 'relative' }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(0, 222, 144, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#00DE90',
                  borderRadius: 4,
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                position: 'absolute',
                right: 0,
                top: -25,
                color: '#00DE90',
                fontWeight: 600,
              }}
            >
              {progress}%
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressModal;
