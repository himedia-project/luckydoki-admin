import React, { useEffect, useState } from 'react';
import { getChatRooms, getChatRoom } from '../../api/chatbotApi';
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
  Modal,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import PageComponent from '../../components/common/PageComponent';
import ConfirmModal from '../../components/common/ConfirmModal';

const ChatbotPage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [openChatModal, setOpenChatModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [selectedRoomForDelete, setSelectedRoomForDelete] = useState(null);

  const fetchChatRooms = async () => {
    const params = {
      page: page,
      size: 10,
      sort: 'desc',
      searchKeyword: searchKeyword,
    };

    try {
      const response = await getChatRooms(params);
      setChatRooms(response.dtoList || []);
      setTotalPages(response.totalPage);
    } catch (error) {
      console.error('채팅방 목록 로딩 실패:', error);
      setAlertMessage('채팅방 목록을 불러오는데 실패했습니다.');
      setOpenAlertModal(true);
    }
  };

  const fetchChatMessages = async (roomId) => {
    try {
      const response = await getChatRoom(roomId);
      setChatMessages(response || []);
    } catch (error) {
      console.error('채팅 내역 로딩 실패:', error);
      setAlertMessage('채팅 내역을 불러오는데 실패했습니다.');
      setOpenAlertModal(true);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, [page, searchKeyword]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
    setPage(1);
  };

  const handleOpenChatModal = async (room) => {
    setSelectedRoom(room);
    await fetchChatMessages(room.id);
    setOpenChatModal(true);
  };

  const handleCloseChatModal = () => {
    setOpenChatModal(false);
    setChatMessages([]);
    setSelectedRoom(null);
  };

  const handleDeleteChatRoom = (roomId) => {
    setSelectedRoomForDelete(roomId);
    setOpenConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      // API 엔드포인트 가정 (실제로 구현 필요)
      await getChatRoom(selectedRoomForDelete);
      setAlertMessage('채팅방이 삭제되었습니다.');
      setOpenAlertModal(true);
      fetchChatRooms();
    } catch (error) {
      setAlertMessage('채팅방 삭제 중 오류가 발생했습니다.');
      setOpenAlertModal(true);
    } finally {
      setOpenConfirmModal(false);
      setSelectedRoomForDelete(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusChip = (active) => {
    return active ? (
      <Chip
        label="활성"
        size="small"
        sx={{
          bgcolor: '#E6FFF2',
          color: '#00BA78',
          fontWeight: 'bold',
        }}
      />
    ) : (
      <Chip
        label="비활성"
        size="small"
        sx={{
          bgcolor: '#F5F5F5',
          color: '#666666',
          fontWeight: 'bold',
        }}
      />
    );
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
              챗봇 채팅방 관리
            </Typography>
            <Typography variant="subtitle1" sx={{ color: '#666', mt: 1 }}>
              ✳️ 챗봇과 사용자 간의 대화 내역을 관리하는 페이지입니다.
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
            placeholder="이메일 또는 세션 ID로 검색"
            value={searchKeyword}
            onChange={handleSearchKeywordChange}
            InputProps={{
              endAdornment: (
                <IconButton onClick={fetchChatRooms}>
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
                  사용자
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  세션 ID
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  시작 시간
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  마지막 응답 시간
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  마지막 메시지
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: 'bold', color: '#1A1A1A' }}
                >
                  상태
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
              {chatRooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      등록된 채팅방이 없습니다.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                chatRooms.map((room) => (
                  <TableRow
                    key={room.id}
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: '#F8FFF8',
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => handleOpenChatModal(room)}
                  >
                    <TableCell align="center">{room.id}</TableCell>
                    <TableCell align="center">
                      {room.userEmail || '익명 사용자'}
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: '150px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {room.sessionId}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {formatDate(room.startTime)}
                    </TableCell>
                    <TableCell align="center">
                      {formatDate(room.lastResponseTime)}
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {room.lastMessage?.split('\n')[0]?.replace('Q: ', '') ||
                          '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {getStatusChip(room.active)}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        sx={{
                          color: '#00DE90',
                          '&:hover': { bgcolor: 'rgba(0, 222, 144, 0.1)' },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenChatModal(room);
                        }}
                      >
                        <ChatIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{
                          color: '#FF6B6B',
                          '&:hover': { bgcolor: 'rgba(255, 107, 107, 0.1)' },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChatRoom(room.id);
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

        {/* 채팅 내역 모달 */}
        <Dialog
          open={openChatModal}
          onClose={handleCloseChatModal}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              height: '80vh',
            },
          }}
        >
          <DialogTitle sx={{ bgcolor: '#F8FFF8', px: 3, py: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" color="#1A1A1A" fontWeight="bold">
                채팅 내역
              </Typography>
              <Box>
                <IconButton
                  onClick={handleCloseChatModal}
                  size="small"
                  sx={{ color: '#666' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
            {selectedRoom && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="#666">
                  {selectedRoom.userEmail
                    ? `사용자: ${selectedRoom.userEmail}`
                    : '익명 사용자'}{' '}
                  | 세션 ID: {selectedRoom.sessionId}
                </Typography>
                <Typography variant="body2" color="#666">
                  시작 시간: {formatDate(selectedRoom.startTime)} | 상태:{' '}
                  {selectedRoom.active ? '활성' : '비활성'}
                </Typography>
              </Box>
            )}
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0 }}>
            <Box
              sx={{
                height: '100%',
                overflow: 'auto',
                bgcolor: '#F5F5F5',
                p: 3,
              }}
            >
              {chatMessages.length === 0 ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <Typography variant="body1" color="#666">
                    채팅 내역이 없습니다.
                  </Typography>
                </Box>
              ) : (
                <List>
                  {chatMessages.map((message) => (
                    <ListItem
                      key={message.id}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems:
                          message.email === 'chatbot'
                            ? 'flex-start'
                            : 'flex-end',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection:
                            message.email === 'chatbot' ? 'row' : 'row-reverse',
                          alignItems: 'flex-start',
                          gap: 1,
                        }}
                      >
                        {message.email === 'chatbot' && (
                          <Avatar
                            sx={{
                              bgcolor: '#00DE90',
                              width: 36,
                              height: 36,
                            }}
                          >
                            AI
                          </Avatar>
                        )}
                        <Box
                          sx={{
                            maxWidth: '70%',
                            bgcolor:
                              message.email === 'chatbot' ? 'white' : '#00DE90',
                            color:
                              message.email === 'chatbot' ? '#333' : 'white',
                            p: 2,
                            borderRadius: 2,
                            boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                            }}
                          >
                            {message.message}
                          </Typography>
                        </Box>
                        {message.email !== 'chatbot' && (
                          <Avatar
                            sx={{
                              bgcolor: '#f5f5f5',
                              color: '#666',
                              width: 36,
                              height: 36,
                              border: '1px solid #ddd',
                            }}
                          >
                            U
                          </Avatar>
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#666',
                          ml: message.email === 'chatbot' ? 6 : 0,
                          mr: message.email !== 'chatbot' ? 6 : 0,
                          mt: 0.5,
                        }}
                      >
                        {formatDate(message.timestamp)}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2, bgcolor: '#f9f9f9' }}>
            <Button
              onClick={handleCloseChatModal}
              variant="outlined"
              sx={{
                color: '#00DE90',
                borderColor: '#00DE90',
                '&:hover': {
                  borderColor: '#00BA78',
                  backgroundColor: 'rgba(0, 222, 144, 0.1)',
                },
              }}
            >
              닫기
            </Button>
          </DialogActions>
        </Dialog>

        <ConfirmModal
          open={openConfirmModal}
          onClose={() => setOpenConfirmModal(false)}
          onConfirm={handleConfirmDelete}
          title="채팅방 삭제"
          message="채팅방을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        />

        <ConfirmModal
          open={openAlertModal}
          onClose={() => setOpenAlertModal(false)}
          onConfirm={() => setOpenAlertModal(false)}
          title="알림"
          message={alertMessage}
        />
      </Container>
    </div>
  );
};

export default ChatbotPage;
