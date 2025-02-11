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

const SellerPage = () => {
  const [sellers, setSellers] = useState([
    // 임시 데이터
    {
      id: 1,
      email: 'seller@test.com',
      shopImage: 'https://picsum.photos/200/300.jpg',
      description: '신선한 과일을 판매합니다.',
      requestAt: '2024-03-20 14:30:00',
      approved: 'N',
    },
  ]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);

  const handleCheckboxClick = (seller) => {
    setSelectedSeller(selectedSeller?.id === seller.id ? null : seller);
  };

  const handleApprove = async () => {
    if (selectedSeller) {
      try {
        await sellerApi.approve(selectedSeller.id);
        // 승인 후 데이터 업데이트
        setSellers(
          sellers.map((seller) =>
            seller.id === selectedSeller.id
              ? { ...seller, approved: 'Y' }
              : seller,
          ),
        );
        setAlertOpen(true);
        setSelectedSeller(null);
      } catch (error) {
        console.error('승인 처리 중 오류 발생:', error);
      }
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
                <TableCell padding="checkbox" />
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  이메일
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  샵 이미지
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  설명
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  요청일시
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  승인상태
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sellers.map((seller) => (
                <TableRow
                  key={seller.id}
                  hover
                  sx={{
                    '&:hover': { bgcolor: '#F8FFF8' },
                    bgcolor:
                      selectedSeller?.id === seller.id ? '#F0FFF0' : 'inherit',
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedSeller?.id === seller.id}
                      onChange={() => handleCheckboxClick(seller)}
                      disabled={seller.approved === 'Y'}
                    />
                  </TableCell>
                  <TableCell>{seller.id}</TableCell>
                  <TableCell>{seller.email}</TableCell>
                  <TableCell>
                    <img
                      src={seller.shopImage}
                      alt="매장 이미지"
                      style={{ width: 50, height: 50, objectFit: 'cover' }}
                    />
                  </TableCell>
                  <TableCell>{seller.description}</TableCell>
                  <TableCell>{seller.requestAt}</TableCell>
                  <TableCell>
                    {seller.approved === 'Y' ? '승인완료' : '대기중'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <AlertModal
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        title="승인 완료"
        message="요청한 셀러승인요청을 완료하였습니다"
        isSuccess={true}
      />
    </div>
  );
};

export default SellerPage;
