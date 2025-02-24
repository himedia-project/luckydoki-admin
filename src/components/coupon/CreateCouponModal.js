import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { create } from '../../api/couponApi';
import AlertModal from '../common/AlertModal';

const CreateCouponModal = ({ open, onClose, onSuccess }) => {
  const [couponData, setCouponData] = useState({
    name: '',
    content: '',
    discountPrice: '',
    startDate: '',
    endDate: '',
    minimumUsageAmount: '',
  });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await create(couponData);
      setIsSuccess(true);
      setAlertMessage('등록이 완료되었습니다');
      setAlertOpen(true);
      onSuccess();
      setCouponData({
        name: '',
        content: '',
        discountPrice: '',
        startDate: '',
        endDate: '',
        minimumUsageAmount: '',
      });
    } catch (error) {
      setIsSuccess(false);
      setAlertMessage('쿠폰 등록에 실패했습니다');
      setAlertOpen(true);
      console.error('쿠폰 등록 실패:', error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
          쿠폰 등록
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              name="name"
              label="쿠폰명"
              value={couponData.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="content"
              label="설명"
              value={couponData.content}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              required
            />
            <TextField
              name="discountPrice"
              label="할인 금액"
              type="number"
              value={couponData.discountPrice}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                inputProps: { min: 0 },
              }}
            />
            <TextField
              name="minimumUsageAmount"
              label="최소주문금액"
              type="number"
              value={couponData.minimumUsageAmount}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                inputProps: { min: 0 },
              }}
            />
            <TextField
              name="startDate"
              label="시작일"
              type="date"
              value={couponData.startDate}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="endDate"
              label="종료일"
              type="date"
              value={couponData.endDate}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: '#666' }}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              bgcolor: '#00DE90',
              '&:hover': { bgcolor: '#00BA78' },
            }}
          >
            등록
          </Button>
        </DialogActions>
      </Dialog>

      <AlertModal
        open={alertOpen}
        onClose={() => {
          setAlertOpen(false);
          if (isSuccess) onClose();
        }}
        message={alertMessage}
      />
    </>
  );
};

export default CreateCouponModal;
