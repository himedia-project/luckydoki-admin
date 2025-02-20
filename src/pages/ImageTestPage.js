import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import ImageLoader from '../components/image/ImageLoader';
import { API_SERVER_HOST } from '../config/apiConfig';
import axios from 'axios';

const ImageTestPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImagePath, setUploadedImagePath] = useState(
    'f9769f7c-db03-4576-9e1b-45802e730e06-original.png',
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_SERVER_HOST}/api/image/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setUploadedImagePath(response.data);
      setError('');
    } catch (error) {
      setError('이미지 업로드 중 오류가 발생했습니다.');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          이미지 테스트
        </Typography>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            이미지 업로드
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              component="label"
              sx={{
                bgcolor: '#00DE90',
                '&:hover': { bgcolor: '#00BA78' },
              }}
            >
              파일 선택
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileSelect}
              />
            </Button>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              sx={{
                bgcolor: '#00DE90',
                '&:hover': { bgcolor: '#00BA78' },
              }}
            >
              업로드
            </Button>
          </Box>
          {selectedFile && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              선택된 파일: {selectedFile.name}
            </Typography>
          )}
          {loading && <CircularProgress size={24} sx={{ ml: 1 }} />}
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            이미지 표시
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              bgcolor: '#f5f5f5',
              p: 2,
              borderRadius: 1,
            }}
          >
            <ImageLoader
              imagePath={uploadedImagePath}
              alt="테스트 이미지"
              sx={{
                width: 300,
                height: 'auto',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ImageTestPage;
