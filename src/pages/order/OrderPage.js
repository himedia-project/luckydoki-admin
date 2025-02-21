import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import { getList, getDetail } from '../../api/orderApi';
import PageComponent from '../../components/common/PageComponent';
import OrderDetailModal from '../../components/order/OrderDetailModal';

const ORDER_STATUS = {
  ORDER: '주문중',
  CONFIRM: '결제완료',
  CANCEL: '주문취소',
};

const getStatusStyle = (status) => {
  switch (status) {
    case 'ORDER':
      return {
        color: '#00875A',
        bgcolor: '#E6F4ED',
      };
    case 'CONFIRM':
      return {
        color: '#1E40AF', // 진한 파란색
        bgcolor: '#DBEAFE', // 연한 파란색
      };
    case 'CANCEL':
      return {
        color: '#B42318', // 진한 빨간색
        bgcolor: '#FEE4E2', // 연한 빨간색
      };
    default:
      return {
        color: '#666666',
        bgcolor: '#F5F5F5',
      };
  }
};

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchOrders = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
      searchKeyword: searchKeyword,
    };

    try {
      const response = await getList(params);
      setOrders(response.dtoList || []);
      setTotalPages(Math.ceil(response.totalCount / params.size));
    } catch (error) {
      console.error('주문 목록 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, searchKeyword]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  const handleOpenModal = async (orderId) => {
    try {
      const response = await getDetail(orderId);
      setSelectedOrder(response);
      setOpenModal(true);
    } catch (error) {
      console.error('주문 상세 정보 로딩 실패:', error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedOrder(null);
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
              주문 관리
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#666', mt: 1 }}>
              ✳️ 고객의 주문 내역을 관리하는 페이지입니다.
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
            placeholder="주문코드 또는 주문자 검색"
            value={searchKeyword}
            onChange={handleSearchKeywordChange}
            InputProps={{
              endAdornment: (
                <IconButton onClick={fetchOrders}>
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
                  주문코드
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  주문자
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  주문일시
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  주문상태
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  주문총금액
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  결제상태
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  결제일시
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
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      등록된 주문이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order.orderId}
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: '#F8FFF8',
                      },
                    }}
                  >
                    <TableCell align="center">{order.orderId}</TableCell>
                    <TableCell align="center">{order.orderCode}</TableCell>
                    <TableCell align="center">{order.email}</TableCell>
                    <TableCell align="center">{order.orderDate}</TableCell>
                    <TableCell align="center">
                      <Box
                        component="span"
                        sx={{
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.875rem',
                          fontWeight: 'medium',
                          ...getStatusStyle(order.orderStatus),
                        }}
                      >
                        {ORDER_STATUS[order.orderStatus] || '-'}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {order.totalPrice?.toLocaleString()}원
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        component="span"
                        sx={{
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.875rem',
                          fontWeight: 'medium',
                          ...(order.paymentStatus === 'COMPLETED'
                            ? {
                                color: '#00875A',
                                bgcolor: '#E6F4ED',
                              }
                            : {
                                color: '#B42318',
                                bgcolor: '#FEE4E2',
                              }),
                        }}
                      >
                        {order.paymentStatus ? order.paymentStatus : '-'}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {order.paymentDate || '-'}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        sx={{
                          color: '#00DE90',
                          '&:hover': {
                            bgcolor: 'rgba(0, 222, 144, 0.1)',
                          },
                        }}
                        onClick={() => handleOpenModal(order.orderId)}
                      >
                        <EditIcon />
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

        {/* Order Detail Modal */}
        <OrderDetailModal
          open={openModal}
          onClose={handleCloseModal}
          order={selectedOrder}
        />
      </Container>
    </div>
  );
};

export default OrderPage;
