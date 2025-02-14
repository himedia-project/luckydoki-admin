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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as shopApi from '../../api/shopApi';
import PageComponent from '../../components/common/PageComponent';
import { useNavigate } from 'react-router-dom';
import ImageLoader from '../../components/image/ImageLoader';

const ShopPage = () => {
  const [shops, setShops] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const fetchShops = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
      searchKeyword: searchKeyword,
    };

    try {
      const response = await shopApi.getShopList(params);
      setShops(response.dtoList || []);
      const totalPagesCount = Math.ceil(response.totalCount / params.size);
      setTotalPages(totalPagesCount);
    } catch (error) {
      console.error('샵 목록 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [page, searchKeyword]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div style={{ backgroundColor: '#F5FFF5', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography
              variant="h5"
              sx={{ color: '#1A1A1A', fontWeight: 'bold' }}
            >
              샵 목록
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#666', mt: 1 }}>
              ✳️ 등록된 샵을 관리하는 페이지입니다.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, height: 'fit-content' }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/seller')}
              sx={{
                color: '#00DE90',
                borderColor: '#00DE90',
                '&:hover': {
                  borderColor: '#00BA78',
                  backgroundColor: 'rgba(0, 222, 144, 0.1)',
                },
              }}
            >
              셀러 요청
            </Button>
          </Box>
        </Box>

        <Paper
          sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #E5E5E5' }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="샵 이름 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={fetchShops}>
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
                  이메일
                </TableCell>

                <TableCell
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                  align="center"
                >
                  설명
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shops.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      등록된 목록이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                shops.map((shop) => (
                  <TableRow
                    key={shop.id}
                    hover
                    sx={{
                      '&:hover': { bgcolor: '#F8FFF8' },
                    }}
                  >
                    <TableCell align="center">{shop.id}</TableCell>
                    <TableCell align="center">{shop.nickName}</TableCell>
                    <TableCell align="center">
                      {shop.image && (
                        <ImageLoader
                          imagePath={shop.image}
                          alt="매장 이미지"
                          sx={{
                            width: 50,
                            height: 50,
                            objectFit: 'cover',
                            borderRadius: '4px',
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">{shop.email}</TableCell>
                    <TableCell align="center">{shop.introduction}</TableCell>
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

export default ShopPage;
