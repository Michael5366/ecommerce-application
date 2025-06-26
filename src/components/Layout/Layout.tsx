import { Outlet, useNavigation } from 'react-router-dom';
import Header from '../Header/Header';
import { Box, Container, GlobalStyles, Stack, ThemeProvider } from '@mui/material';
import { theme } from '../../styles/theme';
import Footer from '../../pages/Footer/Footer';
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator';
import layoutStyles from './Layout-styles';

const Layout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';
  const css = layoutStyles();

  return (
    <>
      {isLoading && <LoadingIndicator />}

      <ThemeProvider theme={theme}>
        <GlobalStyles styles={{ body: { margin: 0 } }} />

        <Stack className={css['layout']}>
          <Header />

          <Box className={css['layout__main']} component={'main'}>
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
