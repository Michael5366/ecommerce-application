import { Outlet, useNavigation } from 'react-router-dom';
import Header from '../Header/Header';
import { Box, Container, GlobalStyles, Stack, ThemeProvider } from '@mui/material';
import { theme } from '../../styles/theme';
import Footer from '../../pages/Footer';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';

const Layout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <>
      {isLoading && <LoadingIndicator />}

      <ThemeProvider theme={theme}>
        <GlobalStyles styles={{ body: { margin: 0 } }} />

        <Stack minHeight={'100vh'} direction={'column'} justifyContent={'space-between'}>
          <Header />

          <Box
            component={'main'}
            sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' }}
          >
            <Container sx={{ py: 1 }} maxWidth={false}>
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
