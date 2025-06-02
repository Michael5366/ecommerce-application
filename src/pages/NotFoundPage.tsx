import { JSX } from '@emotion/react/jsx-runtime';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = (): JSX.Element => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
      textAlign="center"
      px={2}
    >
      <Typography variant="h2" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Sorry, the page you are looking for doesn&apos;t exist.
      </Typography>
      <Button variant="outlined" color="inherit" component={Link} to="/">
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
