import { Box, CircularProgress } from '@mui/material';
import LoadingIndicatorStyle from './LoadingIndicatorStyle';

const LoadingIndicator = () => {
  const css = LoadingIndicatorStyle();

  return (
    <Box className={css['loading-indicator']}>
      <CircularProgress size={30} color="primary" thickness={5} />
    </Box>
  );
};

export default LoadingIndicator;
