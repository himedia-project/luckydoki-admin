import { Pagination, Stack } from '@mui/material';

const PageComponent = ({ page, totalPages, handlePageChange }) => {
  return (
    <Stack spacing={2} alignItems="center" sx={{ mt: 3, mb: 3 }}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        color="secondary"
        size="large"
        sx={{
          '& .MuiPaginationItem-root': {
            color: '#2A0934',
            '&.Mui-selected': {
              backgroundColor: '#00DE90',
              '&:hover': {
                backgroundColor: '#00c580',
              },
            },
          },
        }}
      />
    </Stack>
  );
};

export default PageComponent;
