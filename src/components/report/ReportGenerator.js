import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { generateReport } from '../../api/reportApi';
import LinearProgress from '@mui/material/LinearProgress';

const ReportGenerator = ({ dashboardData }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const handleOpenConfirm = () => {
    setShowConfirmModal(true);
  };

  const handleGenerateReport = async () => {
    setShowConfirmModal(false);
    setShowProgress(true);
    setProgress(0);
    setStatus('AI가 데이터를 수집하고 있어요');

    try {
      let progressInterval;
      const startProgress = (startValue, endValue, duration, currentStatus) => {
        let currentProgress = startValue;
        const step = (endValue - startValue) / (duration / 100);

        return new Promise((resolve) => {
          progressInterval = setInterval(() => {
            currentProgress += step;
            if (currentProgress >= endValue) {
              clearInterval(progressInterval);
              setProgress(endValue);
              setStatus(currentStatus);
              resolve();
            } else {
              setProgress(Math.round(currentProgress));
            }
          }, 100);
        });
      };

      await startProgress(0, 15, 2000, 'AI가 데이터를 수집하고 있어요');
      await startProgress(15, 30, 2000, 'AI가 데이터를 정리하고 있어요');
      await startProgress(30, 40, 2000, 'AI가 데이터를 분석하고 있어요');

      const progressPromise = startProgress(
        40,
        60,
        4000,
        'AI가 리포트를 생성하고 있어요',
      );
      const reportPromise = generateReport(dashboardData);

      const [response] = await Promise.all([reportPromise, progressPromise]);

      await startProgress(60, 75, 3000, 'AI가 데이터를 검증하고 있어요');
      await startProgress(75, 85, 2000, '리포트 문서를 만들고 있어요');

      // Content-Disposition 헤더에서 파일명 추출
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'report.pdf'; // 기본 파일명

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      // Blob 생성 및 다운로드
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename; // 서버에서 제공한 파일명 사용

      await startProgress(85, 95, 2000, '리포트 문서를 최종 점검하고 있어요');
      await startProgress(95, 100, 1500, '리포트가 준비되었습니다');

      link.click();
      window.URL.revokeObjectURL(url);

      setTimeout(() => {
        setShowProgress(false);
      }, 1500);
    } catch (error) {
      console.error('Report generation failed:', error);
      setStatus('리포트 생성 중 오류가 발생했습니다');
      setTimeout(() => {
        setShowProgress(false);
      }, 2000);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpenConfirm}
        startIcon={<DescriptionIcon />}
        sx={{
          bgcolor: '#00DE90',
          '&:hover': { bgcolor: '#00BA78' },
          position: 'absolute',
          right: 32,
          top: 32,
          px: 3,
          py: 1.5,
          fontSize: '0.9rem',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0, 222, 144, 0.15)',
        }}
      >
        AI 리포트 생성
      </Button>

      {/* 확인 모달 */}
      <Dialog
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            maxWidth: '400px',
          },
        }}
      >
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: 'rgba(0, 222, 144, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <AutoGraphIcon sx={{ fontSize: 30, color: '#00DE90' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{ mb: 2, color: '#2D3748', fontWeight: 600 }}
            >
              AI 리포트 생성
            </Typography>
            <Typography variant="body1" sx={{ color: '#718096', mb: 4 }}>
              이번달 현재까지의 리포트가 생성됩니다.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                onClick={() => setShowConfirmModal(false)}
                variant="outlined"
                sx={{
                  color: '#718096',
                  borderColor: '#718096',
                  '&:hover': {
                    borderColor: '#4A5568',
                    bgcolor: 'rgba(74, 85, 104, 0.05)',
                  },
                  borderRadius: 2,
                  px: 3,
                }}
              >
                취소
              </Button>
              <Button
                onClick={handleGenerateReport}
                variant="contained"
                sx={{
                  bgcolor: '#00DE90',
                  '&:hover': { bgcolor: '#00BA78' },
                  borderRadius: 2,
                  px: 3,
                }}
              >
                확인
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* 프로그레스 모달 */}
      <Dialog
        open={showProgress}
        PaperProps={{
          sx: {
            borderRadius: 3,
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            maxWidth: '400px',
          },
        }}
      >
        <DialogContent>
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: 'rgba(0, 222, 144, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <DescriptionIcon sx={{ fontSize: 30, color: '#00DE90' }} />
            </Box>
            <Typography
              variant="h6"
              sx={{ mb: 0.5, color: '#2D3748', fontWeight: 600 }}
            >
              리포트 생성중입니다
            </Typography>
            <Typography variant="body2" sx={{ color: '#718096', mb: 3 }}>
              {status}
            </Typography>
            <Box sx={{ position: 'relative', pt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'rgba(0, 222, 144, 0.1)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#00DE90',
                    borderRadius: 4,
                  },
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: -20,
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
    </>
  );
};

export default ReportGenerator;
