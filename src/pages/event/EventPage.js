import React, { useEffect, useState } from 'react';
import { getList, deleteEvent, getEvent } from '../../api/eventApi';
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
import AlertModal from '../../components/common/AlertModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import ImageLoader from '../../components/image/ImageLoader';
import EventDetailModal from '../../components/event/EventDetailModal';

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedEventDetail, setSelectedEventDetail] = useState(null);
  const [eventDetailOpen, setEventDetailOpen] = useState(false);

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

  const handleDeleteClick = (eventId) => {
    console.log('Delete clicked for eventId:', eventId);
    setSelectedEventId(eventId);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    console.log('Confirming delete for eventId:', selectedEventId);
    try {
      const response = await deleteEvent(selectedEventId);
      console.log('Delete response:', response);
      setConfirmOpen(false);
      setAlertMessage('삭제가 완료되었습니다.');
      setAlertOpen(true);
      fetchEvents(); // 목록 새로고침
    } catch (error) {
      console.error('이벤트 삭제 중 오류 발생:', error);
      setAlertMessage('이벤트 삭제 중 오류가 발생했습니다.');
      setAlertOpen(true);
    }
  };

  const handleEventClick = async (eventId) => {
    try {
      const response = await getEvent(eventId);
      setSelectedEventDetail(response);
      setEventDetailOpen(true);
    } catch (error) {
      console.error('이벤트 상세 정보 로딩 실패:', error);
      setAlertMessage('이벤트 상세 정보를 불러오는데 실패했습니다.');
      setAlertOpen(true);
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
                <TableCell padding="checkbox" sx={{ width: '48px' }}>
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
                  sx={{ fontWeight: 'bold', color: '#1A1A1A', width: '80px' }}
                >
                  ID
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A', width: '200px' }}
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
                  sx={{ fontWeight: 'bold', color: '#1A1A1A', width: '120px' }}
                >
                  이미지
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A', width: '120px' }}
                >
                  시작일
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A', width: '120px' }}
                >
                  종료일
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A', width: '120px' }}
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
                    <TableCell
                      align="center"
                      onClick={() => handleEventClick(event.id)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          color: '#00DE90',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {event.title}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        maxWidth: '300px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {event.content}
                    </TableCell>
                    <TableCell align="center">
                      {event.image && (
                        <ImageLoader
                          imagePath={event.image}
                          alt={event.title}
                          sx={{
                            width: 80,
                            height: 80,
                            objectFit: 'cover',
                            borderRadius: '4px',
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">{event.startAt}</TableCell>
                    <TableCell align="center">{event.endAt}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleEventClick(event.id)}
                        sx={{
                          color: '#00DE90',
                          '&:hover': { bgcolor: 'rgba(0, 222, 144, 0.1)' },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(event.id)}
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

        <ConfirmModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="삭제 확인"
          message="정말 삭제하시겠습니까?"
        />

        <AlertModal
          open={alertOpen}
          onClose={() => setAlertOpen(false)}
          title="알림"
          message={alertMessage}
          isSuccess={true}
        />

        <EventDetailModal
          open={eventDetailOpen}
          onClose={() => setEventDetailOpen(false)}
          event={selectedEventDetail}
        />
      </Container>
    </div>
  );
};

export default EventPage;
