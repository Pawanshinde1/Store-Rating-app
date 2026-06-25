import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ fullScreen = false, message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        ...(fullScreen && { minHeight: '100vh' }),
        ...(!fullScreen && { py: 8 }),
      }}
    >
      <CircularProgress />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
};

export default LoadingSpinner;
