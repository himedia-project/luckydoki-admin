import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { issueCoupon } from '../../api/couponApi';
import { getList } from '../../api/memberApi';

const IssueCouponModal = ({ open, onClose, coupon, onSuccess }) => {
  const [members, setMembers] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchMembers = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await getList({
        page: pageNum,
        size: 10,
        sort: 'desc',
        searchKeyword: searchKeyword,
      });

      if (pageNum === 1) {
        setMembers(response.dtoList || []);
      } else {
        setMembers((prev) => [...prev, ...(response.dtoList || [])]);
      }

      setTotalPages(response.totalPage);
      setLoading(false);
    } catch (error) {
      console.error('회원 목록 로딩 실패:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setPage(1);
      fetchMembers(1);
    }
  }, [open, searchKeyword]);

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (
      scrollHeight - scrollTop <= clientHeight * 1.5 &&
      !loading &&
      page < totalPages
    ) {
      setPage((prev) => prev + 1);
      fetchMembers(page + 1);
    }
  };

  const handleSelectMember = (email) => {
    setSelectedEmails((prev) => {
      if (prev.includes(email)) {
        return prev.filter((e) => e !== email);
      } else {
        return [...prev, email];
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const requestData = {
        emails: selectedEmails,
      };

      await issueCoupon(coupon.id, requestData);
      onSuccess();
      onClose();
      setSelectedEmails([]);
    } catch (error) {
      console.error('쿠폰 발급 실패:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
        쿠폰 발급
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {coupon && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 'bold', mb: 1 }}
              >
                선택된 쿠폰
              </Typography>
              <Box sx={{ p: 2, bgcolor: '#F8FFF8', borderRadius: 1 }}>
                <Typography variant="body1">{coupon.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {coupon.content}
                </Typography>
              </Box>
            </Box>
          )}

          <TextField
            fullWidth
            placeholder="회원 검색 (이메일, 닉네임)"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => fetchMembers(1)}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              선택된 회원 ({selectedEmails.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedEmails.map((email) => (
                <Chip
                  key={email}
                  label={email}
                  onDelete={() => handleSelectMember(email)}
                  sx={{ backgroundColor: '#E8F5E9' }}
                />
              ))}
            </Box>
          </Box>

          <Paper
            sx={{ maxHeight: 300, overflow: 'auto' }}
            onScroll={handleScroll}
          >
            <List>
              {members.map((member) => (
                <ListItem
                  key={member.email}
                  dense
                  button
                  onClick={() => handleSelectMember(member.email)}
                >
                  <Checkbox
                    edge="start"
                    checked={selectedEmails.includes(member.email)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText
                    primary={member.email}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          {member.nickName} • {member.phone}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
              {loading && (
                <ListItem>
                  <ListItemText primary="로딩 중..." align="center" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#666' }}>
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={selectedEmails.length === 0}
          sx={{
            bgcolor: '#00DE90',
            '&:hover': { bgcolor: '#00BA78' },
          }}
        >
          발급하기 ({selectedEmails.length}명)
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IssueCouponModal;
