import React, { useEffect, useState } from 'react';
import { getList, remove } from '../../api/productApi';
import { API_SERVER_HOST } from '../../config/apiConfig';
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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from 'react-router-dom';

const ProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const fetchProducts = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
      searchKeyword: searchKeyword,
      categoryId: null,
    };

    try {
      const response = await getList(params);
      setProducts(response.dtoList || []);
      setTotalPages(response.totalPage || 0);
    } catch (error) {
      console.error('상품 목록 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchKeyword]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleDeleteClick = (product) => {
    console.log('handleDeleteClick product', product);
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await remove(selectedProduct.id);
      fetchProducts();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('상품 삭제 실패:', error);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedProducts(products.map((product) => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  return (
    <div style={{ backgroundColor: '#F5FFF5', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* 상단 헤더 영역 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ color: '#1A1A1A', fontWeight: 'bold' }}
          >
            상품 관리
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: '#00DE90',
                '&:hover': { bgcolor: '#00C580' },
                mr: 1,
                color: 'white',
              }}
              onClick={() => navigate('/product/register')}
            >
              상품 등록
            </Button>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{
                backgroundColor: '#217346',
                '&:hover': { backgroundColor: '#1a5c38' },
                mr: 1,
              }}
            >
              엑셀 업로드
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{
                backgroundColor: '#217346',
                '&:hover': { backgroundColor: '#1a5c38' },
                mr: 1,
              }}
            >
              엑셀 다운로드
            </Button>
          </Box>
        </Box>

        {/* 검색 영역 */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            border: '1px solid #E5E5E5',
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="상품명 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={fetchProducts}>
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
          sx={{
            borderRadius: 2,
            border: '1px solid #E5E5E5',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FFF8' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedProducts.length === products.length}
                    indeterminate={
                      selectedProducts.length > 0 &&
                      selectedProducts.length < products.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  카테고리
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  상품명
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  가격
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  할인가격
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  재고
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  이미지
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  등록일
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  수정일
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
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      등록된 상품이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: '#F8FFF8',
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        sx={{
                          '&.Mui-checked': {
                            color: '#00DE90',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.categoryName}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price?.toLocaleString()}원</TableCell>
                    <TableCell>
                      {product.discountPrice?.toLocaleString()}원
                    </TableCell>
                    <TableCell>{product.stockNumber}</TableCell>
                    <TableCell>
                      {product.uploadFileNames?.[0] && (
                        <Box
                          component="img"
                          src={`${API_SERVER_HOST}/api/admin/product/view/${product.uploadFileNames[0]}`}
                          sx={{
                            width: 40,
                            height: 40,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{product.createdAt}</TableCell>
                    <TableCell>{product.modifiedAt}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        sx={{
                          color: '#00DE90',
                          '&:hover': {
                            bgcolor: 'rgba(0, 222, 144, 0.1)',
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          color: '#FF6B6B',
                          '&:hover': {
                            bgcolor: 'rgba(255, 107, 107, 0.1)',
                          },
                        }}
                        onClick={() => handleDeleteClick(product)}
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
      </Container>
    </div>
  );
};

export default ProductPage;
