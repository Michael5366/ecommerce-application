import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import { GlobalStyles, ThemeProvider } from '@mui/material';
import { theme } from '../styles/theme';

const Layout = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles styles={{ body: { margin: 0 } }} />

        <Header />
        <Outlet />
      </ThemeProvider>
    </>
  );
};
export default Layout;
