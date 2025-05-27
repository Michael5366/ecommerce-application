import { Outlet, useNavigation } from 'react-router-dom';
import Header from './Header/Header';
import {
  Box,
  CircularProgress,
  Container,
  GlobalStyles,
  Stack,
  ThemeProvider,
} from '@mui/material';
import { theme } from '../styles/theme';
import Footer from '../pages/Footer';

const Layout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <>
      {isLoading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100vw"
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor="rgba(255, 255, 255, 0.6)"
          zIndex={9999}
        >
          <CircularProgress size={30} color="primary" thickness={5} />
        </Box>
      )}

      <ThemeProvider theme={theme}>
        <GlobalStyles styles={{ body: { margin: 0 } }} />

        <Stack minHeight={'100vh'} direction={'column'} justifyContent={'space-between'}>
          <Header />

          <Box component={'main'} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Container sx={{ py: 1 }}>
              <Outlet />
            </Container>
          </Box>

          <Footer />
        </Stack>
      </ThemeProvider>
    </>
  );
};

export default Layout;
