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
import { useAuth } from '../../context/context';
import { useTranslation } from 'react-i18next';

const ShowMenu = () => {
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery('(max-width:860px)');

  const { token, logout } = useAuth();
  const auth = Boolean(token);
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { t } = useTranslation();

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
            {t('Catalog')}
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={Link} to={Path.BASKET}>
            {t('Basket')}
          </MenuItem>

          {auth
            ? [
                <MenuItem key="profile" onClick={handleMenuClose} component={Link} to="/profile">
                  {t('Profile')}
                </MenuItem>,
                <MenuItem
                  key="logout"
                  onClick={() => {
                    handleMenuClose();
                    sessionStorage.removeItem('guestToken');
                    sessionStorage.removeItem('cart_id');
                    logout();
                    navigate(Path.LOGIN);
                  }}
                >
                  {t('Logout')}
                </MenuItem>,
              ]
            : [
                <MenuItem key="login" onClick={handleMenuClose} component={Link} to={Path.LOGIN}>
                  {t('Login')}
                </MenuItem>,
                <MenuItem key="register" onClick={goToRegister}>
                  {t('Registration')}
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
        {t('Catalog')}
      </Button>
      <Button component={Link} to={Path.BASKET} color="inherit" variant="outlined">
        {t('Basket')}
      </Button>

      {auth ? (
        <>
          <Button component={Link} to="/profile" color="inherit" variant="outlined">
            {t('Profile')}
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              sessionStorage.removeItem('guestToken');
              sessionStorage.removeItem('cart_id');
              logout();
              navigate(Path.LOGIN);
            }}
          >
            {t('Logout')}
          </Button>
        </>
      ) : (
        <>
          <Tooltip
            title={t('Log in to your account')}
            arrow
            placement="bottom-start"
            enterDelay={500}
          >
            <Button variant="outlined" color="inherit" component={Link} to={Path.LOGIN}>
              {t('Login')}
            </Button>
          </Tooltip>

          <Tooltip
            title={t('Create a new account')}
            arrow
            placement="bottom-start"
            enterDelay={500}
          >
            <Button variant="outlined" color="inherit" onClick={goToRegister}>
              {t('Registration')}
            </Button>
          </Tooltip>
        </>
      )}
    </>
  );
};

export default ShowMenu;
