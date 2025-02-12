import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Checkbox,
  Paper,
  IconButton,
} from '@mui/material';
import { register } from '../../api/eventApi';
import { getList } from '../../api/productApi';
import CloseIcon from '@mui/icons-material/Close';

const CreateEventModal = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    file: null,
    startAt: '',
    endAt: '',
    productIds: [],
  });
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchProducts = async (pageNum, search = '') => {
    try {
      setLoading(true);
      const response = await getList({
        page: pageNum,
        size: 20,
        sort: 'desc',
        searchKeyword: search,
      });

      if (pageNum === 1) {
        setProducts(response.dtoList || []);
      } else {
        setProducts((prev) => [...prev, ...(response.dtoList || [])]);
      }

      setHasMore((response.dtoList || []).length === 20);
      setLoading(false);
    } catch (error) {
      console.error('상품 목록 조회 실패:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setPage(1);
      fetchProducts(1, searchTerm);
    }
  }, [open, searchTerm]);

  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loading) {
      setPage((prev) => prev + 1);
      fetchProducts(page + 1, searchTerm);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const eventData = new FormData();
      eventData.append('title', formData.title);
      eventData.append('content', formData.content);
      if (formData.file) {
        eventData.append('file', formData.file);
      }
      eventData.append('startAt', formData.startAt);
      eventData.append('endAt', formData.endAt);
      formData.productIds.forEach((id) => {
        eventData.append('productIds', id);
      });

      await register(eventData);
      onSuccess();
      onClose();
      setFormData({
        title: '',
        content: '',
        file: null,
        startAt: '',
        endAt: '',
        productIds: [],
      });
    } catch (error) {
      console.error('이벤트 등록 실패:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file: file,
      }));

      // 이미지 미리보기 URL 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        file: null,
      }));
      setPreviewUrl(null);
    }
  };

  // 모달이 닫힐 때 미리보기 초기화
  useEffect(() => {
    if (!open) {
      setPreviewUrl(null);
    }
  }, [open]);

  const handleProductChange = (product) => {
    setFormData((prev) => {
      const newProductIds = prev.productIds.includes(product.id)
        ? prev.productIds.filter((id) => id !== product.id)
        : [...prev.productIds, product.id];
      return { ...prev, productIds: newProductIds };
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
        이벤트 등록
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            name="title"
            label="이벤트명"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="content"
            label="내용"
            value={formData.content}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            required
          />
          <Box>
            <input
              type="file"
              accept="image/*"
              id="event-image"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor="event-image">
              <Button
                variant="outlined"
                component="span"
                sx={{
                  mb: 2,
                  color: '#00DE90',
                  borderColor: '#00DE90',
                  '&:hover': {
                    borderColor: '#00BA78',
                    backgroundColor: 'rgba(0, 222, 144, 0.04)',
                  },
                }}
              >
                이미지 선택
              </Button>
            </label>

            {previewUrl && (
              <Box
                sx={{
                  mt: 2,
                  position: 'relative',
                  width: '100%',
                  maxWidth: 300,
                  margin: '0 auto',
                }}
              >
                <Box
                  component="img"
                  src={previewUrl}
                  alt="이벤트 이미지 미리보기"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 1,
                    boxShadow: 1,
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, file: null }));
                    setPreviewUrl(null);
                  }}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
          <FormControl fullWidth>
            <InputLabel id="products-label" sx={{ position: 'static', mb: 1 }}>
              선택된 상품
            </InputLabel>
            <Box
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                p: 1,
                mb: 2,
                minHeight: 50,
                backgroundColor: '#fff',
              }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {formData.productIds.map((id) => {
                  const product = products.find((p) => p.id === id);
                  return (
                    product && (
                      <Chip
                        key={id}
                        label={product.name}
                        onDelete={() => handleProductChange(product)}
                        sx={{
                          backgroundColor: '#E8F5E9',
                          m: 0.5,
                        }}
                      />
                    )
                  );
                })}
              </Box>
            </Box>

            <TextField
              size="small"
              placeholder="상품 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Paper
              sx={{
                maxHeight: 200,
                overflow: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: 1,
              }}
              onScroll={handleScroll}
            >
              {products.map((product) => (
                <MenuItem
                  key={product.id}
                  onClick={() => handleProductChange(product)}
                  sx={{
                    backgroundColor: formData.productIds.includes(product.id)
                      ? '#E8F5E9'
                      : 'inherit',
                  }}
                >
                  <Checkbox
                    checked={formData.productIds.includes(product.id)}
                    sx={{ padding: 0.5, mr: 1 }}
                  />
                  {product.name}
                </MenuItem>
              ))}
              {loading && (
                <Box sx={{ p: 1, textAlign: 'center' }}>로딩 중...</Box>
              )}
            </Paper>
          </FormControl>
          <TextField
            name="startAt"
            label="시작일"
            type="date"
            value={formData.startAt}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="endAt"
            label="종료일"
            type="date"
            value={formData.endAt}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#666' }}>
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            bgcolor: '#00DE90',
            '&:hover': { bgcolor: '#00BA78' },
          }}
        >
          등록
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEventModal;
