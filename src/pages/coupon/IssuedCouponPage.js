import React, { useEffect, useState } from 'react';
import { getIssuedList } from '../../api/couponApi';
import {
  Container,
  Typography,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PageComponent from '../../components/common/PageComponent';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const IssuedCouponPage = () => {
  const navigate = useNavigate();
  const [issuedCoupons, setIssuedCoupons] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchIssuedCoupons = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
      searchKeyword: searchKeyword,
    };

    try {
      const response = await getIssuedList(params);
      setIssuedCoupons(response.dtoList || []);
      setTotalPages(response.totalPage);
    } catch (error) {
      console.error('발급된 쿠폰 목록 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchIssuedCoupons();
  }, [page, searchKeyword]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/coupon')}
                sx={{
                  color: '#666',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                쿠폰 목록
              </Button>
              <Typography
                variant="h5"
                sx={{ color: '#1A1A1A', fontWeight: 'bold' }}
              >
                발급된 쿠폰 목록
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ color: '#666', mt: 1 }}>
              ✳️ 회원들에게 발급된 쿠폰을 조회하는 페이지입니다.
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
            placeholder="쿠폰명 또는 이메일로 검색"
            value={searchKeyword}
            onChange={handleSearchKeywordChange}
            InputProps={{
              endAdornment: (
                <IconButton onClick={fetchIssuedCoupons}>
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
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  ID
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  쿠폰코드
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  쿠폰명
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  발급대상
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  유효기간
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  사용여부
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  사용일시
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  발급일시
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issuedCoupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      발급된 쿠폰이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                issuedCoupons.map((coupon) => (
                  <TableRow
                    key={coupon.id}
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: '#F8FFF8',
                      },
                    }}
                  >
                    <TableCell align="center">{coupon.id}</TableCell>
                    <TableCell align="center">{coupon.code}</TableCell>
                    <TableCell align="center">{coupon.name}</TableCell>
                    <TableCell align="center">{coupon.email}</TableCell>
                    <TableCell align="center">{coupon.validPeriod}일</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={coupon.used ? '사용완료' : '미사용'}
                        sx={{
                          backgroundColor: coupon.used ? '#FFEBEE' : '#E6FFF2',
                          color: coupon.used ? '#D32F2F' : '#00BA78',
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {coupon.usedDateTime || '-'}
                    </TableCell>
                    <TableCell align="center">{coupon.issuedAt}</TableCell>
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

export default IssuedCouponPage;
