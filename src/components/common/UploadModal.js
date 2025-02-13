import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadModal = ({ open, onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      onUpload(file);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(33, 115, 70, 0.25)',
        },
      }}
    >
      <DialogTitle
        sx={{ bgcolor: '#217346', color: '#FFFFFF', fontWeight: 'bold' }}
      >
        엑셀 파일 업로드
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            width: 400,
            height: 200,
            border: '2px dashed',
            borderColor: dragActive ? '#217346' : '#85C77E',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            m: 2,
            cursor: 'pointer',
            bgcolor: dragActive ? '#E6F3EA' : 'white',
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: '#217346', mb: 2 }} />
          <Typography color="#2A0934">
            엑셀 파일을 드래그하여 업로드하세요
          </Typography>
          <Typography variant="body2" color="text.secondary">
            (.xlsx 파일만 가능)
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            color: '#217346',
            '&:hover': {
              backgroundColor: '#E6F3EA',
            },
          }}
        >
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadModal;
