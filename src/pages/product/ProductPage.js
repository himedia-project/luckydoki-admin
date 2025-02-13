import React, { useEffect, useState } from 'react';
import { getList, remove, changeIsNew, changeBest } from '../../api/productApi';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DownloadIcon from '@mui/icons-material/Download';
import Checkbox from '@mui/material/Checkbox';
import PageComponent from '../../components/common/PageComponent';
import { registerProductExcel, downloadProductExcel } from '../../api/excelApi';
import AlertModal from '../../components/common/AlertModal';
import UploadModal from '../../components/common/UploadModal';
import ProgressModal from '../../components/common/ProgressModal';

const initState = {
  dtoList: [], // product 목록
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  prevPage: 0,
  nextPage: 0,
  next: false,
  totalCount: 0,
  current: 0,
};

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 수

  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

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
      const totalPagesCount = Math.ceil(response.totalCount / params.size);
      setTotalPages(totalPagesCount);
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

  const handleSearchKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  // 엑셀 업로드 핸들러
  const handleFileUpload = async (file) => {
    setShowProgressModal(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      await registerProductExcel(formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(progress);
        },
      });

      setShowUploadModal(false);
      await fetchProducts(); // 목록 새로고침
      setAlertMessage('엑셀 업로드가 완료되었습니다.');
      setShowAlert(true);
    } catch (error) {
      console.error('Excel upload failed:', error);
      setAlertMessage('엑셀 업로드 중 오류가 발생했습니다.');
      setShowAlert(true);
    } finally {
      setShowProgressModal(false);
    }
  };

  // 엑셀 다운로드 핸들러
  const handleDownload = async () => {
    if (!selectedProducts.length) {
      setAlertMessage('상품을 먼저 선택해주세요.');
      setShowAlert(true);
      return;
    }

    setShowProgressModal(true);
    setUploadProgress(0);

    try {
      const response = await downloadProductExcel(selectedProducts, {
        onDownloadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(progress);
        },
      });
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'products.xlsx';

      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="(.+)"/);
        if (matches && matches[1]) {
          filename = decodeURIComponent(matches[1]);
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      setAlertMessage('엑셀 다운로드가 완료되었습니다.');
      setShowAlert(true);
    } catch (error) {
      console.error('Excel download failed:', error);
      setAlertMessage('다운로드 중 오류가 발생했습니다.');
      setShowAlert(true);
    } finally {
      setShowProgressModal(false);
    }
  };

  // Add new handlers for isNew and Best status changes
  const handleNewStatusChange = async () => {
    if (!selectedProducts.length) {
      setAlertMessage('상품을 먼저 선택해주세요.');
      setShowAlert(true);
      return;
    }

    try {
      await changeIsNew(selectedProducts);
      setAlertMessage('최신상품 상태가 변경되었습니다.');
      setShowAlert(true);
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('최신상품 상태 변경 실패:', error);
      setAlertMessage('상태 변경 중 오류가 발생했습니다.');
      setShowAlert(true);
    }
  };

  const handleBestStatusChange = async () => {
    if (!selectedProducts.length) {
      setAlertMessage('상품을 먼저 선택해주세요.');
      setShowAlert(true);
      return;
    }

    try {
      await changeBest(selectedProducts);
      setAlertMessage('인기상품 상태가 변경되었습니다.');
      setShowAlert(true);
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('인기상품 상태 변경 실패:', error);
      setAlertMessage('상태 변경 중 오류가 발생했습니다.');
      setShowAlert(true);
    }
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
              상품 관리
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#666', mt: 1 }}>
              ✳️ 셀러가 등록한 상품을 관리하는 페이지입니다.
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              onClick={handleNewStatusChange}
              sx={{
                backgroundColor: '#4CAF50',
                '&:hover': { backgroundColor: '#388E3C' },
                mr: 1,
              }}
            >
              최신상품 변경
            </Button>
            <Button
              variant="contained"
              onClick={handleBestStatusChange}
              sx={{
                backgroundColor: '#FFA000',
                '&:hover': { backgroundColor: '#F57C00' },
                mr: 1,
              }}
            >
              인기상품 변경
            </Button>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={() => setShowUploadModal(true)}
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
              onClick={handleDownload}
              sx={{
                backgroundColor: '#217346',
                '&:hover': { backgroundColor: '#1a5c38' },
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
            onChange={handleSearchKeywordChange}
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
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: 10,
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: 5,
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: 5,
              '&:hover': {
                background: '#555',
              },
            },
          }}
        >
          <Table sx={{ minWidth: 2000 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FFF8' }}>
                <TableCell padding="checkbox" sx={{ minWidth: 50 }}>
                  <Checkbox
                    checked={selectedProducts.length === products.length}
                    indeterminate={
                      selectedProducts.length > 0 &&
                      selectedProducts.length < products.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ minWidth: 80, fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  ID
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ minWidth: 150, fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  카테고리
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ minWidth: 180, fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  샵이름
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ minWidth: 120, fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  이미지
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ minWidth: 250, fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  상품명
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ minWidth: 100, fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  최신여부
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ minWidth: 100, fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  인기여부
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ minWidth: 120, fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  이벤트여부
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ minWidth: 120, fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  가격
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ minWidth: 120, fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  할인가격
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ minWidth: 100, fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  재고
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ minWidth: 180, fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  등록일
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ minWidth: 180, fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  수정일
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ minWidth: 120, fontWeight: 'bold', color: '#1A1A1A' }}
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
                    <TableCell align="center">{product.id}</TableCell>
                    <TableCell align="center">{product.categoryName}</TableCell>
                    <TableCell align="center">{product.shopName}</TableCell>
                    <TableCell align="center">
                      {product.uploadFileNames?.[0] && (
                        <Box
                          component="img"
                          src={`${API_SERVER_HOST}/api/image/view/${product.uploadFileNames[0]}`}
                          sx={{
                            width: 40,
                            height: 40,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">{product.name}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: product.isNew === 'Y' ? '#4CAF50' : '#666',
                        fontWeight: product.isNew === 'Y' ? 'bold' : 'normal',
                      }}
                    >
                      {product.isNew}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: product.best === 'Y' ? '#FFA000' : '#666',
                        fontWeight: product.best === 'Y' ? 'bold' : 'normal',
                      }}
                    >
                      {product.best}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color: product.event === 'Y' ? '#FF6B6B' : '#666',
                        fontWeight: product.event === 'Y' ? 'bold' : 'normal',
                      }}
                    >
                      {product.event}
                    </TableCell>
                    <TableCell align="center">
                      {product.price?.toLocaleString()}원
                    </TableCell>
                    <TableCell align="center">
                      {product.discountPrice?.toLocaleString()}원
                    </TableCell>
                    <TableCell align="center">{product.stockNumber}</TableCell>

                    <TableCell align="center">{product.createdAt}</TableCell>
                    <TableCell align="center">{product.modifiedAt}</TableCell>
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

        <PageComponent
          page={page}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </Container>

      {/* 모달 컴포넌트들 추가 */}
      <AlertModal
        open={showAlert}
        onClose={() => setShowAlert(false)}
        title="알림"
        message={alertMessage}
        isSuccess={alertMessage.includes('완료')}
        onConfirm={() => setShowAlert(false)}
      />
      <UploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleFileUpload}
      />
      <ProgressModal open={showProgressModal} progress={uploadProgress} />
    </div>
  );
};

export default ProductPage;
