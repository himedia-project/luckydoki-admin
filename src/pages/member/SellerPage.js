import React, { useState, useEffect } from 'react';
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
import { API_SERVER_HOST } from '../../config/apiConfig';

const SellerPage = () => {
  const [sellers, setSellers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

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
        setAlertOpen(true);
        setSelectedSeller(null);
        // 승인 후 즉시 목록 새로고침
        fetchSellers();
      } catch (error) {
        console.error('승인 처리 중 오류 발생:', error);
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
          <Typography
            variant="h5"
            sx={{ color: '#1A1A1A', fontWeight: 'bold' }}
          >
            셀러 요청 관리
          </Typography>
          <Button
            variant="contained"
            onClick={handleApprove}
            disabled={!selectedSeller || selectedSeller.approved === 'Y'}
            sx={{
              bgcolor: '#00DE90',
              '&:hover': { bgcolor: '#00C580' },
              '&.Mui-disabled': { bgcolor: '#B3F4DC' },
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
                  설명
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
                      <img
                        src={`${API_SERVER_HOST}/api/image/view/${seller.shopImage}`}
                        alt="매장 이미지"
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                      />
                    </TableCell>
                    <TableCell align="center">{seller.introduction}</TableCell>
                    <TableCell align="center">{seller.requestAt}</TableCell>
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
          fetchSellers(); // 승인 후 목록 새로고침
        }}
        title="승인 완료"
        message="요청한 셀러승인요청을 완료하였습니다"
        isSuccess={true}
      />
    </div>
  );
};

export default SellerPage;
