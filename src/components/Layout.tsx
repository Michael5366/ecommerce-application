import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import { Box, Container, GlobalStyles, ThemeProvider } from '@mui/material';
import { theme } from '../styles/theme';

const Layout = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles styles={{ body: { margin: 0 } }} />

        <Header />
        <Box component={'main'}>
          <Container>
            <Outlet />
          </Container>
        </Box>
      </ThemeProvider>
    </>
  );
};
export default Layout;
