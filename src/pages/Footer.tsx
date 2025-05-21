import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#fff',
        borderTop: '1px solid #333',
        py: 2,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="#333" align="center">
          © {new Date().getFullYear()} This is an educational project. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
