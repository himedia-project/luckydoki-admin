import React, { useEffect, useState } from 'react';
import { getList } from '../../api/couponApi';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import Checkbox from '@mui/material/Checkbox';
import PageComponent from '../../components/common/PageComponent';

const CouponPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedCoupons, setSelectedCoupons] = useState([]);

  const fetchCoupons = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
      searchKeyword: searchKeyword,
    };

    try {
      const response = await getList(params);
      setCoupons(response.dtoList || []);
      setTotalPages(response.totalPage);
    } catch (error) {
      console.error('쿠폰 목록 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [page, searchKeyword]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectCoupon = (couponId) => {
    setSelectedCoupons((prev) => {
      if (prev.includes(couponId)) {
        return prev.filter((id) => id !== couponId);
      } else {
        return [...prev, couponId];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedCoupons(coupons.map((coupon) => coupon.id));
    } else {
      setSelectedCoupons([]);
    }
  };

  const handleSearchKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  return (
    <div style={{ backgroundColor: '#F5FFF5', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* 상단 헤더 영역 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography
              variant="h5"
              sx={{ color: '#1A1A1A', fontWeight: 'bold' }}
            >
              쿠폰 관리
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#666', mt: 1 }}>
              ✳️ 발행된 쿠폰을 관리하는 페이지입니다.
            </Typography>
          </Box>
        </Box>

        {/* 검색 영역 */}
        <Paper
          sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #E5E5E5' }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="쿠폰명 검색"
            value={searchKeyword}
            onChange={handleSearchKeywordChange}
            InputProps={{
              endAdornment: (
                <IconButton onClick={fetchCoupons}>
                  <SearchIcon sx={{ color: '#00DE90' }} />
                </IconButton>
              ),
            }}
            sx={{
              maxWidth: 400,
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#00DE90',
                },
              },
            }}
          />
        </Paper>

        {/* 테이블 영역 */}
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, border: '1px solid #E5E5E5' }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FFF8' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCoupons.length === coupons.length}
                    indeterminate={
                      selectedCoupons.length > 0 &&
                      selectedCoupons.length < coupons.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  쿠폰 코드
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  쿠폰명
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  설명
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  시작일
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  종료일
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  상태
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  관리
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      등록된 쿠폰이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                coupons.map((coupon) => (
                  <TableRow
                    key={coupon.id}
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: '#F8FFF8',
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCoupons.includes(coupon.id)}
                        onChange={() => handleSelectCoupon(coupon.id)}
                        sx={{
                          '&.Mui-checked': {
                            color: '#00DE90',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>{coupon.id}</TableCell>
                    <TableCell>{coupon.code}</TableCell>
                    <TableCell>{coupon.name}</TableCell>
                    <TableCell>{coupon.content}</TableCell>
                    <TableCell>{coupon.startDate}</TableCell>
                    <TableCell>{coupon.endDate}</TableCell>
                    <TableCell>{coupon.status}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        sx={{
                          color: '#00DE90',
                          '&:hover': { bgcolor: 'rgba(0, 222, 144, 0.1)' },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          color: '#FF6B6B',
                          '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
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
    </div>
  );
};

export default CouponPage;
