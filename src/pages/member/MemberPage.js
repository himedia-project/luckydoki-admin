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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const MemberPage = () => {
  const [members, setMembers] = useState([
    // 임시 데이터
    {
      id: 1,
      username: 'test',
      email: 'test@test.com',
      phone: '010-1234-5678',
      createdAt: '2025-01-03 13:15:52',
      modifiedAt: '2025-01-03 13:15:52',
    },
  ]);
  const [searchKeyword, setSearchKeyword] = useState('');

  return (
    <div style={{ backgroundColor: '#F5FFF5', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* 상단 헤더 영역 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ color: '#1A1A1A', fontWeight: 'bold' }}
          >
            회원 관리
          </Typography>
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
            placeholder="회원명 검색"
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
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  이름
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  이메일
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#1A1A1A' }}>
                  전화번호
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
              {members.map((member) => (
                <TableRow
                  key={member.id}
                  hover
                  sx={{
                    '&:hover': {
                      bgcolor: '#F8FFF8',
                    },
                  }}
                >
                  <TableCell>{member.id}</TableCell>
                  <TableCell>{member.username}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>{member.createdAt}</TableCell>
                  <TableCell>{member.modifiedAt}</TableCell>
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
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
};

export default MemberPage;
