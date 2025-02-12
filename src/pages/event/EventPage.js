import React, { useEffect, useState } from 'react';
import { getList } from '../../api/eventApi';
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
import Checkbox from '@mui/material/Checkbox';
import PageComponent from '../../components/common/PageComponent';
import CreateEventModal from '../../components/event/CreateEventModal';

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const fetchEvents = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
      searchKeyword: searchKeyword,
    };

    try {
      const response = await getList(params);
      setEvents(response.dtoList || []);
      setTotalPages(response.totalPage);
    } catch (error) {
      console.error('이벤트 목록 로딩 실패:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page, searchKeyword]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSelectEvent = (eventId) => {
    setSelectedEvents((prev) => {
      if (prev.includes(eventId)) {
        return prev.filter((id) => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedEvents(events.map((event) => event.id));
    } else {
      setSelectedEvents([]);
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
              이벤트 관리
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#666', mt: 1 }}>
              ✳️ 이벤트를 관리하는 페이지입니다.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => setOpenCreateModal(true)}
            sx={{
              bgcolor: '#00DE90',
              '&:hover': { bgcolor: '#00BA78' },
              height: 'fit-content',
            }}
          >
            이벤트 등록
          </Button>
        </Box>

        {/* 검색 영역 */}
        <Paper
          sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid #E5E5E5' }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="이벤트명 검색"
            value={searchKeyword}
            onChange={handleSearchKeywordChange}
            InputProps={{
              endAdornment: (
                <IconButton onClick={fetchEvents}>
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
                    checked={selectedEvents.length === events.length}
                    indeterminate={
                      selectedEvents.length > 0 &&
                      selectedEvents.length < events.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
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
                  이벤트명
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  내용
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  이미지
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  시작일
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  종료일
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
              {events.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      등록된 이벤트가 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                events.map((event) => (
                  <TableRow
                    key={event.id}
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: '#F8FFF8',
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedEvents.includes(event.id)}
                        onChange={() => handleSelectEvent(event.id)}
                        sx={{
                          '&.Mui-checked': {
                            color: '#00DE90',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">{event.id}</TableCell>
                    <TableCell align="center">{event.title}</TableCell>
                    <TableCell align="center">{event.content}</TableCell>
                    <TableCell align="center">
                      {event.image && (
                        <Box
                          component="img"
                          src={`${API_SERVER_HOST}/api/image/view/${event.image}`}
                          sx={{
                            width: 40,
                            height: 40,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">{event.startAt}</TableCell>
                    <TableCell align="center">{event.endAt}</TableCell>
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

        <CreateEventModal
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          onSuccess={fetchEvents}
        />
      </Container>
    </div>
  );
};

export default EventPage;
