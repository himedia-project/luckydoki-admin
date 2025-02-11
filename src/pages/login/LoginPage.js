import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { loginPost } from '../../api/loginApi';
import AlertModal from '../../components/common/AlertModal';
import { login } from '../../app/redux/loginSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // loginPost API 호출
      const result = await loginPost(email, password);

      // 로그인 성공 시 Redux store 업데이트
      dispatch(
        login({
          email: result.email,
          roles: result.roles,
          accessToken: result.accessToken,
        }),
      );

      // 성공 처리
      setIsSuccess(true);
      setAlertMessage('로그인이 성공하였습니다');
      setOpenAlert(true);
      setEmail('');
      setPassword('');
    } catch (error) {
      // 에러 처리
      setIsSuccess(false);
      setAlertMessage(error.response.data.errMsg);
      setOpenAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    if (isSuccess) {
      navigate('/');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#fff5f9',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ mb: 3, fontWeight: 'bold' }}
          >
            로그인
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="이메일 주소"
              margin="normal"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#00DE90',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#00DE90',
                },
              }}
            />

            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              margin="normal"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#00DE90',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#00DE90',
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                bgcolor: '#00DE90',
                '&:hover': {
                  bgcolor: '#00c580',
                },
              }}
            >
              로그인
            </Button>
          </form>
        </Paper>
      </Container>
      <AlertModal
        open={openAlert}
        onClose={handleCloseAlert}
        title={isSuccess ? '로그인 성공' : '로그인 실패'}
        message={alertMessage}
        isSuccess={isSuccess}
      />
    </Box>
  );
};

export default LoginPage;
