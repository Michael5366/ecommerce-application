import React, { useState } from 'react';
import { Button, IconButton, Menu, MenuItem, Tooltip, useMediaQuery, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import InfoIcon from '@mui/icons-material/Info';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Path } from '../../types/paths';
import { useAuth } from '../../context/context';
import { useTranslation } from 'react-i18next';
import { useCartContext } from '../../hooks/CartContext';

const ShowMenu = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const { token, logout } = useAuth();
  const auth = Boolean(token);
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation();
  const { itemCount: cartItemCount } = useCartContext();

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
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleMenuOpen}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose} component={Link} to={Path.CATALOG}>
            <MenuBookIcon sx={{ mr: 1 }} />
            {t('Catalog')}
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={Link} to={Path.BASKET}>
            <Badge badgeContent={cartItemCount} color="secondary">
              <ShoppingCartIcon sx={{ mr: 1 }} />
            </Badge>
            {t('Basket')}
          </MenuItem>

          {auth
            ? [
                <MenuItem
                  key="profile"
                  onClick={handleMenuClose}
                  component={Link}
                  to={Path.PROFILE}
                >
                  <AccountCircleIcon sx={{ mr: 1 }} />
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
                  <LogoutIcon sx={{ mr: 1 }} />
                  {t('Logout')}
                </MenuItem>,
                <MenuItem
                  key="about"
                  onClick={() => {
                    handleMenuClose();
                    navigate(Path.ABOUTUS);
                  }}
                >
                  <InfoIcon sx={{ mr: 1 }} />
                  {t('About us')}
                </MenuItem>,
              ]
            : [
                <MenuItem key="login" onClick={handleMenuClose} component={Link} to={Path.LOGIN}>
                  <LoginIcon sx={{ mr: 1 }} />
                  {t('Login')}
                </MenuItem>,
                <MenuItem key="register" onClick={goToRegister}>
                  <HowToRegIcon sx={{ mr: 1 }} />
                  {t('Registration')}
                </MenuItem>,
                <MenuItem
                  key="about"
                  onClick={() => {
                    handleMenuClose();
                    navigate(Path.ABOUTUS);
                  }}
                >
                  <InfoIcon sx={{ mr: 1 }} />
                  {t('About us')}
                </MenuItem>,
              ]}
        </Menu>
      </>
    );
  }

  return (
    <>
      <Tooltip title={t('Browse our catalog')} arrow placement="bottom-start" enterDelay={500}>
        <Button
          component={Link}
          to={Path.CATALOG}
          color="inherit"
          variant="outlined"
          startIcon={<MenuBookIcon />}
        >
          {t('Catalog')}
        </Button>
      </Tooltip>

      <Tooltip title={t('View your basket')} arrow placement="bottom-start" enterDelay={500}>
        <Button
          component={Link}
          to={Path.BASKET}
          color="inherit"
          variant="outlined"
          startIcon={
            <Badge badgeContent={cartItemCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          }
        >
          {t('Basket')}
        </Button>
      </Tooltip>

      {auth ? (
        <>
          <Tooltip title={t('Your profile')} arrow placement="bottom-start" enterDelay={500}>
            <Button
              component={Link}
              to={Path.PROFILE}
              color="inherit"
              variant="outlined"
              startIcon={<AccountCircleIcon />}
            >
              {t('Profile')}
            </Button>
          </Tooltip>

          <Tooltip
            title={t('Log out from your account')}
            arrow
            placement="bottom-start"
            enterDelay={500}
          >
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={() => {
                sessionStorage.removeItem('guestToken');
                sessionStorage.removeItem('cart_id');
                logout();
                navigate(Path.LOGIN);
              }}
            >
              {t('Logout')}
            </Button>
          </Tooltip>

          <Tooltip title={t('About our project')} arrow placement="bottom-start" enterDelay={500}>
            <Button
              component={Link}
              to={Path.ABOUTUS}
              color="inherit"
              variant="outlined"
              startIcon={<InfoIcon />}
            >
              {t('About us')}
            </Button>
          </Tooltip>
        </>
      ) : (
        <>
          <Tooltip
            title={t('Log in to your account')}
            arrow
            placement="bottom-start"
            enterDelay={500}
          >
            <Button
              variant="outlined"
              color="inherit"
              component={Link}
              to={Path.LOGIN}
              startIcon={<LoginIcon />}
            >
              {t('Login')}
            </Button>
          </Tooltip>

          <Tooltip
            title={t('Create a new account')}
            arrow
            placement="bottom-start"
            enterDelay={500}
          >
            <Button
              variant="outlined"
              color="inherit"
              onClick={goToRegister}
              startIcon={<HowToRegIcon />}
            >
              {t('Registration')}
            </Button>
          </Tooltip>

          <Tooltip title={t('About our project')} arrow placement="bottom-start" enterDelay={500}>
            <Button
              component={Link}
              to={Path.ABOUTUS}
              color="inherit"
              variant="outlined"
              startIcon={<InfoIcon />}
            >
              {t('About us')}
            </Button>
          </Tooltip>
        </>
      )}
    </>
  );
};

export default ShowMenu;
