import { Button, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';
import { Path } from '../../types/paths';
import { useState } from 'react';
import { JSX } from '@emotion/react/jsx-runtime';

export const showMenu = (): JSX.Element => {
  const them = useTheme();
  const getToken: string | null = localStorage.getItem('authToken');
  const isAuthenticated: boolean = Boolean(getToken);
  const [auth, setAuth] = useState(isAuthenticated);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMobile: boolean = useMediaQuery(them.breakpoints.down('sm'));

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuth(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (auth) {
    return (
      <Button color="inherit" onClick={logout}>
        Logout
      </Button>
    );
  }

  if (!isMobile) {
    return (
      <>
        <Button color="inherit" component={Link} to={Path.LOGIN}>
          Login
        </Button>
        <Button color="inherit" component={Link} to={Path.REGISTRATION}>
          Registration
        </Button>
      </>
    );
  }

  return (
    <>
      <IconButton onClick={handleMenuOpen}>
        <MenuIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose} component={Link} to={Path.LOGIN}>
          Login
        </MenuItem>
        <MenuItem onClick={handleMenuClose} component={Link} to={Path.REGISTRATION}>
          Registration
        </MenuItem>
      </Menu>
    </>
  );
};
