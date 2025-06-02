import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  useMediaQuery,
  // useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Path } from '../../types/paths';
import { useAuth } from '../../context/context.tsx';

export const showMenu = () => {
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery('(max-width:860px)');

  const { token, logout } = useAuth();
  const auth = Boolean(token);
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const goToRegister = () => {
    handleMenuClose();
    navigate(Path.REGISTRATION, { replace: true, state: { from: location.pathname } });
  };

  if (isMobile) {
    return (
      <>
        <IconButton onClick={handleMenuOpen}>
          <MenuIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose} component={Link} to={'/catalog'}>
            Catalog
          </MenuItem>

          {auth
            ? [
                <MenuItem key="profile" onClick={handleMenuClose} component={Link} to="/profile">
                  Profile
                </MenuItem>,
                <MenuItem
                  key="logout"
                  onClick={() => {
                    handleMenuClose();
                    logout();
                    navigate(Path.LOGIN);
                  }}
                >
                  Logout
                </MenuItem>,
              ]
            : [
                <MenuItem key="login" onClick={handleMenuClose} component={Link} to={Path.LOGIN}>
                  Login
                </MenuItem>,
                <MenuItem key="register" onClick={goToRegister}>
                  Registration
                </MenuItem>,
              ]}
        </Menu>
      </>
    );
  }

  // 💡 Меню для desktop
  return (
    <>
      <Button component={Link} to={'/catalog'} color="inherit" variant="outlined">
        Catalog
      </Button>

      {auth ? (
        <>
          <Button component={Link} to="/profile" color="inherit" variant="outlined">
            Profile
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              logout();
              navigate(Path.LOGIN);
            }}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Tooltip title="Log in to your account" arrow placement="bottom-start" enterDelay={500}>
            <Button variant="outlined" color="inherit" component={Link} to={Path.LOGIN}>
              Login
            </Button>
          </Tooltip>

          <Tooltip title="Create a new account" arrow placement="bottom-start" enterDelay={500}>
            <Button variant="outlined" color="inherit" onClick={goToRegister}>
              Registration
            </Button>
          </Tooltip>
        </>
      )}
    </>
  );
};
