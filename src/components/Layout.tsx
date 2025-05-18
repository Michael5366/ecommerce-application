import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import { GlobalStyles } from '@mui/material';

const Layout = () => {
  return (
    <>
      <GlobalStyles styles={{ body: { margin: 0 } }} />

      <Header />
      <Outlet />
    </>
  );
};
export default Layout;
