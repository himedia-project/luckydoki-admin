import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogContent,
  LinearProgress,
  Badge,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import React, { useEffect, useState, useRef } from 'react';
import { getChildList, getParentList } from '../../api/categoryApi';
import { downloadProductExcel, registerProductExcel } from '../../api/excelApi';
import {
  changeBest,
  changeIsNew,
  getList,
  remove,
  approveProduct,
  getNotApprovedList,
} from '../../api/productApi';
import { getShopOptionList } from '../../api/shopApi';
import AlertModal from '../../components/common/AlertModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import PageComponent from '../../components/common/PageComponent';
import ProgressModal from '../../components/common/ProgressModal';
import UploadModal from '../../components/common/UploadModal';
import ImageLoader from '../../components/image/ImageLoader';
import useDragScroll from '../../hooks/useDragScroll';

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

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [parentCategories, setParentCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState('');
  const [selectedSubId, setSelectedSubId] = useState('');
  const [selectedChildId, setSelectedChildId] = useState('');

  const [filters, setFilters] = useState({
    isNew: '',
    best: '',
    event: '',
    approvalStatus: '',
  });

  // Add new state for sort and size
  const [sortOrder, setSortOrder] = useState('desc');
  const [pageSize, setPageSize] = useState(10);

  // Add new state for shops and selected shop
  const [shops, setShops] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState('');

  const [totalCount, setTotalCount] = useState(0); // 추가: 총 상품 수를 저장할 state
  const [notApprovedCount, setNotApprovedCount] = useState(0);

  // 드래그 스크롤 관련 상태와 핸들러 추가
  const tableContainerRef = useRef(null);
  const { handleMouseDown, dragScrollStyles, isDragging } =
    useDragScroll(tableContainerRef);

  // 상태 추가
  const [progressStatus, setProgressStatus] = useState('');

  const fetchProducts = async () => {
    const params = {
      page: page,
      size: pageSize,
      sort: sortOrder,
      searchKeyword: searchKeyword,
      categoryId: selectedChildId || null,
      isNew: filters.isNew || null,
      best: filters.best || null,
      event: filters.event || null,
      shopId: selectedShopId || null,
      approvalStatus: filters.approvalStatus || null,
    };

    try {
      const response = await getList(params);
      setProducts(response.dtoList || []);
      setTotalCount(response.totalCount); // 추가: 총 상품 수 저장
      const totalPagesCount = Math.ceil(response.totalCount / params.size);
      setTotalPages(totalPagesCount);
    } catch (error) {
      console.error('상품 목록 로딩 실패:', error);
    }
  };

  // 승인 대기 상품 목록 조회 및 카운트 계산 함수
  const fetchNotApprovedCount = async () => {
    try {
      const response = await getNotApprovedList();
      setNotApprovedCount(response.length || 0); // 배열의 길이를 카운트로 사용
    } catch (error) {
      console.error('승인 대기 상품 목록 조회 실패:', error);
      setNotApprovedCount(0);
    }
  };

  useEffect(() => {
    loadParentCategories();
    loadShops();
    fetchProducts();
    fetchNotApprovedCount();
  }, []);

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
      setAlertMessage('상품이 성공적으로 삭제되었습니다.');
      setShowAlert(true);
      fetchProducts(); // 목록 새로고침
    } catch (error) {
      console.error('상품 삭제 실패:', error);
      // API에서 반환하는 에러 메시지를 직접 표시
      const errorMessage =
        error.response?.data?.errMsg || '상품 삭제 중 오류가 발생했습니다.';
      setAlertMessage(errorMessage);
      setShowAlert(true);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
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

  // Add handlers for sort and size changes
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
    setPage(1); // Reset to first page when changing sort
  };

  const handleSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1); // Reset to first page when changing size
  };

  // Update handleResetSearch to include new filters
  const handleResetSearch = () => {
    setSearchKeyword('');
    setSelectedShopId('');
    setSelectedParentId('');
    setSelectedSubId('');
    setSelectedChildId('');
    setSubCategories([]);
    setChildCategories([]);
    setFilters({
      isNew: '',
      best: '',
      event: '',
      approvalStatus: '',
    });
    setSortOrder('desc');
    setPageSize(10);
    setPage(1);
    setSelectedProducts([]);
    fetchProducts();
  };

  // 엑셀 업로드 핸들러
  const handleFileUpload = async (file) => {
    setShowProgressModal(true);
    setUploadProgress(0);
    setProgressStatus('파일 검증 중...'); // 새로운 상태 메시지

    try {
      const formData = new FormData();
      formData.append('file', file);

      // 단계별 진행률 설정
      const setProgressWithStatus = (progress, status) => {
        setUploadProgress(progress);
        setProgressStatus(status);
      };

      // 초기 파일 검증 단계 (0-20%)
      setProgressWithStatus(20, '파일 검증 완료, 데이터 처리 준비 중...');

      // 실제 파일 업로드 (20-50%)
      const response = await registerProductExcel(formData, {
        onUploadProgress: (progressEvent) => {
          const uploadProgress = Math.round(
            (progressEvent.loaded * 30) / progressEvent.total + 20,
          );
          setProgressWithStatus(uploadProgress, '데이터 서버로 전송 중...');
        },
      });

      // 서버 데이터 처리 시작 알림 (50-70%)
      setProgressWithStatus(70, '서버에서 데이터 처리 중...');

      // 완료 처리
      setProgressWithStatus(100, '업로드 완료!');

      setShowUploadModal(false);
      await fetchProducts();
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

  // 최상위 카테고리 로드
  const loadParentCategories = async () => {
    try {
      const data = await getParentList();
      setParentCategories(data);
    } catch (error) {
      console.error('최상위 카테고리 로드 실패:', error);
    }
  };

  // 서브 카테고리 로드
  const loadSubCategories = async (parentId) => {
    if (!parentId) {
      setSubCategories([]);
      setChildCategories([]);
      setSelectedSubId('');
      setSelectedChildId('');
      return;
    }
    try {
      const data = await getChildList(parentId);
      setSubCategories(data);
      // 2차 카테고리 중 lastType이 Y인 항목이 있다면 해당 카테고리를 검색에 사용
      const lastTypeCategory = data.find(
        (category) => category.lastType === 'Y',
      );
      if (lastTypeCategory) {
        setSelectedChildId(''); // 3차 카테고리 선택 초기화
        setChildCategories([]); // 3차 카테고리 목록 초기화
      }
      setSelectedSubId('');
    } catch (error) {
      console.error('서브 카테고리 로드 실패:', error);
    }
  };

  // 최하위 카테고리 로드
  const loadChildCategories = async (subId) => {
    if (!subId) {
      setChildCategories([]);
      setSelectedChildId('');
      return;
    }
    try {
      const data = await getChildList(subId);
      setChildCategories(data);
      setSelectedChildId('');
    } catch (error) {
      console.error('최하위 카테고리 로드 실패:', error);
    }
  };

  // 최상위 카테고리 선택 핸들러
  const handleParentCategoryChange = (event) => {
    const parentId = event.target.value;
    setSelectedParentId(parentId);
    setSelectedSubId('');
    setSelectedChildId('');
    loadSubCategories(parentId);
  };

  // 서브 카테고리 선택 핸들러
  const handleSubCategoryChange = (event) => {
    const subId = event.target.value;
    setSelectedSubId(subId);

    // 선택된 2차 카테고리가 lastType이 Y인지 확인
    const selectedCategory = subCategories.find(
      (cat) => cat.id === parseInt(subId),
    );
    if (selectedCategory?.lastType === 'Y') {
      setSelectedChildId(subId); // 검색용 categoryId를 2차 카테고리 ID로 설정
      setChildCategories([]); // 3차 카테고리 목록 초기화
    } else {
      setSelectedChildId(''); // 검색용 categoryId 초기화
      loadChildCategories(subId); // 3차 카테고리 로드
    }
  };

  // 최하위 카테고리 선택 핸들러
  const handleChildCategoryChange = (event) => {
    const childId = event.target.value;
    setSelectedChildId(childId);
  };

  // 필터 변경 핸들러 추가
  const handleFilterChange = (filterName) => (event) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: event.target.value,
    }));
  };

  const handleSearch = () => {
    setPage(1); // 검색 시 첫 페이지로 이동
    setSelectedProducts([]); // 선택된 상품 초기화
    fetchProducts();
  };

  // Add loadShops function
  const loadShops = async () => {
    try {
      const data = await getShopOptionList();
      setShops(data);
    } catch (error) {
      console.error('샵 목록 로드 실패:', error);
    }
  };

  // 승인 요청 핸들러 추가
  const handleApproveRequest = async () => {
    if (!selectedProducts.length) {
      setAlertMessage('상품을 먼저 선택해주세요.');
      setShowAlert(true);
      return;
    }

    try {
      await approveProduct(selectedProducts);
      setAlertMessage('승인 요청이 완료되었습니다.');
      setShowAlert(true);
      fetchProducts();
      fetchNotApprovedCount(); // 승인 요청 후 카운트 새로고침
    } catch (error) {
      console.error('승인 요청 실패:', error);
      setAlertMessage('승인 요청 중 오류가 발생했습니다.');
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
            <Badge
              badgeContent={notApprovedCount}
              color="error"
              showZero
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              sx={{
                '& .MuiBadge-badge': {
                  left: -3,
                  top: 3,
                  border: '2px solid #fff',
                  padding: '0 4px',
                },
              }}
            >
              <Button
                variant="contained"
                onClick={handleApproveRequest}
                sx={{
                  backgroundColor: '#2196F3',
                  '&:hover': { backgroundColor: '#1976D2' },
                  mr: 1,
                }}
              >
                승인 요청
              </Button>
            </Badge>
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

        {/* 검색 영역 Paper 컴포넌트와 테이블 컨테이너 사이에 추가 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mb: 2,
            mt: -1,
          }}
        >
          <Typography variant="h9" sx={{ color: '#666' }}>
            검색된 총 상품 수: <strong>{totalCount}</strong>개
          </Typography>
        </Box>

        {/* 검색 영역 수정 */}
        <Paper
          sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #E5E5E5' }}
        >
          <Grid container spacing={3}>
            {/* Add shop selection before the search keyword */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="샵 선택"
                    value={selectedShopId}
                    onChange={(e) => setSelectedShopId(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#00DE90',
                        },
                      },
                    }}
                  >
                    <MenuItem value="">전체</MenuItem>
                    {shops.map((shop) => (
                      <MenuItem key={shop.id} value={shop.id}>
                        {shop.nickName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>

            {/* 검색어 및 카테고리 영역 */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="상품명 검색"
                    value={searchKeyword}
                    onChange={handleSearchKeywordChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#00DE90',
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSearch}
                    startIcon={<SearchIcon />}
                    sx={{
                      height: '40px',
                      backgroundColor: '#00DE90',
                      '&:hover': { backgroundColor: '#00B574' },
                    }}
                  >
                    검색
                  </Button>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleResetSearch}
                    sx={{
                      height: '40px',
                      borderColor: '#00DE90',
                      color: '#00DE90',
                      '&:hover': {
                        borderColor: '#00B574',
                        backgroundColor: 'rgba(0, 222, 144, 0.1)',
                      },
                    }}
                  >
                    검색 초기화
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            {/* 카테고리 선택 영역 */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="1차 카테고리"
                    value={selectedParentId}
                    onChange={handleParentCategoryChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#00DE90',
                        },
                      },
                    }}
                  >
                    <MenuItem value="">전체</MenuItem>
                    {parentCategories.map((category) => (
                      <MenuItem
                        key={category.categoryId}
                        value={category.categoryId}
                      >
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="2차 카테고리"
                    value={selectedSubId}
                    onChange={handleSubCategoryChange}
                    disabled={!selectedParentId}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#00DE90',
                        },
                      },
                    }}
                  >
                    <MenuItem value="">전체</MenuItem>
                    {subCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="3차 카테고리"
                    value={selectedChildId}
                    onChange={handleChildCategoryChange}
                    disabled={!selectedSubId}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#00DE90',
                        },
                      },
                    }}
                  >
                    <MenuItem value="">전체</MenuItem>
                    {childCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>

            {/* 상태 필터 영역 */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="최신상품 여부"
                    value={filters.isNew}
                    onChange={handleFilterChange('isNew')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#00DE90',
                        },
                      },
                    }}
                  >
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="Y">최신상품</MenuItem>
                    <MenuItem value="N">일반상품</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="인기상품 여부"
                    value={filters.best}
                    onChange={handleFilterChange('best')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#00DE90',
                        },
                      },
                    }}
                  >
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="Y">인기상품</MenuItem>
                    <MenuItem value="N">일반상품</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="이벤트상품 여부"
                    value={filters.event}
                    onChange={handleFilterChange('event')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#00DE90',
                        },
                      },
                    }}
                  >
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="Y">이벤트상품</MenuItem>
                    <MenuItem value="N">일반상품</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="승인 여부"
                    value={filters.approvalStatus}
                    onChange={handleFilterChange('approvalStatus')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#00DE90',
                        },
                      },
                    }}
                  >
                    <MenuItem value="">전체</MenuItem>
                    <MenuItem value="Y">승인완료</MenuItem>
                    <MenuItem value="N">미승인</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Grid>

            {/* Add this inside your search Paper component, after the existing filters */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="정렬 순서"
                    value={sortOrder}
                    onChange={handleSortChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#00DE90',
                        },
                      },
                    }}
                  >
                    <MenuItem value="desc">최신순</MenuItem>
                    <MenuItem value="asc">오래된순</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="페이지 사이즈"
                    value={pageSize}
                    onChange={handleSizeChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#00DE90',
                        },
                      },
                    }}
                  >
                    <MenuItem value={10}>10개씩 보기</MenuItem>
                    <MenuItem value={30}>30개씩 보기</MenuItem>
                    <MenuItem value={50}>50개씩 보기</MenuItem>
                    <MenuItem value={100}>100개씩 보기</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

        {/* 테이블 영역 */}
        <TableContainer
          ref={tableContainerRef}
          component={Paper}
          sx={{
            borderRadius: 2,
            border: '1px solid #E5E5E5',
            overflowX: 'auto',
            ...dragScrollStyles,
            '& th.sticky, & td.sticky': {
              position: 'sticky',
              backgroundColor: 'white',
              zIndex: 1,
              '&::after': {
                content: '""',
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '1px',
                backgroundColor: '#E5E5E5',
              },
            },
            '& th.sticky-0, & td.sticky-0': {
              left: 0,
              zIndex: 2,
            },
            '& th.sticky-1, & td.sticky-1': {
              left: 50,
              zIndex: 2,
            },
            '& th.sticky-2, & td.sticky-2': {
              left: 130,
              zIndex: 2,
            },
            '& th.sticky-3, & td.sticky-3': {
              left: 280,
              zIndex: 2,
            },
            '& th.sticky-4, & td.sticky-4': {
              left: 460,
              zIndex: 2,
            },
            '& th.sticky-5, & td.sticky-5': {
              left: 580,
              zIndex: 2,
            },
          }}
          onMouseDown={handleMouseDown}
        >
          <Table sx={{ minWidth: 2000 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FFF8' }}>
                <TableCell
                  padding="checkbox"
                  sx={{ minWidth: 50 }}
                  className="sticky sticky-0"
                >
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
                  className="sticky sticky-1"
                >
                  ID
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ minWidth: 220, fontWeight: 'bold', color: '#1A1A1A' }}
                  className="sticky sticky-2"
                >
                  카테고리
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ minWidth: 120, fontWeight: 'bold', color: '#1A1A1A' }}
                  className="sticky sticky-3"
                >
                  샵이름
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ minWidth: 120, fontWeight: 'bold', color: '#1A1A1A' }}
                  className="sticky sticky-4"
                >
                  이미지
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ minWidth: 250, fontWeight: 'bold', color: '#1A1A1A' }}
                  className="sticky sticky-5"
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
                  할인율
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
                    <TableCell padding="checkbox" className="sticky sticky-0">
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
                    <TableCell
                      align="center"
                      className="sticky sticky-1"
                      onClick={() =>
                        window.open(
                          `${process.env.REACT_APP_FRONT_USER_URL}/product/${product.id}`,
                          '_blank',
                        )
                      }
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: '#00DE90',
                        },
                      }}
                    >
                      {product.id}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="sticky sticky-2"
                      style={{ minWidth: '200px' }} // 최소 너비 설정
                    >
                      {product.categoryAllName}
                    </TableCell>
                    <TableCell align="center" className="sticky sticky-3">
                      {product.shopName}
                    </TableCell>
                    <TableCell align="center" className="sticky sticky-4">
                      {product.uploadFileNames?.[0] && (
                        <ImageLoader
                          imagePath={product.uploadFileNames[0]}
                          alt={product.name}
                          sx={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                          }}
                          type="product"
                        />
                      )}
                    </TableCell>
                    <TableCell align="center" className="sticky sticky-5">
                      {product.name}
                    </TableCell>
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
                      {product.discountRate}%
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
      <ProgressModal
        open={showProgressModal}
        progress={uploadProgress}
        status={progressStatus}
      />

      {/* AlertModal을 ConfirmModal로 변경 */}
      <ConfirmModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="상품 삭제"
        message={`'${selectedProduct?.name}' 상품을 삭제하시겠습니까?`}
      />
    </div>
  );
};

export default ProductPage;
