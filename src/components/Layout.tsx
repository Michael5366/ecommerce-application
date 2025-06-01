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
import { layout } from './Layout';

const Layout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';
  const css = layout();

  return (
    <>
      {isLoading && (
        <Box className={css.layout__loader}>
          <CircularProgress size={30} color="primary" thickness={5} />
        </Box>
      )}

      <ThemeProvider theme={theme}>
        <GlobalStyles styles={{ body: { margin: 0 } }} />

        <Stack minHeight={'100vh'} direction={'column'} justifyContent={'space-between'}>
          <Header />

          <Box
            component={'main'}
            sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center' }}
          >
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
