import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Checkbox,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AlertModal from '../../components/common/AlertModal';
import * as sellerApi from '../../api/sellerApi';
import PageComponent from '../../components/common/PageComponent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageLoader from '../../components/image/ImageLoader';

const SellerPage = () => {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);

  const fetchSellers = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
      searchKeyword: searchKeyword,
    };

    try {
      const response = await sellerApi.getList(params);
      setSellers(response.dtoList || []);
      const totalPagesCount = Math.ceil(response.totalCount / params.size);
      setTotalPages(totalPagesCount);
    } catch (error) {
      console.error('셀러 목록 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, [page, searchKeyword]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleCheckboxClick = (seller) => {
    setSelectedSeller(selectedSeller?.id === seller.id ? null : seller);
  };

  const handleApprove = async () => {
    if (selectedSeller) {
      try {
        await sellerApi.approve(selectedSeller.id);
        setIsSuccess(true);
        setAlertMessage('요청한 셀러승인요청을 완료하였습니다');
        setAlertOpen(true);
        setSelectedSeller(null);
        fetchSellers();
      } catch (error) {
        console.error('승인 처리 중 오류 발생:', error);
        setIsSuccess(false);
        // JSON 문자열을 파싱하여 에러 메시지 추출
        try {
          // API에서 반환하는 에러 메시지를 직접 표시
          const errorMessage = error.response?.data.errMsg;
          setAlertMessage(errorMessage || '승인 처리 중 오류가 발생했습니다');
        } catch {
          setAlertMessage('승인 처리 중 오류가 발생했습니다');
        }
        setAlertOpen(true);
      }
    }
  };

  // 상태별 스타일 지정
  const getStatusStyle = (approved) => {
    if (approved === 'Y') {
      return {
        backgroundColor: '#E6FFF2',
        color: '#00BA78',
      };
    } else {
      return {
        backgroundColor: '#E3F2FD',
        color: '#1976D2',
      };
    }
  };

  return (
    <div style={{ backgroundColor: '#F5FFF5', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/shop')}
                sx={{
                  color: '#666',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                샵 목록
              </Button>
              <Typography
                variant="h5"
                sx={{ color: '#1A1A1A', fontWeight: 'bold' }}
              >
                셀러 요청 관리
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ color: '#666', mt: 1 }}>
              ✳️ 셀러 요청을 관리하는 페이지입니다.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={handleApprove}
            disabled={!selectedSeller || selectedSeller.approved === 'Y'}
            sx={{
              bgcolor: '#00DE90',
              '&:hover': { bgcolor: '#00C580' },
              '&.Mui-disabled': { bgcolor: '#B3F4DC' },
              height: '36px',
              px: 3,
            }}
          >
            승인
          </Button>
        </Box>

        <Paper
          sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #E5E5E5' }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="이메일 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <SearchIcon sx={{ color: '#00DE90' }} />
                </IconButton>
              ),
            }}
            sx={{
              maxWidth: 400,
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': { borderColor: '#00DE90' },
              },
            }}
          />
        </Paper>

        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, border: '1px solid #E5E5E5' }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FFF8' }}>
                <TableCell padding="checkbox" align="center" />
                <TableCell
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                  align="center"
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                  align="center"
                >
                  신청자
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                  align="center"
                >
                  샵이름
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                  align="center"
                >
                  샵 이미지
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                  align="center"
                >
                  소개글
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                  align="center"
                >
                  요청일시
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                  align="center"
                >
                  승인일시
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                  align="center"
                >
                  승인상태
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      등록된 목록이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sellers.map((seller) => (
                  <TableRow
                    key={seller.id}
                    hover
                    sx={{
                      '&:hover': { bgcolor: '#F8FFF8' },
                      bgcolor:
                        selectedSeller?.id === seller.id
                          ? '#F0FFF0'
                          : 'inherit',
                    }}
                  >
                    <TableCell padding="checkbox" align="center">
                      <Checkbox
                        checked={selectedSeller?.id === seller.id}
                        onChange={() => handleCheckboxClick(seller)}
                        disabled={seller.approved === 'Y'}
                      />
                    </TableCell>
                    <TableCell align="center">{seller.id}</TableCell>
                    <TableCell align="center">{seller.email}</TableCell>
                    <TableCell align="center">{seller.nickName}</TableCell>
                    <TableCell align="center">
                      <ImageLoader
                        imagePath={seller.shopImage}
                        alt="매장 이미지"
                        sx={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">{seller.introduction}</TableCell>
                    <TableCell align="center">{seller.requestAt}</TableCell>
                    <TableCell align="center">
                      {seller.approvedAt || '-'}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.875rem',
                          ...getStatusStyle(seller.approved),
                        }}
                      >
                        {seller.approved === 'Y' ? '승인완료' : '대기중'}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <PageComponent
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </Container>

      <AlertModal
        open={alertOpen}
        onClose={() => {
          setAlertOpen(false);
          if (isSuccess) {
            fetchSellers(); // 성공한 경우에만 목록 새로고침
          }
        }}
        title={isSuccess ? '승인 완료' : '승인 실패'}
        message={alertMessage}
        isSuccess={isSuccess}
      />
    </div>
  );
};

export default SellerPage;
