import React, { useState } from 'react';
import { Button, IconButton, Menu, MenuItem, Tooltip, useMediaQuery, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MoreVertIcon from '@mui/icons-material/MoreVert';
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
  console.log('cartItemCount', cartItemCount);

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
            {t('Catalog')}
          </MenuItem>
          <MenuItem onClick={handleMenuClose} component={Link} to={Path.BASKET}>
            <ShoppingCartIcon sx={{ mr: 1 }} />
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
                <MenuItem
                  key="about"
                  onClick={() => {
                    handleMenuClose();
                    navigate(Path.ABOUTUS);
                  }}
                >
                  {t('About us')}
                </MenuItem>,
              ]
            : [
                <MenuItem key="login" onClick={handleMenuClose} component={Link} to={Path.LOGIN}>
                  {t('Login')}
                </MenuItem>,
                <MenuItem key="register" onClick={goToRegister}>
                  {t('Registration')}
                </MenuItem>,
                <MenuItem
                  key="about"
                  onClick={() => {
                    handleMenuClose();
                    navigate(Path.ABOUTUS);
                  }}
                >
                  {t('About us')}
                </MenuItem>,
              ]}
        </Menu>
      </>
    );
  }

  return (
    <>
      <Button component={Link} to={Path.CATALOG} color="inherit" variant="outlined">
        {t('Catalog')}
      </Button>

      <IconButton component={Link} to={Path.BASKET} color="inherit">
        <Badge badgeContent={cartItemCount} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      {auth ? (
        <>
          <Button component={Link} to={Path.PROFILE} color="inherit" variant="outlined">
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
          <Button component={Link} to={Path.ABOUTUS} color="inherit" variant="outlined">
            {t('About us')}
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

          <Tooltip title={t('About us')} arrow placement="bottom-start" enterDelay={500}>
            <Button component={Link} to={Path.ABOUTUS} color="inherit" variant="outlined">
              {t('About us')}
            </Button>
          </Tooltip>
        </>
      )}
    </>
  );
};

export default ShowMenu;
