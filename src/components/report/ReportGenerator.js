import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { generateReport } from '../../api/reportApi';

const ReportGenerator = ({ dashboardData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await generateReport({
        startDate: new Date(new Date().setDate(1)), // 이번달 1일
        endDate: new Date(),
        metrics: dashboardData,
      });

      // PDF 다운로드 처리
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `monthly-report-${new Date()
        .toISOString()
        .slice(0, 7)}.pdf`;
      link.click();

      setSuccess(true);
    } catch (err) {
      setError('리포트 생성 중 오류가 발생했습니다.');
      console.error('Report generation failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleGenerateReport}
        disabled={loading}
        sx={{
          bgcolor: '#00DE90',
          '&:hover': { bgcolor: '#00BA78' },
          position: 'absolute',
          right: 32,
          top: 32,
          px: 3,
          py: 1,
          fontSize: '0.9rem',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0, 222, 144, 0.15)',
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: 'white' }} />
        ) : (
          'AI ✨ 리포트 생성'
        )}
      </Button>

      <Dialog
        open={!!error || success}
        onClose={() => {
          setError(null);
          setSuccess(false);
        }}
      >
        <DialogTitle>{error ? '오류 발생' : '리포트 생성 완료'}</DialogTitle>
        <DialogContent>
          {error || '리포트가 성공적으로 생성되었습니다.'}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setError(null);
              setSuccess(false);
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReportGenerator;
